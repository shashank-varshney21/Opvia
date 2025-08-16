import express from "express";
import { createChat, sendMessage, getMessages } from "./chatController.js";

const chatRoutes = express.Router();

// Create a chat
chatRoutes.post("/", createChat);

// Send a message
chatRoutes.post("/message", sendMessage);

// Get all messages for a chat
chatRoutes.get("/:chatId/messages", getMessages);

export default chatRoutes;
