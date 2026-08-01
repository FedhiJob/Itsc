import { z } from "zod";

export const createAlbumSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters.").max(255),
  slug: z.string().min(2, "Slug must be at least 2 characters.").max(255),
  description: z.string().optional(),
  coverImage: z.string().url().optional()
});

export const updateAlbumSchema = createAlbumSchema.partial();

export const addImageSchema = z.object({
  imageUrl: z.string().url("A valid image URL is required."),
  caption: z.string().optional(),
  altText: z.string().min(1, "Alt text is required for accessibility.").max(255)
});

export const updateImageSchema = addImageSchema.partial();

export const albumQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10)
});

export type CreateAlbumInput = z.infer<typeof createAlbumSchema>;
export type UpdateAlbumInput = z.infer<typeof updateAlbumSchema>;
export type AddImageInput = z.infer<typeof addImageSchema>;
export type UpdateImageInput = z.infer<typeof updateImageSchema>;
