import type { RequestHandler } from "express";
import { sendError } from "../../utils/api-response.js";
import { authService } from "./auth.service.js";

declare global {
  namespace Express {
    interface Request {
      admin: {
        id: string;
        role: string;
      };
    }
  }
}

export const authenticate: RequestHandler = (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(response, 401, "Authentication required.", [
      { code: "AUTH_005", message: "Missing or malformed authorization header." }
    ]);
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return sendError(response, 401, "Authentication required.", [
      { code: "AUTH_005", message: "Malformed authorization header." }
    ]);
  }

  const token = parts[1];

  if (!token) {
    return sendError(response, 401, "Authentication required.", [
      { code: "AUTH_005", message: "Malformed authorization header." }
    ]);
  }

  try {
    const payload = authService.verifyToken(token);
    request.admin = { id: payload.sub, role: payload.role };
    next();
  } catch {
    return sendError(response, 401, "Invalid or expired token.", [
      { code: "AUTH_004" }
    ]);
  }
};

export function authorize(...allowedRoles: string[]): RequestHandler {
  return (request, response, next) => {
    if (!request.admin) {
      return sendError(response, 401, "Authentication required.", [
        { code: "AUTH_005" }
      ]);
    }

    if (!allowedRoles.includes(request.admin.role) && request.admin.role !== "SUPER_ADMIN") {
      return sendError(response, 403, "You do not have permission to perform this action.", [
        { code: "AUTH_006" }
      ]);
    }

    next();
  };
}

