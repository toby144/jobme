const USER = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//sign up
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, image } = req.body;

  try {
    const userExist = await USER.findOne({ email });
    if (userExist) {
      return res.status(400).json({ error: "The email is already in use" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await USER.create({
      firstName,
      lastName,
      email,
      image,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(error.status || 500).json({ error: error.message });
  }
};

//log in
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill all fields" });
    }
    const user = await USER.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Account not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Email or Password is Incorrect" });
    }

    //genrate token -
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(error.status || 500).json({ error: error.message });
  }
};
//get user details

const getUserDetails = async (req, res) => {
  const { userId } = req.user;
  try {
    const user = await USER.findById({ _id: userId }).select("-password -jobsApplied");
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.status(error.status || 500).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserDetails };
