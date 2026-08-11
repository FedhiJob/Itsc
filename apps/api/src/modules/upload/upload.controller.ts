import type { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../utils/api-response.js";
import { AppError } from "../../utils/app-error.js";
import { uploadImage } from "./upload.service.js";

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

    const result = await uploadImage(file.buffer, file.originalname, file.mimetype);

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