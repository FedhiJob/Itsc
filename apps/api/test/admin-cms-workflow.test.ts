import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

loadEnv({
  path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env"),
  override: true
});

import { trainingService } from "../src/modules/training/training.service.js";
import { settingsService } from "../src/modules/settings/settings.service.js";
import { prisma } from "../src/lib/prisma.js";

async function warmupNeon() {
  for (let i = 0; i < 5; i++) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 2500));
    }
  }
}

describe("ITSC Admin CMS Workflows & Publication Rules", () => {
  let createdParentId: string | null = null;
  let createdChildId: string | null = null;
  let createdProgramId: string | null = null;
  let authorId: string = "";

  it("identifies or creates a system administrator for authoring", async () => {
    await warmupNeon();
    let admin = await prisma.administrator.findFirst({ where: { role: "SUPER_ADMIN" } });
    if (!admin) {
      admin = await prisma.administrator.findFirst();
    }
    assert.ok(admin, "An administrator must exist in the system");
    authorId = admin.id;
  });

  it("allows admin to create a top-level category and child track", async () => {
    const parent = await trainingService.createCategory({
      name: "Automated Test Vendor",
      slug: "auto-test-vendor-" + Date.now(),
      description: "Temporary vendor for testing",
      sortOrder: 999
    });
    assert.ok(parent.id);
    createdParentId = parent.id;

    const child = await trainingService.createCategory({
      name: "Automated Test Track",
      slug: "auto-test-track-" + Date.now(),
      description: "Temporary track for testing",
      parentId: parent.id,
      sortOrder: 1
    });
    assert.ok(child.id);
    assert.equal(child.parentId, parent.id);
    createdChildId = child.id;
  });

  it("allows admin to update category details and reorder", async () => {
    assert.ok(createdChildId);
    const updated = await trainingService.updateCategory(createdChildId, {
      name: "Automated Test Track Updated",
      sortOrder: 5
    });
    assert.equal(updated.name, "Automated Test Track Updated");
    assert.equal(updated.sortOrder, 5);
  });

  it("creates a course assigned to the nested track and verifies public publication", async () => {
    assert.ok(createdChildId);
    const testCourseSlug = "auto-test-course-" + Date.now();
    const course = await trainingService.createProgram(
      {
        categoryId: createdChildId,
        title: "Advanced Cloud & Security Automation",
        slug: testCourseSlug,
        code: "AUTO-999",
        duration: "3 Days",
        deliveryMode: "Virtual Classroom",
        level: "Advanced",
        shortDescription: "Automated test course short description for workflow verification.",
        fullDescription: "Automated test course full description testing complete lifecycle.",
        objectives: ["Objective 1: Cloud Architecture", "Objective 2: Deployment Security"],
        prerequisites: ["Prerequisite: Basic TCP/IP"],
        isFeatured: true,
        sortOrder: 1,
        status: "PUBLISHED"
      },
      authorId
    );

    assert.ok(course.id);
    assert.equal(course.code, "AUTO-999");
    assert.equal(course.status, "PUBLISHED");
    createdProgramId = course.id;

    // Verify it is visible in public list / search
    const searched = await trainingService.listPrograms({
      search: "AUTO-999",
      status: "PUBLISHED"
    });
    const foundInAll = searched.programs.find((p) => p.id === course.id);
    assert.ok(foundInAll, "Published course must appear in public programs search");
    assert.equal(foundInAll.code, "AUTO-999");

    const parentCategory = await prisma.trainingCategory.findUnique({ where: { id: createdParentId! } });
    assert.ok(parentCategory);

    // Verify it is retrievable by public slug
    const bySlug = await trainingService.getProgramBySlug(testCourseSlug);
    assert.ok(bySlug, "Course must be retrievable by public slug");
    assert.equal(bySlug.code, "AUTO-999");
    assert.equal(bySlug.category.parent?.slug, parentCategory.slug);

    // Verify it is searchable by parent category
    const byParent = await trainingService.listPrograms({
      category: parentCategory.slug,
      status: "PUBLISHED"
    });
    const foundInParent = byParent.programs.find((p) => p.id === course.id);
    assert.ok(foundInParent, "Course must be findable when filtering by parent vendor slug");
  });

  it("unpublishing (setting to DRAFT) immediately hides the course from public queries", async () => {
    assert.ok(createdProgramId);
    await trainingService.updateProgram(createdProgramId, {
      status: "DRAFT"
    });

    const published = await trainingService.listPrograms({
      status: "PUBLISHED",
      limit: 500
    });
    const found = published.programs.find((p) => p.id === createdProgramId);
    assert.equal(found, undefined, "DRAFT course must NEVER appear in public published listings");
  });

  it("verifies public settings endpoint only exposes allow-listed keys", async () => {
    const publicSettings = await settingsService.getPublicSettings();
    const allowedKeys = new Set([
      "seo_defaults",
      "contact_info",
      "site_config",
      "homepage",
      "about",
      "corporate_training"
    ]);

    for (const setting of publicSettings) {
      assert.ok(
        allowedKeys.has(setting.key),
        `Key "${setting.key}" must be in the public allow-list`
      );
    }
  });

  it("cleans up test records cleanly with zero leftover test data", async () => {
    if (createdProgramId) {
      await prisma.trainingProgram.delete({ where: { id: createdProgramId } });
    }
    if (createdChildId) {
      await trainingService.deleteCategory(createdChildId);
    }
    if (createdParentId) {
      await trainingService.deleteCategory(createdParentId);
    }

    // Verify cleanup
    if (createdProgramId) {
      const p = await prisma.trainingProgram.findUnique({ where: { id: createdProgramId } });
      assert.equal(p, null);
    }
    if (createdChildId) {
      const c = await prisma.trainingCategory.findUnique({ where: { id: createdChildId } });
      assert.equal(c, null);
    }
    if (createdParentId) {
      const parent = await prisma.trainingCategory.findUnique({ where: { id: createdParentId } });
      assert.equal(parent, null);
    }
  });
});
