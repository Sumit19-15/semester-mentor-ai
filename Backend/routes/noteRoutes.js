import express from "express";
import { createNote, getNotes, deleteNote } from "../controllers/noteController.js";
import { protect } from "../middleware/authmiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, upload.single("file"), createNote)
  .get(protect, getNotes);

router.route("/:id").delete(protect, deleteNote);

export default router;
