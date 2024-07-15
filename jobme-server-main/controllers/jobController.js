const JOB = require("../models/job");
const USER = require("../models/user");
//get all job

const getAllJobs = async (req, res) => {
  const { location, jobType, mode, industry } = req.query;
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = 10;
  const queryObject = {};
  let result = JOB.find(queryObject);
  if (location) {
    queryObject.location = { $regex: location, $options: "i" };
  }
  if (jobType) {
    queryObject.jobType = { $regex: jobType, $options: "i" };
  }
  if (mode) {
    queryObject.mode = { $regex: mode, $options: "i" };
  }
  if (industry) {
    queryObject.industry = { $regex: industry, $options: "i" };
  }
  const skip = (page - 1) * limit;

  result = result.find(queryObject).sort("-createdAt").skip(skip).limit(limit);
  try {
    const totalJobs = await JOB.countDocuments(queryObject);
    const totalPages = Math.ceil(totalJobs / limit);

    const jobs = await result;
    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      totalJobs,
      numOfJobs: jobs.length,
      jobs,
    });
  } catch (error) {
    console.log(error);
  }
};
//create a job

const createJob = async (req, res) => {
  res.send("create jobs");
};
// get latest job (6)
const getLatestJobs = async (req, res) => {
  try {
    const recentJobs = await JOB.find().sort("-createdAt").limit(6);
    res.status(200).json({ success: true, jobs: recentJobs });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
// get a single job - related job
const getSingleJob = async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await JOB.findById({ _id: jobId });
    // Find similar jobs based on jobTitle or mode, excluding the current job
    const similarJobs = await JOB.find({
      _id: { $ne: jobId }, // Exclude the current job
      industry: job.industry,
    })
    .sort("-createdAt")
    .limit(3);

    res.status(200).json({ success: true, job, similarJobs });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

//User ---> Jobs
//apply for jobs

const applyForJob = async (req, res) => {
  const { userId } = req.user;
  const { jobId } = req.params;
  try {
    const user = await USER.findById({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    const job = await JOB.findById({ _id: jobId });
    if (!job) {
      throw new Error("Job not found");
    }
    const alreadyApplied = user.jobsApplied.find(
      (application) => application.job.toString() === jobId
    );

    if (alreadyApplied) {
      throw new Error("You have already applied for this job");
    }
    user.jobsApplied.push({ job: job._id });
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Application successful", user });
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error?.message);
  }
};
// get all users applied jobs
const getUsersAppliedJobs = async (req, res) => {
  const { userId } = req.user;
  try {
    const user = await USER.findById({ _id: userId }).populate(
      "jobsApplied.job"
    );
    const appliedJobs = user.jobsApplied;
    res.status(200).json({ success: true, jobs: appliedJobs });
  } catch (error) {
    console.log(error);
    res.json(error.message);
  }
};
// update the status of jobs
const updateJobStatus = async (req, res) => {
  const { userId } = req.user;
  const { jobId } = req.params;
  const { status } = req.body;
  try {
    const user = await USER.findById({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    const job = await JOB.findById({ _id: jobId });
    if (!job) {
      throw new Error("Job not found");
    }
    const jobApplication = user.jobsApplied.find(
      (application) => application.job.toString() === jobId
    );

    if (!jobApplication) {
      throw new Error("Job application not found");
    }
    jobApplication.status = status;
    await user.save();
    res.status(200).json({ success: true, jobs: user.jobsApplied });
  } catch (error) {
    console.log(error);
    res.status(error?.code || 500).json(error.message);
  }
};

module.exports = {
  getUniqueLocations,
  getAllJobs,
  getLatestJobs,
  getSingleJob,
  createJob,
  applyForJob,
  getUsersAppliedJobs,
  updateJobStatus,
};


