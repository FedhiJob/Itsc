import { z } from 'zod';

export const chatRequestSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message too long (max 2000 characters)'),
  conversationId: z.string().uuid().optional()
});

export type ChatRequestInput = z.infer<typeof chatRequestSchema>;