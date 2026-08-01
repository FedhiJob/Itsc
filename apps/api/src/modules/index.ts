import { Router } from "express";
import { healthRoutes } from "./health/health.routes.js";
import { authRoutes } from "./auth/auth.routes.js";
import { trainingRoutes } from "./training/training.routes.js";
import { newsRoutes } from "./news/news.routes.js";
import { galleryRoutes } from "./gallery/gallery.routes.js";
import { contactRoutes } from "./contact/contact.routes.js";

export const apiRoutes = Router();

apiRoutes.use("/health", healthRoutes);
apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/training", trainingRoutes);
apiRoutes.use("/news", newsRoutes);
apiRoutes.use("/gallery", galleryRoutes);
apiRoutes.use("/contact", contactRoutes);
