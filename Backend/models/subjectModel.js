import mongoose from "mongoose";

const subjectSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    courseCode: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
