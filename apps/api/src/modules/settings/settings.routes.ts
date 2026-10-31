import { Router } from "express";
import { validateRequest } from "../../middleware/validate-request.js";
import { authenticate, authorize } from "../auth/auth.middleware.js";
import {
  getAllSettings,
  getPublicSettings,
  getSettingByKey,
  upsertSetting,
} from "./settings.controller.js";
import { updateSettingSchema } from "./settings.schema.js";

export const settingsRoutes = Router();

// Public — only returns safe, allow-listed keys
settingsRoutes.get("/public", getPublicSettings);

// Admin-protected
settingsRoutes.get(
  "/",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN", "CONTENT_EDITOR"),
  getAllSettings
);

settingsRoutes.get(
  "/:key",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN", "CONTENT_EDITOR"),
  getSettingByKey
);

settingsRoutes.put(
  "/:key",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN", "CONTENT_EDITOR"),
  validateRequest({ body: updateSettingSchema }),
  upsertSetting
);

