import type { RequestHandler } from "express";
import { sendSuccess } from "../../utils/api-response.js";
import { AppError } from "../../utils/app-error.js";
import { galleryService } from "./gallery.service.js";
import type { AddImageInput, CreateAlbumInput, UpdateAlbumInput, UpdateImageInput } from "./gallery.schema.js";

function getParam(param: string | string[] | undefined, label: string): string {
  if (!param || Array.isArray(param)) {
    throw new AppError(400, `${label} parameter is required.`, "VALIDATION_001");
  }
  return param;
}

export const listAlbums: RequestHandler = async (request, response, next) => {
  try {
    const page = request.query.page ? Number(request.query.page) : 1;
    const limit = request.query.limit ? Number(request.query.limit) : 10;
    const result = await galleryService.listAlbums(page, limit);
    return sendSuccess(response, 200, "Albums retrieved successfully.", result);
  } catch (error) {
    return next(error);
  }
};

export const getAlbumBySlug: RequestHandler = async (request, response, next) => {
  try {
    const slug = getParam(request.params.slug, "slug");
    const album = await galleryService.getAlbumBySlug(slug);
    return sendSuccess(response, 200, "Album retrieved successfully.", album);
  } catch (error) {
    return next(error);
  }
};

export const createAlbum: RequestHandler = async (request, response, next) => {
  try {
    const input = request.body as CreateAlbumInput;
    const album = await galleryService.createAlbum(input);
    return sendSuccess(response, 201, "Album created successfully.", album);
  } catch (error) {
    return next(error);
  }
};

export const updateAlbum: RequestHandler = async (request, response, next) => {
  try {
    const id = getParam(request.params.id, "id");
    const input = request.body as UpdateAlbumInput;
    const album = await galleryService.updateAlbum(id, input);
    return sendSuccess(response, 200, "Album updated successfully.", album);
  } catch (error) {
    return next(error);
  }
};

export const deleteAlbum: RequestHandler = async (request, response, next) => {
  try {
    const id = getParam(request.params.id, "id");
    await galleryService.deleteAlbum(id);
    return sendSuccess(response, 200, "Album deleted successfully.");
  } catch (error) {
    return next(error);
  }
};

export const addImage: RequestHandler = async (request, response, next) => {
  try {
    const albumId = getParam(request.params.albumId, "albumId");
    const input = request.body as AddImageInput;
    const image = await galleryService.addImage(albumId, input);
    return sendSuccess(response, 201, "Image added successfully.", image);
  } catch (error) {
    return next(error);
  }
};

export const updateImage: RequestHandler = async (request, response, next) => {
  try {
    const id = getParam(request.params.id, "id");
    const input = request.body as UpdateImageInput;
    const image = await galleryService.updateImage(id, input);
    return sendSuccess(response, 200, "Image updated successfully.", image);
  } catch (error) {
    return next(error);
  }
};

export const deleteImage: RequestHandler = async (request, response, next) => {
  try {
    const id = getParam(request.params.id, "id");
    await galleryService.deleteImage(id);
    return sendSuccess(response, 200, "Image deleted successfully.");
  } catch (error) {
    return next(error);
  }
};
