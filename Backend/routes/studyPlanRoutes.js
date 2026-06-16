import express from "express";
import {
  generateStudyPlan,
  generateStudyPlanFromSyllabus,
  getStudyPlans,
} from "../controllers/studyPlanController.js";
import { protect } from "../middleware/authmiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/generate", protect, generateStudyPlan);
router.get("/:subjectId", protect, getStudyPlans);
router.post(
  "/generate-from-syllabus",
  protect,
  upload.single("file"),
  generateStudyPlanFromSyllabus,
);

export default router;
