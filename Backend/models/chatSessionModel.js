import mongoose from "mongoose";

const chatSessionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
    },
    type: {
      type: String,
      required: true,
      enum: ["GLOBAL", "MODULE", "SUBJECT"],
      default: "MODULE",
    },
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ChatSession = mongoose.model("ChatSession", chatSessionSchema);
export default ChatSession;
