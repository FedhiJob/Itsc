import { z } from "zod";

export const createNewsSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters.").max(255),
  slug: z.string().min(2, "Slug must be at least 2 characters.").max(255),
  summary: z.string().min(10, "Summary must be at least 10 characters."),
  content: z.string().min(10, "Content must be at least 10 characters."),
  featuredImage: z.string().url().optional(),
  publishedAt: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT")
});

export const updateNewsSchema = createNewsSchema.partial();

export const newsQuerySchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10)
});

export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
export type NewsQueryInput = z.infer<typeof newsQuerySchema>;
