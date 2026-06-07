import express from "express";
import { createPyq, getPyqs } from "../controllers/pyqController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, upload.single("file"), createPyq)
  .get(protect, getPyqs);

export default router;
