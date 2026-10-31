import type { RequestHandler } from "express";
import { sendSuccess } from "../../utils/api-response.js";
import { AppError } from "../../utils/app-error.js";
import { settingsService } from "./settings.service.js";
import type { UpdateSettingInput } from "./settings.schema.js";

function getParam(param: string | string[] | undefined, label: string): string {
  if (!param || Array.isArray(param)) {
    throw new AppError(400, `${label} parameter is required.`, "VALIDATION_001");
  }
  return param;
}

export const getAllSettings: RequestHandler = async (_request, response, next) => {
  try {
    const settings = await settingsService.getAllSettings();
    return sendSuccess(response, 200, "Settings retrieved successfully.", settings);
  } catch (error) {
    return next(error);
  }
};

export const getPublicSettings: RequestHandler = async (_request, response, next) => {
  try {
    const settings = await settingsService.getPublicSettings();
    return sendSuccess(response, 200, "Public settings retrieved successfully.", settings);
  } catch (error) {
    return next(error);
  }
};

export const getSettingByKey: RequestHandler = async (request, response, next) => {
  try {
    const key = getParam(request.params.key, "key");
    const setting = await settingsService.getSettingByKey(key);
    return sendSuccess(response, 200, "Setting retrieved successfully.", setting);
  } catch (error) {
    return next(error);
  }
};

export const upsertSetting: RequestHandler = async (request, response, next) => {
  try {
    const key = getParam(request.params.key, "key");
    const input = request.body as UpdateSettingInput;
    const setting = await settingsService.upsertSetting(key, input);
    return sendSuccess(response, 200, "Setting updated successfully.", setting);
  } catch (error) {
    return next(error);
  }
};

