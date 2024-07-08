const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isEmail } = require("validator");

const jobApplicationSchema = new Schema(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      // required: true,
    },
    dateApplied: {
      type: Date,
      // required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: [
        "applied",
        "interview",
        "offer",
        "hired",
        "not hired",
        "not interested",
      ],
      // required: [true, "Job status is required"],
      default: "applied",
    },
  },
  { _id: false } // Disable _id for subdocuments
);

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: [isEmail, "Please provide a valid email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [7, "Minimum password length is 7 characters"],
      validate: {
        validator: function (v) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{7,}$/.test(v);
        },
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      },
    },
    image: {
      type: String,
      default:
        "https://thumbs.dreamstime.com/b/user-profile-d-icon-avatar-person-button-picture-portrait-symbol-vector-neutral-gender-silhouette-circle-photo-blank-272643248.jpg?w=768",
    },
    jobsApplied: [jobApplicationSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
