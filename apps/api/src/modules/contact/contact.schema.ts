import { z } from "zod";

export const submitContactSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters.").max(150),
  email: z.string().email("A valid email address is required."),
  phone: z.string().max(50).optional(),
  organization: z.string().max(255).optional(),
  subject: z.string().min(2, "Subject must be at least 2 characters.").max(255),
  message: z.string().min(10, "Message must be at least 10 characters.")
});

export const updateInquirySchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"])
});

export const inquiryQuerySchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10)
});

export type SubmitContactInput = z.infer<typeof submitContactSchema>;
export type UpdateInquiryInput = z.infer<typeof updateInquirySchema>;
export type InquiryQueryInput = z.infer<typeof inquiryQuerySchema>;
