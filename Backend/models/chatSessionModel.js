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
      // Optional, allowing null for Global Mentoring sessions
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      // Optional, allowing null for Global Mentoring sessions
    },
    type: {
      type: String,
      required: true,
      enum: ["GLOBAL", "MODULE"],
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
