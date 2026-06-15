import mongoose from "mongoose";

const chatMessageSchema = mongoose.Schema(
  {
    chatSession: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "ChatSession",
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "ai"],
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
export default ChatMessage;
