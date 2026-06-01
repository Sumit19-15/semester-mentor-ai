import express from "express";
import {
  createSubject,
  getSubjects,
} from "../controllers/subjectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createSubject).get(protect, getSubjects);

export default router;
