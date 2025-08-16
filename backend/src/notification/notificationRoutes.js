import express from "express";
import { getNotifications, markAsRead } from "./notificationController.js";
import verifyJWT from "../middleware/userMiddleware.js";

const notificationRoutes = express.Router();

notificationRoutes.get("/", verifyJWT, getNotifications);
notificationRoutes.put("/:id/read", verifyJWT, markAsRead);

export default notificationRoutes;
