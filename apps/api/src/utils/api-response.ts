import type { Response } from "express";
import type { ApiErrorResponse, ApiSuccessResponse } from "@itsc/shared";







export function sendSuccess<TData>(
  response: Response,
  statusCode: number,
  message: string,
  data?: TData
) {
  const payload: ApiSuccessResponse<TData> = {
    success: true,
    message,
    ...(data === undefined ? {} : { data })
  };

  return response.status(statusCode).json(payload);
}

export function sendError(
  response: Response,
  statusCode: number,
  message: string,
  errors: ApiErrorResponse["errors"] = []
) {
  const payload: ApiErrorResponse = {
    success: false,
    message,
    errors
  };

  return response.status(statusCode).json(payload);
}
