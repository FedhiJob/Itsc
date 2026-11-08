import type { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../utils/api-response.js";
import { AppError } from "../../utils/app-error.js";
import { getDocument, uploadDocument, uploadImage } from "./upload.service.js";

/** Shape of the file attached by `multer`'s `.single("file")` middleware. */
interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

type UploadRequest = Request & { file?: UploadedFile | undefined };

export const uploadImageHandler = async (
  request: UploadRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const file = request.file;

    if (!file) {
      throw new AppError(400, "No file was uploaded.", "UPLOAD_001");
    }

    // Derive the public base URL from the incoming request so locally stored
    // uploads always return an absolute, valid URL regardless of host.
    const proto = request.get("x-forwarded-proto") ?? request.protocol;
    const host = request.get("host");
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const result = await uploadImage(file.buffer, file.originalname, file.mimetype, baseUrl);

    return sendSuccess(response, 201, "Image uploaded successfully.", {
      url: result.url,
      provider: result.provider,
      publicId: result.publicId,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size
    });
  } catch (error) {
    return next(error);
  }
};

export const uploadDocumentHandler = async (
  request: UploadRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const file = request.file;
    if (!file) throw new AppError(400, "No file was uploaded.", "UPLOAD_001");
    const proto = request.get("x-forwarded-proto") ?? request.protocol;
    const host = request.get("host");
    const baseUrl = host ? `${proto}://${host}` : undefined;
    const result = await uploadDocument(file.buffer, file.originalname, file.mimetype, baseUrl);
    return sendSuccess(response, 201, "Document uploaded successfully.", {
      url: result.url,
      provider: result.provider,
      publicId: result.publicId,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size
    });
  } catch (error) {
    return next(error);
  }
};

export const getDocumentHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const rawId = request.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id || typeof id !== "string") {
      throw new AppError(400, "Document ID is required.", "UPLOAD_003");
    }

    const doc = await getDocument(id);
    if (!doc) {
      throw new AppError(404, "Document not found.", "NOT_FOUND");
    }

    response.setHeader("Content-Type", doc.mimeType || "application/pdf");
    response.setHeader("Content-Length", doc.size);
    response.setHeader(
      "Content-Disposition",
      `inline; filename="${doc.fileName.replace(/"/g, "")}"; filename*=UTF-8''${encodeURIComponent(doc.fileName)}`
    );
    response.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    response.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    return response.send(doc.fileData);
  } catch (error) {
    return next(error);
  }
};
