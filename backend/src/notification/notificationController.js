import createHttpError from "http-errors";
import notificationModel from "../notification/notificationModel.js";

// GET all notifications for logged-in user
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationModel
      .find({ user: req.user.sub }) // req.user.sub comes from JWT
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (err) {
    next(createHttpError(500, "Failed to fetch notifications"));
  }
};

// Mark one notification as read
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationModel.findOneAndUpdate(
      { _id: req.params.id, user: req.user.sub },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return next(createHttpError(404, "Notification not found"));
    }

    res.status(200).json(notification);
  } catch (err) {
    next(createHttpError(500, "Failed to update notification"));
  }
};
