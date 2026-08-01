import rateLimit from "express-rate-limit";
import type { Request, Response } from "express";
import { sendError } from "../utils/api-response.js";

const rateLimitHandler = (req: Request, res: Response) => {
  // express-rate-limit’s handler signature varies by version; keep typing pragmatic.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void req;

  return sendError(res, 429, "Too many requests. Please try again later.", [
    { code: "RATE_LIMIT_001" }
  ]);
};

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: rateLimitHandler
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: rateLimitHandler
});

export const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: rateLimitHandler
});

export const contactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: rateLimitHandler
});
