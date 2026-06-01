import mongoose from "mongoose";

const pyqSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Subject",
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
    },
    title: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Pyq = mongoose.model("Pyq", pyqSchema);
export default Pyq;
