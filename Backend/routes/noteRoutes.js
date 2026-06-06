import express from "express";
import { createNote } from "../controllers/noteController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.route("/").post(protect, upload.single("file"), createNote);

export default router;
