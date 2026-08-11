import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/app-error.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// apps/api/src/modules/upload -> apps/api/uploads
export const UPLOADS_DIR = path.resolve(__dirname, "../../../uploads");

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif"
]);

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif"
};

export interface UploadResult {
  url: string;
  publicId?: string;
  provider: "cloudinary" | "local";
}

function hasCloudinaryConfig(): boolean {
  return Boolean(
    env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET
  );
}

async function uploadToCloudinary(
  buffer: Buffer,
  originalName: string,
  mime: string
): Promise<UploadResult> {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME!,
    api_key: env.CLOUDINARY_API_KEY!,
    api_secret: env.CLOUDINARY_API_SECRET!,
    secure: true
  });

  const publicId = `itsc/${Date.now()}-${randomUUID()}`;

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        resource_type: "image",
        folder: "itsc",
        use_filename: true,
        unique_filename: true,
        overwrite: false
      },
      (error, response) => {
        if (error) {
          reject(error);
        } else if (response) {
          resolve(response as unknown as { secure_url: string });
        } else {
          reject(new Error("Cloudinary returned an empty response."));
        }
      }
    );
    stream.end(buffer);
  });

  return { url: result.secure_url, publicId, provider: "cloudinary" };
}

async function uploadToDisk(
  buffer: Buffer,
  originalName: string,
  mime: string
): Promise<UploadResult> {
  await mkdir(UPLOADS_DIR, { recursive: true });
  const ext = EXTENSIONS[mime] ?? (path.extname(originalName) || ".bin");
  const filename = `${Date.now()}-${randomUUID()}${ext}`;
  await writeFile(path.join(UPLOADS_DIR, filename), buffer);
  return { url: `/uploads/${filename}`, provider: "local" };
}

export async function uploadImage(
  buffer: Buffer,
  originalName: string,
  mime: string
): Promise<UploadResult> {
  if (!buffer || buffer.length === 0) {
    throw new AppError(400, "No file was uploaded.", "UPLOAD_001");
  }

  if (!ALLOWED_MIME.has(mime)) {
    throw new AppError(
      400,
      "Unsupported file type. Please upload a JPEG, PNG, WebP, GIF, or AVIF image.",
      "UPLOAD_002"
    );
  }

  if (hasCloudinaryConfig()) {
    try {
      return await uploadToCloudinary(buffer, originalName, mime);
    } catch (error) {
      // Fall back to local disk if Cloudinary is unreachable/misconfigured.
      console.warn("Cloudinary upload failed, falling back to local storage:", error);
      return uploadToDisk(buffer, originalName, mime);
    }
  }

  return uploadToDisk(buffer, originalName, mime);
}