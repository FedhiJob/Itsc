import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { corsOptions } from "./config/cors.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { globalRateLimiter } from "./middleware/rate-limiters.js";
import { apiRoutes } from "./modules/index.js";
import { UPLOADS_DIR } from "./modules/upload/upload.service.js";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(globalRateLimiter);

// Serve locally-uploaded files (used when Cloudinary is not configured or fails).
app.use("/uploads", express.static(UPLOADS_DIR));

app.use("/api/v1", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
