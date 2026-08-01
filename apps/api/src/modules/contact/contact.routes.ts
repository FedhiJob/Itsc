import { Router } from "express";
import { contactRateLimiter } from "../../middleware/rate-limiters.js";
import { validateRequest } from "../../middleware/validate-request.js";
import { authenticate, authorize } from "../auth/auth.middleware.js";
import { getInquiry, listInquiries, submitInquiry, updateInquiry } from "./contact.controller.js";
import { inquiryQuerySchema, submitContactSchema, updateInquirySchema } from "./contact.schema.js";

export const contactRoutes = Router();

// Public route
contactRoutes.post("/inquiries", contactRateLimiter, validateRequest({ body: submitContactSchema }), submitInquiry);

// Protected admin routes
contactRoutes.get("/inquiries", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validateRequest({ query: inquiryQuerySchema }), listInquiries);
contactRoutes.get("/inquiries/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), getInquiry);
contactRoutes.patch("/inquiries/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validateRequest({ body: updateInquirySchema }), updateInquiry);
