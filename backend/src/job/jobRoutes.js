import express from "express";
import { getJobs, getJobById, createJob, applyJob } from "./jobsController.js";
import verifyJWT from "../middleware/userMiddleware.js";

const jobsRouter = express.Router();

jobsRouter.get("/", getJobs);
jobsRouter.get("/:id", getJobById);

jobsRouter.post("/", verifyJWT, createJob);
jobsRouter.post("/:id/apply", verifyJWT, applyJob);

export default jobsRouter;
