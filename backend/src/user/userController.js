import createHttpError from "http-errors";
import Joi from "joi";
import userModel from "./userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const getProfile = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user.id).select("-password");
        console.log("user", req.user.id);
        if (!user) {
            return next(createHttpError(404, "User not found"));
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, "Error fetching profile"));
    }
};

const updateProfile = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
console.log("Update Data:", updateData);
    delete updateData.email;     // don’t allow email change directly
    delete updateData.role;      // only admins can change role

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // update and return user (excluding password)
    const user = await userModel
      .findByIdAndUpdate(req.user.id, updateData, {
        new: true,
        runValidators: true,
      })
      .select("-password");

    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Update Profile Error:", err);
    return next(createHttpError(500, "Error updating user profile"));
  }
};

// Update logged-in user's settings
const updateSettings = async (req, res, next) => {
    try {
        const updateData = { ...req.body };

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const user = await userModel
            .findByIdAndUpdate(req.user.id, updateData, {
                new: true,
                runValidators: true,
            })
            .select("-password");

        if (!user) {
            return next(createHttpError(404, "User not found"));
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, "Error updating user settings"));
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await userModel
            .findById(req.params.id)
            .select("username bio avatar");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        next(err);
    }
};

export { getProfile, updateProfile, updateSettings, getUserById };
