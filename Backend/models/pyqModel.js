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
    title: {
      type: String,
      default: "PYQ",
    },
    fileUrl: {
      type: String,
      required: true,
    },
    uploadType: {
      type: String,
      enum: ['upload', 'link'],
      default: 'upload',
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
