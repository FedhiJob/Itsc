import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/app-error.js";
import { sendError } from "../utils/api-response.js";

export const errorHandler: ErrorRequestHandler = (error, request, response, _next) => {
  if (error instanceof ZodError) {
    return sendError(
      response,
      422,
      "Validation failed.",
      error.issues.map((issue) => ({
        code: issue.code,
        path: issue.path.join("."),
        message: issue.message,
        details: issue
      }))
    );
  }


  if (error instanceof AppError) {
    return sendError(response, error.statusCode, error.message, [
      { code: error.code, path: request.path, details: error.details }
    ]);
  }

  console.error(error);

  return sendError(response, 500, "Something went wrong. Please try again later.", [
    { code: "SYSTEM_001", path: request.path }
  ]);
};
