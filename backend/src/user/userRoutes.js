import express from "express";
import {
    getProfile,
    updateProfile,
    updateSettings,
    getUserById,
} from "./userController.js";
import verifyJWT from "../middleware/userMiddleware.js"; 

const userRoutes = express.Router();

userRoutes.get("/profile", verifyJWT, getProfile); 

userRoutes.put("/me", verifyJWT, updateProfile); 

userRoutes.put("/me/settings", verifyJWT, updateSettings);

userRoutes.get("/users/:id", getUserById); 

export default userRoutes;
