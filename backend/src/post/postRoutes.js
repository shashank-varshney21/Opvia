import express from "express";
import {
    createPost,
    getUserFeed,
    likePost,
    addComment,
} from "./postController.js";
import verifyJWT from "../middleware/userMiddleware.js";

const postRoutes = express.Router(); 

postRoutes.post("/", verifyJWT, createPost);

postRoutes.get("/feed", verifyJWT, getUserFeed);

postRoutes.post("/:postId/like", verifyJWT, likePost);

postRoutes.post("/:postId/comment", verifyJWT, addComment);

export default postRoutes;
