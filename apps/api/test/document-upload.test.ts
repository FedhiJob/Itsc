import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { config as loadEnv } from "dotenv";

loadEnv({ path: path.resolve(process.cwd(), "apps/api/.env"), override: true });

import { prisma } from "../src/lib/prisma.js";
import { getDocument, uploadDocument } from "../src/modules/upload/upload.service.js";

test("Document Upload & Neon Database Storage Suite", async (t) => {
  let createdDocId: string | null = null;

  // Warm up connection
  await prisma.$connect();

  await t.test("1. uploadDocument stores PDF binary in Neon PostgreSQL and returns direct API URL", async () => {
    const dummyPdfContent = "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n%%EOF";
    const sampleBuffer = Buffer.from(dummyPdfContent, "utf-8");
    const originalName = "Android-Security-Essentials-Outline.pdf";
    const mime = "application/pdf";
    const baseUrl = "https://itsc.onrender.com";

    const result = await uploadDocument(sampleBuffer, originalName, mime, baseUrl);

    assert.ok(result.url, "Upload result should contain a URL");
    assert.strictEqual(result.provider, "database", "Provider should be 'database'");
    assert.ok(result.publicId, "Upload result should contain a publicId (UUID)");
    assert.match(
      result.url,
      /^https:\/\/itsc\.onrender\.com\/api\/v1\/upload\/document\/[a-f0-9-]+\/Android-Security-Essentials-Outline\.pdf$/,
      "URL should point to the Express document streaming endpoint with original filename"
    );

    createdDocId = result.publicId!;
  });

  await t.test("2. getDocument retrieves the exact binary payload, mime type, and filename from Neon", async () => {
    assert.ok(createdDocId, "createdDocId must exist from previous subtest");

    const retrieved = await getDocument(createdDocId);
    assert.ok(retrieved, "Document should be found in database");
    assert.strictEqual(retrieved.fileName, "Android-Security-Essentials-Outline.pdf");
    assert.strictEqual(retrieved.mimeType, "application/pdf");
    assert.ok(retrieved.size > 0, "Document size should be greater than 0");
    assert.strictEqual(
      retrieved.fileData.toString("utf-8").startsWith("%PDF-1.4"),
      true,
      "Retrieved binary data should match original PDF header"
    );
  });

  await t.test("3. getDocument returns null for non-existent IDs without error", async () => {
    const nonExistent = await getDocument("00000000-0000-0000-0000-000000000000");
    assert.strictEqual(nonExistent, null, "Should return null for non-existent document");
  });

  // Cleanup
  if (createdDocId) {
    await prisma.uploadedDocument.delete({
      where: { id: createdDocId }
    }).catch(() => {});
  }
  await prisma.$disconnect();
});
