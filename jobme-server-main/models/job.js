const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema(
  {
    logo: {
      type: String,
      required: [true, "Company logo is required"],
      default: "https://example.com/default-logo.png",
    },
    jobTitle: {
      type: String,
      required: [true, "Job title is required"],
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
    },
    mode: {
      type: String,
      enum: ["remote", "on-site", "hybrid"],
      required: [true, "Mode of job is required"],
    },
    salaryRange: {
      type: String,
      required: [true, "Salary range is required"],
    },
    location: {
      type: String,
      required: [true, "Job location is required"],
    },
    jobDescription: {
      type: String,
      required: [true, "Job description is required"],
    },
    dutiesResponsibilities: {
      type: [String],
      required: [true, "Duties and responsibilities are required"],
    },
    skillsQualifications: {
      type: [String],
      required: [true, "Skills and qualifications are required"],
    },
    experience: {
      type: String,
      required: [true, "Experience is required"],
    },
    jobType: {
      type: String,
      enum: ["fulltime", "part time", "contract", "freelance"],
      required: [true, "Job type is required"],
    },
    industry: {
      type: String,
      required: [true, "Industry is required"],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Job", jobSchema);
