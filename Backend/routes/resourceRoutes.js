import express from "express";
import {
  createResource,
  getResources,
} from "../controllers/resourceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createResource).get(protect, getResources);

export default router;
