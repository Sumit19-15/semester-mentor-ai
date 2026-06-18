import express from "express";
import {
  generateStudyPlan,
  getStudyPlans,
  toggleDayCompletion,
} from "../controllers/studyPlanController.js";
import { protect } from "../middleware/authmiddleware.js";
const router = express.Router();

router.post("/generate", protect, generateStudyPlan);
router.get("/:subjectId", protect, getStudyPlans);
router.put("/:planId/day/:dayIndex/toggle", protect, toggleDayCompletion);

export default router;
