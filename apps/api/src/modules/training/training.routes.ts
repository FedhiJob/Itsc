import { Router } from "express";
import { validateRequest } from "../../middleware/validate-request.js";
import { authenticate, authorize } from "../auth/auth.middleware.js";
import {
  createCategory,
  createProgram,
  deleteCategory,
  deleteProgram,
  getCategoryBySlug,
  getProgramBySlug,
  listCategories,
  listPrograms,
  updateCategory,
  updateProgram
} from "./training.controller.js";
import {
  createCategorySchema,
  createProgramSchema,
  programQuerySchema,
  updateCategorySchema,
  updateProgramSchema
} from "./training.schema.js";

export const trainingRoutes = Router();

// Public routes
trainingRoutes.get("/categories", listCategories);
trainingRoutes.get("/categories/:slug", getCategoryBySlug);
trainingRoutes.get("/programs", validateRequest({ query: programQuerySchema }), listPrograms);
trainingRoutes.get("/programs/:slug", getProgramBySlug);

// Protected admin routes
trainingRoutes.post("/categories", authenticate, authorize("ADMIN", "SUPER_ADMIN", "TRAINING_MANAGER"), validateRequest({ body: createCategorySchema }), createCategory);
trainingRoutes.patch("/categories/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN", "TRAINING_MANAGER"), validateRequest({ body: updateCategorySchema }), updateCategory);
trainingRoutes.delete("/categories/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), deleteCategory);

trainingRoutes.post("/programs", authenticate, authorize("ADMIN", "SUPER_ADMIN", "TRAINING_MANAGER"), validateRequest({ body: createProgramSchema }), createProgram);
trainingRoutes.patch("/programs/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN", "TRAINING_MANAGER"), validateRequest({ body: updateProgramSchema }), updateProgram);
trainingRoutes.delete("/programs/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), deleteProgram);
