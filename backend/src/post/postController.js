import createHttpError from "http-errors";
import postModel from "./postModel.js";

// Create a Post
export const createPost = async (req, res, next) => {
  try {
    const { content, media } = req.body; // allow optional media
    const userId = req.user?.id; // comes from JWT payload
    if (!userId || !content.trim()) {
      return next(createHttpError(400, "User ID and content are required"));
    }

    // create new post
    const post = await postModel.create({
      user: userId,
      content,
      media: media || null,
      likes: [], 
      comments: []
    }); 
     await post.populate("user", "Username email");

    res.status(201).json(post);
  } catch (err) {
    console.error("Error creating post:", err);
    next(createHttpError(500, "Error creating post"));
  }
};

// Get User Feed
export const getUserFeed = async (req, res, next) => {
  try {
    const posts = await postModel
      .find()
      .populate("user", "Username email")               // show post owner's Username + email
      .populate("comments.user", "Username email")      // show commenter’s Username + email
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching feed:", err);
    next(createHttpError(500, "Error fetching feed"));
  }
};


export const likePost = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id; // depends on your auth
    const { postId } = req.params;

    const post = await postModel.findById(postId);
    if (!post) return next(createHttpError(404, "Post not found"));

    // Toggle like
    const index = post.likes.indexOf(userId);
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();

    // Repopulate for frontend
    await post.populate("user", "Username email");
    await post.populate("comments.user", "Username");

    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    next(createHttpError(500, "Error liking post"));
  }
};

// ✅ Add Comment
export const addComment = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { postId } = req.params;
    const { text } = req.body;

    const post = await postModel.findById(postId);
    if (!post) return next(createHttpError(404, "Post not found"));

    post.comments.push({ user: userId, text });

    await post.save();

    // Repopulate for frontend
    await post.populate("user", "Username email");
    await post.populate("comments.user", "Username");

    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    next(createHttpError(500, "Error adding comment"));
  }
};