require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const userRoutes = require("./routes/userRouter");
const jobRoutes = require("./routes/jobRouter");

//cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use(fileUpload({ useTempFiles: true }));
app.use(express.json());
app.use(cors());

//route
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Job Me Server" });
});
app.use("/api/v1", userRoutes);
app.use("/api/v1/jobs", jobRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "ROUTE NOT FOUND" });
});

//db connection
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, { dbName: "jobme" });
    app.listen(PORT, () => {
      console.log(`server running on port : ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
