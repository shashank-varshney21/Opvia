import userModel from "../user/userModel.js";
import postModel from "../post/postModel.js";
import notificationModel from "../notification/notificationModel.js";
import createHttpError from "http-errors";

export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.sub;

    const [user, posts, notifications] = await Promise.all([
      userModel.findById(userId).select("-password"),
      postModel.find({ user: userId }),
      notificationModel.find({ user: userId, read: false }),
    ]);

    if (!user) return next(createHttpError(404, "User not found"));

    res.status(200).json({
      user,
      stats: {
        totalPosts: posts.length,
        unreadNotifications: notifications.length,
      },
    });
  } catch (err) {
    next(createHttpError(500, "Failed to load dashboard"));
  }
};
