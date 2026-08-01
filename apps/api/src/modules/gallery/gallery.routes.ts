import { Router } from "express";
import { validateRequest } from "../../middleware/validate-request.js";
import { authenticate, authorize } from "../auth/auth.middleware.js";
import {
  addImage,
  createAlbum,
  deleteAlbum,
  deleteImage,
  getAlbumBySlug,
  listAlbums,
  updateAlbum,
  updateImage
} from "./gallery.controller.js";
import {
  addImageSchema,
  createAlbumSchema,
  updateAlbumSchema,
  updateImageSchema
} from "./gallery.schema.js";

export const galleryRoutes = Router();

// Public routes
galleryRoutes.get("/albums", listAlbums);
galleryRoutes.get("/albums/:slug", getAlbumBySlug);

// Protected admin routes
galleryRoutes.post("/albums", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validateRequest({ body: createAlbumSchema }), createAlbum);
galleryRoutes.patch("/albums/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validateRequest({ body: updateAlbumSchema }), updateAlbum);
galleryRoutes.delete("/albums/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), deleteAlbum);

galleryRoutes.post("/albums/:albumId/images", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validateRequest({ body: addImageSchema }), addImage);
galleryRoutes.patch("/images/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validateRequest({ body: updateImageSchema }), updateImage);
galleryRoutes.delete("/images/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), deleteImage);
