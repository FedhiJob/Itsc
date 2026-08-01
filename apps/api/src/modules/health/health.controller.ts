import type { RequestHandler } from "express";
import { sendSuccess } from "../../utils/api-response.js";
import { healthService } from "./health.service.js";

export const getHealth: RequestHandler = async (_request, response, next) => {
  try {
    const status = await healthService.getStatus();
    return sendSuccess(response, 200, "API is healthy.", status);
  } catch (error) {
    return next(error);
  }
};
