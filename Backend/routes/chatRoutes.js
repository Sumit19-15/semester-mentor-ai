import express from "express";
import {
  getChats,
  createChatSession,
  getChatMessages,
  sendMessage,
  deleteChatSession,
  updateChatSession,
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getChats).post(protect, createChatSession);
router.route("/:id").delete(protect, deleteChatSession).put(protect, updateChatSession);
router.route("/:id/messages").get(protect, getChatMessages);
router.route("/:id/message").post(protect, sendMessage);

export default router;
