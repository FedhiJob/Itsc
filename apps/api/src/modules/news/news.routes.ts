import { Router } from "express";
import { validateRequest } from "../../middleware/validate-request.js";
import { authenticate, authorize } from "../auth/auth.middleware.js";
import {
  createArticle,
  deleteArticle,
  getArticleBySlug,
  getArticleById,
  listArticles,
  updateArticle
} from "./news.controller.js";
import {
  createNewsSchema,
  newsQuerySchema,
  updateNewsSchema
} from "./news.schema.js";

export const newsRoutes = Router();

// Public routes
newsRoutes.get("/", validateRequest({ query: newsQuerySchema }), listArticles);
newsRoutes.get("/:slug", getArticleBySlug);

// Protected admin routes
newsRoutes.post("/", authenticate, authorize("ADMIN", "SUPER_ADMIN", "NEWS_EDITOR"), validateRequest({ body: createNewsSchema }), createArticle);
newsRoutes.get("/admin/:id", authenticate, getArticleById);
newsRoutes.patch("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN", "NEWS_EDITOR"), validateRequest({ body: updateNewsSchema }), updateArticle);
newsRoutes.delete("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), deleteArticle);
