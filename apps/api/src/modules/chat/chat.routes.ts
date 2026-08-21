import { Router } from 'express';
import { chatHandler } from './chat.controller.js';
import { rateLimit } from 'express-rate-limit';

const router = Router();

// Rate limiting for chat endpoint (30 requests per minute per IP)
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', chatLimiter, chatHandler);

export default router;