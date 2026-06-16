import express from "express";
import { createTopic, completeTopic, getTopics, deleteTopic, deleteAllTopicsForSubject } from "../controllers/topicController.js";
import { protect } from "../middleware/authmiddleware.js";
import { parseTopicsForSubject } from "../controllers/curriculumController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createTopic).get(protect, getTopics);

router.route("/subject/:subjectId").delete(protect, deleteAllTopicsForSubject);

router.route("/:id").delete(protect, deleteTopic);
router.route("/:id/complete").put(protect, completeTopic);

// POST /api/topics/:subjectId/parse-topics - Upload syllabus page and extract topics for a specific subject
router.post(
  "/:subjectId/parse-topics",
  protect,
  upload.single("file"),
  parseTopicsForSubject,
);

export default router;
