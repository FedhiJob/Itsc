import type { RequestHandler } from "express";
import { sendSuccess } from "../../utils/api-response.js";
import { authService } from "./auth.service.js";
import type { CreateAdminInput, LoginInput } from "./auth.schema.js";

export const login: RequestHandler = async (request, response, next) => {
  try {
    const input = request.body as LoginInput;
    const result = await authService.login(input);
    return sendSuccess(response, 200, "Login successful.", result);
  } catch (error) {
    return next(error);
  }
};

export const createAdmin: RequestHandler = async (request, response, next) => {
  try {
    const input = request.body as CreateAdminInput;
    const admin = await authService.createAdmin(input);
    return sendSuccess(response, 201, "Administrator created successfully.", admin);
  } catch (error) {
    return next(error);
  }
};

export const getMe: RequestHandler = async (request, response, next) => {
  try {
    const adminId = request.admin.id;
    const admin = await authService.getMe(adminId);
    return sendSuccess(response, 200, "Administrator profile retrieved.", admin);
  } catch (error) {
    return next(error);
  }
};
