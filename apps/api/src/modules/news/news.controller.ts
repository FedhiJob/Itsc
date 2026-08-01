import type { RequestHandler } from "express";
import { sendSuccess } from "../../utils/api-response.js";
import { AppError } from "../../utils/app-error.js";
import { newsService } from "./news.service.js";
import type { CreateNewsInput, NewsQueryInput, UpdateNewsInput } from "./news.schema.js";

function getParam(param: string | string[] | undefined, label: string): string {
  if (!param || Array.isArray(param)) {
    throw new AppError(400, `${label} parameter is required.`, "VALIDATION_001");
  }
  return param;
}

export const listArticles: RequestHandler = async (request, response, next) => {
  try {
    const query = request.query as unknown as NewsQueryInput;
    const result = await newsService.listArticles(query);
    return sendSuccess(response, 200, "Articles retrieved successfully.", result);
  } catch (error) {
    return next(error);
  }
};

export const getArticleBySlug: RequestHandler = async (request, response, next) => {
  try {
    const slug = getParam(request.params.slug, "slug");
    const article = await newsService.getArticleBySlug(slug);
    return sendSuccess(response, 200, "Article retrieved successfully.", article);
  } catch (error) {
    return next(error);
  }
};

export const getArticleById: RequestHandler = async (request, response, next) => {
  try {
    const id = getParam(request.params.id, "id");
    const article = await newsService.getArticleById(id);
    return sendSuccess(response, 200, "Article retrieved successfully.", article);
  } catch (error) {
    return next(error);
  }
};

export const createArticle: RequestHandler = async (request, response, next) => {
  try {
    const input = request.body as CreateNewsInput;
    const article = await newsService.createArticle(input, request.admin.id);
    return sendSuccess(response, 201, "Article created successfully.", article);
  } catch (error) {
    return next(error);
  }
};

export const updateArticle: RequestHandler = async (request, response, next) => {
  try {
    const id = getParam(request.params.id, "id");
    const input = request.body as UpdateNewsInput;
    const article = await newsService.updateArticle(id, input);
    return sendSuccess(response, 200, "Article updated successfully.", article);
  } catch (error) {
    return next(error);
  }
};

export const deleteArticle: RequestHandler = async (request, response, next) => {
  try {
    const id = getParam(request.params.id, "id");
    await newsService.softDeleteArticle(id);
    return sendSuccess(response, 200, "Article deleted successfully.");
  } catch (error) {
    return next(error);
  }
};
