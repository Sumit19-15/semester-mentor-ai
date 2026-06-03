import express from "express";
import { createPyq, getPyqs } from "../controllers/pyqController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createPyq).get(protect, getPyqs);

export default router;
