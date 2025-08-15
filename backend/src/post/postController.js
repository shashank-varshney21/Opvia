import createHttpError from "http-errors";
import postModel from "./postModel.js";

// Create a Post
const createPost = async (req, res, next) => {
    try {
        const { content } = req.body;
        const userId = req.user?.sub; // Get userId from JWT

        if (!userId || !content) {
            return next(createHttpError(400, "User ID and content are required"));
        }

        const post = await postModel.create({ user: userId, content });

        res.status(201).json(post);
    } catch (err) {
        console.error(err);
        next(createHttpError(500, "Error creating post"));
    }
};


//  Get User Feed 
const getUserFeed = async (req, res, next) => {
    try {
        const posts = await postModel.find()
            .populate("user", "Username email")
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        next(createHttpError(500, "Error fetching feed"));
    }
};

export { createPost, getUserFeed };
