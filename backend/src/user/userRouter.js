import express from "express";
import {
    createUser,
    login,
    getUserById,
    updateUserById,
} from "./userController.js";
import { verifyJWT } from "../middleware/userMiddleware.js";

const userRouter = express.Router();

userRouter.post("/createUser", createUser);

userRouter.post("/login", login);

userRouter.get("/:id", verifyJWT, getUserById);

userRouter.put("/:id", verifyJWT, updateUserById);

export default userRouter;
