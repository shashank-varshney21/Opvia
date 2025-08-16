import express from "express";
import { getDashboard } from "./dashboardController.js";
import verifyJWT from "../middleware/userMiddleware.js";

const dashboardRoutes = express.Router();

dashboardRoutes.get("/", verifyJWT, getDashboard);

export default dashboardRoutes;
