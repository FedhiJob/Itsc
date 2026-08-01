import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("A valid email address is required."),
  password: z.string().min(1, "Password is required.")
});

export type LoginInput = z.infer<typeof loginSchema>;

export const createAdminSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters.").max(150),
  email: z.string().email("A valid email address is required."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["ADMIN", "SUPER_ADMIN", "CONTENT_EDITOR", "TRAINING_MANAGER", "NEWS_EDITOR", "VIEWER"]).default("ADMIN")
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;

