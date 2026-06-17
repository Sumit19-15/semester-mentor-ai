import express from "express";
import {
  createResource,
  getResources,
  deleteResource,
} from "../controllers/resourceController.js";
import { protect } from "../middleware/authmiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.route("/").post(protect, upload.single("file"), createResource).get(protect, getResources);
router.route("/:id").delete(protect, deleteResource);

export default router;
