import createHttpError from "http-errors";
import Job from "./jobsModel.js";

// Get all jobs
export const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    console.error(err);
    next(createHttpError(500, "Error fetching jobs"));
  }
};

// Get job by ID
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return next(createHttpError(404, "Job not found"));
    res.status(200).json(job);
  } catch (err) {
    console.error(err);
    next(createHttpError(500, "Error fetching job"));
  }
};

// Create a new job
export const createJob = async (req, res, next) => {
  try {
    const { title, company, location, description, requirements } = req.body;

    if (!title || !company || !description) {
      return next(createHttpError(400, "Title, company, and description are required"));
    }

    const job = await Job.create({ title, company, location, description, requirements });
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    next(createHttpError(500, "Error creating job"));
  }
};

// Apply to a job
export const applyJob = async (req, res, next) => {
  try {
    const userId = req.user?.sub;
    const job = await Job.findById(req.params.id);
    if (!job) return next(createHttpError(404, "Job not found"));

    if (job.applicants.includes(userId)) {
      return next(createHttpError(400, "You have already applied to this job"));
    }

    job.applicants.push(userId);
    await job.save();

    res.status(200).json({ message: "Applied successfully", job });
  } catch (err) {
    console.error(err);
    next(createHttpError(500, "Error applying to job"));
  }
};
