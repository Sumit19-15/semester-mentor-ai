import express from "express";
import {
  createSubject,
  getSubjects,
} from "../controllers/subjectController.js";
import { protect } from "../middleware/authMiddleware.js";
import { parseSubjectsFromCurriculum } from "../controllers/curriculumController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createSubject).get(protect, getSubjects);

// POST /api/subjects/parse-index - Upload curriculum index and extract subjects
router.post(
  "/parse-index",
  protect,
  upload.single("file"),
  parseSubjectsFromCurriculum,
);

export default router;
