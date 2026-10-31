import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100),
  slug: z.string().min(2, "Slug must be at least 2 characters.").max(120),
  description: z.string().optional(),
  parentId: z.string().uuid("Invalid parent category ID.").nullable().optional(),
  sortOrder: z.coerce.number().int().default(0)
});

export const updateCategorySchema = createCategorySchema.partial();

export const createProgramSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID."),
  title: z.string().min(2, "Title must be at least 2 characters.").max(255),
  slug: z.string().min(2, "Slug must be at least 2 characters.").max(255),
  code: z.string().max(50).nullable().optional(),
  shortDescription: z.string().min(5, "Short description must be at least 5 characters."),
  fullDescription: z.string().min(5, "Full description must be at least 5 characters."),
  duration: z.string().max(50).optional(),
  deliveryMode: z.string().max(50).optional(),
  level: z.string().max(50).optional(),
  featuredImage: z.string().url().nullable().optional(),
  outlineText: z.string().max(20000).nullable().optional(),
  outlineFileUrl: z.string().url().nullable().optional(),
  isFeatured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
  objectives: z.array(z.string()).default([]),
  prerequisites: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT")
});

export const updateProgramSchema = createProgramSchema.partial();

export const programQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  isFeatured: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(500).default(50)
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;
export type ProgramQueryInput = z.infer<typeof programQuerySchema>;
