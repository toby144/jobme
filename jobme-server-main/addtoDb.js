require("dotenv").config();
const JOBS = require("./models/job");
const jsonJobs = require("./data.json");
const mongoose = require("mongoose");

const addJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, { dbName: "jobme" });
    await JOBS.deleteMany();
    await JOBS.create(jsonJobs);
    console.log("Jobs added");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

addJobs();
