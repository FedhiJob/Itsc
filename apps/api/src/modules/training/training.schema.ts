import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100),
  slug: z.string().min(2, "Slug must be at least 2 characters.").max(120),
  description: z.string().optional()
});

export const updateCategorySchema = createCategorySchema.partial();

export const createProgramSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID."),
  title: z.string().min(2, "Title must be at least 2 characters.").max(255),
  slug: z.string().min(2, "Slug must be at least 2 characters.").max(255),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters."),
  fullDescription: z.string().min(10, "Full description must be at least 10 characters."),
  duration: z.string().max(50).optional(),
  deliveryMode: z.string().max(50).optional(),
  level: z.string().max(50).optional(),
  featuredImage: z.string().url().optional(),
  isFeatured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT")
});

export const updateProgramSchema = createProgramSchema.partial();

export const programQuerySchema = z.object({
  category: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  isFeatured: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10)
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;
export type ProgramQueryInput = z.infer<typeof programQuerySchema>;
