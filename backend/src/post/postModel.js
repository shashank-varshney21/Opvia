import mongoose from "mongoose";

// Comment Schema
const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  text: { type: String, required: true }, // frontend expects "text"
  createdAt: { type: Date, default: Date.now }
});

// Post Schema
const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  content: { type: String, required: true }, // post body
  media: { type: String }, // optional (image/video)
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
  comments: [commentSchema], // nested subdocuments
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Post", postSchema, "Posts");
