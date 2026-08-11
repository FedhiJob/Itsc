import { Router } from "express";
import multer from "multer";
import { authenticate, authorize } from "../auth/auth.middleware.js";
import { uploadImageHandler } from "./upload.controller.js";

export const uploadRoutes = Router();

// Keep files in memory (they're forwarded to Cloudinary or written to disk
// by the service). Limit uploads to 10 MB, single file field named "file".
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

uploadRoutes.post(
  "/image",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN", "CONTENT_EDITOR", "NEWS_EDITOR", "TRAINING_MANAGER"),
  upload.single("file"),
  uploadImageHandler
);