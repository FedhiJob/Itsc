import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../../config/env.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/app-error.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// apps/api/src/modules/upload -> apps/api/uploads
export const UPLOADS_DIR = path.resolve(__dirname, "../../../uploads");
export const DOCUMENTS_DIR = path.join(UPLOADS_DIR, "documents");

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

const ALLOWED_DOCUMENT_MIME = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

const DOCUMENT_EXTENSIONS: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx"
};

export interface UploadResult {
  url: string;
  publicId?: string;
  provider: "cloudinary" | "local" | "database";
}

export interface DocumentRecord {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  fileData: Buffer;
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
  mime: string,
  baseUrl?: string
): Promise<UploadResult> {
  await mkdir(UPLOADS_DIR, { recursive: true });
  const ext = EXTENSIONS[mime] ?? (path.extname(originalName) || ".bin");
  const filename = `${Date.now()}-${randomUUID()}${ext}`;
  await writeFile(path.join(UPLOADS_DIR, filename), buffer);
  const base = (baseUrl ?? env.PUBLIC_BASE_URL).replace(/\/$/, "");
  return { url: `${base}/uploads/${filename}`, provider: "local" };
}

export async function uploadImage(
  buffer: Buffer,
  originalName: string,
  mime: string,
  baseUrl?: string
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
      return uploadToDisk(buffer, originalName, mime, baseUrl);
    }
  }

  return uploadToDisk(buffer, originalName, mime, baseUrl);
}

/**
 * Uploads a document (PDF / DOCX).
 * Documents (such as course outlines and syllabi) are stored permanently in
 * Neon PostgreSQL (bytea) and cached to local disk on Render.
 * This guarantees documents persist across Render container redeployments and
 * bypasses Cloudinary's raw-delivery restrictions.
 */
export async function uploadDocument(
  buffer: Buffer,
  originalName: string,
  mime: string,
  baseUrl?: string
): Promise<UploadResult> {
  if (!buffer || buffer.length === 0) {
    throw new AppError(400, "No file was uploaded.", "UPLOAD_001");
  }

  if (!ALLOWED_DOCUMENT_MIME.has(mime)) {
    throw new AppError(
      400,
      "Unsupported file type. Please upload a PDF or DOCX document.",
      "UPLOAD_002"
    );
  }

  const extension = DOCUMENT_EXTENSIONS[mime] ?? (path.extname(originalName) || ".pdf");
  const parsed = path.parse(originalName);
  const cleanName = `${parsed.name || "outline"}${extension}`;

  // 1. Store permanently in Neon PostgreSQL
  const doc = await prisma.uploadedDocument.create({
    data: {
      fileName: cleanName,
      mimeType: mime,
      size: buffer.length,
      fileData: new Uint8Array(buffer)
    }
  });

  // 2. Cache to disk on Render if directory is available
  try {
    await mkdir(DOCUMENTS_DIR, { recursive: true });
    await writeFile(path.join(DOCUMENTS_DIR, `${doc.id}-${cleanName}`), buffer);
  } catch {
    // Disk write error is non-fatal since Neon has persistent storage
  }

  // 3. Generate direct, permanent URL served by the API
  const base = (baseUrl ?? env.PUBLIC_BASE_URL).replace(/\/$/, "");
  const url = `${base}/api/v1/upload/document/${doc.id}/${encodeURIComponent(cleanName)}`;

  return {
    url,
    publicId: doc.id,
    provider: "database"
  };
}

/**
 * Retrieves a stored document by its UUID.
 * Checks the local disk cache first, falling back to Neon PostgreSQL.
 */
export async function getDocument(id: string): Promise<DocumentRecord | null> {
  // 1. Check database for record metadata and binary
  const doc = await prisma.uploadedDocument.findUnique({
    where: { id }
  });

  if (!doc) {
    return null;
  }

  const fileBuffer = Buffer.isBuffer(doc.fileData)
    ? doc.fileData
    : Buffer.from(doc.fileData);

  return {
    id: doc.id,
    fileName: doc.fileName,
    mimeType: doc.mimeType,
    size: doc.size,
    fileData: fileBuffer
  };
}
