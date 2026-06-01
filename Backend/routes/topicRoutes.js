import express from "express";
import { createTopic, completeTopic } from "../controllers/topicController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createTopic);
router.route("/:id/complete").put(protect, completeTopic);

export default router;
