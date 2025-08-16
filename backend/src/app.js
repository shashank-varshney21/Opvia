import express from 'express';
import passport from 'passport';
import session from 'express-session';
import globalErrorHandler from './middleware/GlobalErrorHandler.js';
import { googleStrategy } from './config/googleAuth.js';
import chatRoutes from './chat/chatRoutes.js';
import postRoutes from './post/postRoutes.js'
import authRoutes from './auth/authRoutes.js';
import userRoutes from './user/userRoutes.js';
import notificationRoutes from './notification/notificationRoutes.js';
import dashboardRoutes from './dashboard/dashboardRoutes.js';

import cors from "cors";

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true
}));

// Parse JSON
app.use(express.json());


// --- Session & Passport Setup ---
app.use(session({
  secret: 'your-secret-key', // Move to .env in future
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Configure Google OAuth strategy
passport.use(googleStrategy); 

// Serialize & deserialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// --- Google OAuth Routes ---
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.get('/logout', (req, res) => {
  req.logout((err) => {
    res.redirect('/');
  });
});

app.get('/', (req, res) => {
  res.send(req.isAuthenticated() ? `Hello, ${req.user.displayName}` : 'Please log in');
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// --- Global Error Handler ---
app.use(globalErrorHandler);

export default app;
