import type { RequestHandler } from "express";
import { sendSuccess } from "../../utils/api-response.js";
import { AppError } from "../../utils/app-error.js";
import { trainingService } from "./training.service.js";
import type { CreateCategoryInput, CreateProgramInput, ProgramQueryInput, UpdateCategoryInput, UpdateProgramInput } from "./training.schema.js";

function getParam(param: string | string[] | undefined, label: string): string {
  if (!param || Array.isArray(param)) {
    throw new AppError(400, `${label} parameter is required.`, "VALIDATION_001");
  }
  return param;
}

export const listCategories: RequestHandler = async (_request, response, next) => {
  try {
    const categories = await trainingService.listCategories();
    return sendSuccess(response, 200, "Categories retrieved successfully.", categories);
  } catch (error) {
    return next(error);
  }
};

export const getCategoryBySlug: RequestHandler = async (request, response, next) => {
  try {
    const slug = getParam(request.params.slug, "slug");
    const category = await trainingService.getCategoryBySlug(slug);
    return sendSuccess(response, 200, "Category retrieved successfully.", category);
  } catch (error) {
    return next(error);
  }
};

export const createCategory: RequestHandler = async (request, response, next) => {
  try {
    const input = request.body as CreateCategoryInput;
    const category = await trainingService.createCategory(input);
    return sendSuccess(response, 201, "Category created successfully.", category);
  } catch (error) {
    return next(error);
  }
};

export const updateCategory: RequestHandler = async (request, response, next) => {
  try {
    const id = getParam(request.params.id, "id");
    const input = request.body as UpdateCategoryInput;
    const category = await trainingService.updateCategory(id, input);
    return sendSuccess(response, 200, "Category updated successfully.", category);
  } catch (error) {
    return next(error);
  }
};

export const deleteCategory: RequestHandler = async (request, response, next) => {
  try {
    const id = getParam(request.params.id, "id");
    await trainingService.deleteCategory(id);
    return sendSuccess(response, 200, "Category deleted successfully.");
  } catch (error) {
    return next(error);
  }
};

export const listPrograms: RequestHandler = async (request, response, next) => {
  try {
    const query = request.query as unknown as ProgramQueryInput;
    const result = await trainingService.listPrograms(query);
    return sendSuccess(response, 200, "Programs retrieved successfully.", result);
  } catch (error) {
    return next(error);
  }
};

export const getProgramBySlug: RequestHandler = async (request, response, next) => {
  try {
    const slug = getParam(request.params.slug, "slug");
    const program = await trainingService.getProgramBySlug(slug);
    return sendSuccess(response, 200, "Program retrieved successfully.", program);
  } catch (error) {
    return next(error);
  }
};

export const createProgram: RequestHandler = async (request, response, next) => {
  try {
    const input = request.body as CreateProgramInput;
    const program = await trainingService.createProgram(input, request.admin.id);
    return sendSuccess(response, 201, "Program created successfully.", program);
  } catch (error) {
    return next(error);
  }
};

export const updateProgram: RequestHandler = async (request, response, next) => {
  try {
    const id = getParam(request.params.id, "id");
    const input = request.body as UpdateProgramInput;
    const program = await trainingService.updateProgram(id, input);
    return sendSuccess(response, 200, "Program updated successfully.", program);
  } catch (error) {
    return next(error);
  }
};

export const deleteProgram: RequestHandler = async (request, response, next) => {
  try {
    const id = getParam(request.params.id, "id");
    await trainingService.softDeleteProgram(id);
    return sendSuccess(response, 200, "Program deleted successfully.");
  } catch (error) {
    return next(error);
  }
};
