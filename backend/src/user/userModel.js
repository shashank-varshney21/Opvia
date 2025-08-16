import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  Username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password

  // match Profile.jsx
  profilePic: { type: String, default: '' }, // instead of avatar
  role: { type: String, default: 'user' },   // can be 'user', 'admin', etc.
  about: { type: String, default: '' },      // instead of bio
  skills: { type: [String], default: [] },   // array of skills

  settings: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema, 'Users');
