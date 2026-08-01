import { Router } from "express";
import { authRateLimiter } from "../../middleware/rate-limiters.js";
import { validateRequest } from "../../middleware/validate-request.js";
import { authenticate } from "./auth.middleware.js";
import { createAdmin, getMe, login } from "./auth.controller.js";
import { createAdminSchema, loginSchema } from "./auth.schema.js";

export const authRoutes = Router();

authRoutes.post(
  "/login",
  authRateLimiter,
  validateRequest({ body: loginSchema }),
  login
);

authRoutes.post(
  "/register",
  authRateLimiter,
  validateRequest({ body: createAdminSchema }),
  createAdmin
);

authRoutes.get(
  "/me",
  authenticate,
  getMe
);

