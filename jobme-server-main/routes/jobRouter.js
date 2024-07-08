const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  getAllJobs,
  getLatestJobs,
  getSingleJob,
  createJob,
  applyForJob,
  getUsersAppliedJobs,
  updateJobStatus,
} = require("../controllers/jobController");

router.route("/").get(getAllJobs).post(createJob);
router.get("/latest", getLatestJobs);
router.post("/apply/:jobId", auth, applyForJob);
router.get("/user", auth, getUsersAppliedJobs);
router.route("/:jobId").get(getSingleJob).patch(auth, updateJobStatus);

module.exports = router;
