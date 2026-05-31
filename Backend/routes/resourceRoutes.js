import express from "express";
import { createResource } from "../controllers/resourceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createResource);

export default router;
