const JOB = require("../models/job");

async function getUniqueCountries() {
  try {
    const jobs = await JOB.find().select("location");
    const uniqueCountries = new Set();
    jobs.forEach((job) => uniqueCountries.add(job.location));
    return Array.from(uniqueCountries);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
}
