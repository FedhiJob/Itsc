import { z } from 'zod';

export const chatRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message too long (max 2000 characters)'),
  conversationId: z.string().uuid().optional(),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(4000)
      })
    )
    .max(10)
    .optional()
});

export type ChatRequestInput = z.infer<typeof chatRequestSchema>;