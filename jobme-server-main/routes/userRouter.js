const router = require("express").Router();
const {
  registerUser,
  loginUser,
  getUserDetails,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", auth, getUserDetails);

module.exports = router;
