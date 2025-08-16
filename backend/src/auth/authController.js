import createHttpError from "http-errors";
import Joi from "joi";
import userModel from "../user/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const register = async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return next(createHttpError(401, "All fields required"));
    }

    const userSchema = Joi.object({
        name: Joi.string().min(3).max(30).required().messages({
            "string.empty": "Name is required",
            "string.min": "Name must be at least 3 characters long",
            "string.max": "Name must not be more than 30 characters long",
        }),

        email: Joi.string()
            .email({ tlds: { allow: false } }) // disables TLD enforcement (so test@test.local works too)
            .required()
            .messages({
                "string.empty": "Email is required",
                "string.email": "Email must be a valid email address",
            }),

        password: Joi.string()
            .min(8)
            .pattern(
                new RegExp(
                    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
                )
            )
            .required()
            .messages({
                "string.empty": "Password is required",
                "string.min": "Password must be at least 8 characters long",
                "string.pattern.base":
                    "Password must contain at least one uppercase, one lowercase, one number, and one special character",
            }),
    });

    const { error } = userSchema.validate(req.body);

    if (error) {
        return next(createHttpError(400, error.message));
    }

    let existingUser;
    try {
        existingUser = await userModel.findOne({ email });
    } catch (err) {
        return next(createHttpError(500, "Database Error"));
    }

    if (existingUser) {
        return next(createHttpError(400, "User already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let user;
    try {
        user = await userModel.create({
            Username: name,
            email: email,
            password: hashedPassword,
        });
        console.log(name, email, password);
    } catch (err) {
        console.log("Database Error", err);
        return next(createHttpError(500, "User could not be created"));
    }

    res.status(201).json({ message: "User registered successfully" });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(createHttpError(400, "All fields required"));
    }

    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return next(createHttpError(401, error.message));
    }

  try {
    const user = await userModel.findOne({ email });
    if (!user) return next(createHttpError(401, "No user exists"));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(createHttpError(401, "Password not matched"));

    // ✅ sign token with id + email
    const token = jwt.sign(
      { id: user._id, email: user.email },
      config.secret,
      { expiresIn: "30d" }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, "Login failed"));
  }
};

const logout = async (req, res, next) => {
    try {
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        next(createHttpError(500, "Logout failed"));
    }
};

const me = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user.sub).select("-password");
        res.status(200).json({ user });
    } catch (err) {
        next(createHttpError(500, "Unable to fetch user"));
    }
};

export { register, login, logout, me };
