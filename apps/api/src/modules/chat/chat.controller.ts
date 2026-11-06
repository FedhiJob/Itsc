import type { Request, Response } from 'express';
import { ChatService } from './chat.service.js';
import { chatRequestSchema } from './chat.schema.js';
import type { ChatRequestInput } from './chat.schema.js';

const chatService = new ChatService();

export async function chatHandler(req: Request, res: Response): Promise<void> {
  try {
    // Validate request
    const validatedData: ChatRequestInput = chatRequestSchema.parse(req.body);

    // Process the message
    const response = await chatService.processMessage(
      validatedData.message,
      validatedData.conversationId,
      validatedData.conversationHistory
    );

    res.status(200).json({
      success: true,
      message: 'Response generated successfully',
      data: response
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: error.errors
      });
      return;
    }

    console.error('Chat processing error:', error instanceof Error ? error.message : 'Unknown error');
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(500).json({
      success: false,
      message: 'Failed to process chat request. Please try again shortly.',
      error: isProduction
        ? 'An unexpected error occurred.'
        : (error instanceof Error ? error.message : 'Unknown error')
    });
  }
}