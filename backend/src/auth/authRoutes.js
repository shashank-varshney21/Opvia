import express from "express";
import { register, login, logout ,me} from "./authController.js";
import verifyJWT from "../middleware/userMiddleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);

authRoutes.post("/login", login);

authRoutes.post("/logout", verifyJWT, logout);

authRoutes.get("/me", verifyJWT, me);

export default authRoutes;
