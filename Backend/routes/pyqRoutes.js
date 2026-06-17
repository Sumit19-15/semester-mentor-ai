import express from "express";
import { createPyq, getPyqs, deletePyq } from "../controllers/pyqController.js";
import { protect } from "../middleware/authmiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, upload.single("file"), createPyq)
  .get(protect, getPyqs);

router.route("/:id").delete(protect, deletePyq);

export default router;
