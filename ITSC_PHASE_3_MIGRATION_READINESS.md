# ITSC Phase 3 — Step 1A: Prisma Migration Readiness Review

**Document Version:** 1.0.0  
**Date:** October 17, 2026  
**Auditor Roles:** Principal Database Architect & Senior Prisma Engineer  
**Scope:** `apps/api/prisma/schema.prisma`, Prisma Migration History, Shared Types, and Neon PostgreSQL Target Architecture  
**Execution Authority:** READ-ONLY REVIEW. Zero migrations executed. Zero schema changes committed or staged.

---

## 1. Executive Verdict: READY WITH CONDITIONS

| Dimension | Assessment | Status |
| :--- | :--- | :--- |
| **Schema Design & Type Safety** | All proposed changes are purely additive, backward-compatible, and valid according to `prisma validate`. | **PASS** |
| **Data Safety & Loss Risk** | Zero column drops, zero table drops, zero type narrowing, and zero destructive alterations. All new columns are either nullable or provided with non-null defaults (`[]`, `false`, `0`). | **PASS** |
| **Existing Application Compatibility** | Existing queries and CRUD services continue functioning without regression; unhandled fields in DTOs can be updated progressively in Phase 3. | **PASS** |
| **Remote Database State** | Remote Neon PostgreSQL schema state is currently uninspected to avoid credential exposure and pooler interference. | **UNVERIFIED** |
| **Neon Connection Architecture** | `schema.prisma` currently lacks `directUrl = env("DIRECT_URL")`. Migration execution against Neon pooled endpoints will fail due to PgBouncer session lock and shadow DB limitations. | **ACTION REQUIRED** |
| **Migration Execution Verdict** | **GO for Schema Design**; **NO-GO for Immediate Migration Execution** until `directUrl` is configured and direct credentials are confirmed. | **CONDITIONAL** |

---

## 2. Exact Schema Diffs Against HEAD

A rigorous comparison between `HEAD` and the current working copy of `apps/api/prisma/schema.prisma` reveals the following modifications:

```diff
diff --git a/apps/api/prisma/schema.prisma b/apps/api/prisma/schema.prisma
index b5f5cb5..33a8783 100644
--- a/apps/api/prisma/schema.prisma
+++ b/apps/api/prisma/schema.prisma
@@ -67,11 +67,13 @@ model TrainingProgram {
   fullDescription  String           @map("full_description") @db.Text
   duration         String?          @db.VarChar(50)
   deliveryMode     String?          @map("delivery_mode") @db.VarChar(50)
-    level            String?          @db.VarChar(50)
-    featuredImage    String?          @map("featured_image") @db.Text
-    outlineText      String?          @map("outline_text") @db.Text
-    outlineFileUrl   String?          @map("outline_file_url") @db.Text
-    isFeatured       Boolean          @default(false) @map("is_featured")
+  level            String?          @db.VarChar(50)
+  featuredImage    String?          @map("featured_image") @db.Text
+  outlineText      String?          @map("outline_text") @db.Text
+  outlineFileUrl   String?          @map("outline_file_url") @db.Text
+  isFeatured       Boolean          @default(false) @map("is_featured")
+  objectives       String[]         @default([])
+  prerequisites    String[]         @default([])
   status           ContentStatus    @default(DRAFT)
   deletedAt        DateTime?        @map("deleted_at")
   createdAt        DateTime         @default(now()) @map("created_at")
@@ -92,6 +94,7 @@ model NewsArticle {
   slug          String         @unique @db.VarChar(255)
   summary       String         @db.Text
   content       String         @db.Text
+  category      String?        @db.VarChar(100)
   featuredImage String?        @map("featured_image") @db.Text
   publishedAt   DateTime?      @map("published_at")
   status        ContentStatus  @default(DRAFT)
@@ -102,6 +105,7 @@ model NewsArticle {
 
   @@index([status])
   @@index([publishedAt])
+  @@index([category])
   @@map("news_articles")
 }
 
@@ -111,6 +115,7 @@ model GalleryAlbum {
   slug        String         @unique @db.VarChar(255)
   description String?        @db.Text
   coverImage  String?        @map("cover_image") @db.Text
+  isFeatured  Boolean        @default(false) @map("is_featured")
   createdAt   DateTime       @default(now()) @map("created_at")
   updatedAt   DateTime       @updatedAt @map("updated_at")
   images      GalleryImage[]
@@ -124,10 +129,12 @@ model GalleryImage {
   imageUrl   String       @map("image_url") @db.Text
   caption    String?      @db.Text
   altText    String       @map("alt_text") @db.VarChar(255)
+  sortOrder  Int          @default(0) @map("sort_order")
   uploadedAt DateTime     @default(now()) @map("uploaded_at")
   album      GalleryAlbum @relation(fields: [albumId], references: [id], onDelete: Cascade)
 
   @@index([albumId])
+  @@index([albumId, sortOrder])
   @@map("gallery_images")
 }
 
@@ -136,12 +143,12 @@ model ContactInquiry {
   fullName     String        @map("full_name") @db.VarChar(150)
   email        String        @db.VarChar(255)
   phone        String?       @db.VarChar(50)
-    organization String?       @db.VarChar(255)
-    subject      String        @db.VarChar(255)
-    message      String        @db.Text
-    sourcePage   String?       @map("source_page") @db.VarChar(500)
-    sourceLabel  String?       @map("source_label") @db.VarChar(255)
-    status       InquiryStatus @default(NEW)
+  organization String?       @db.VarChar(255)
+  subject      String        @db.VarChar(255)
+  message      String        @db.Text
+  sourcePage   String?       @map("source_page") @db.VarChar(500)
+  sourceLabel  String?       @map("source_label") @db.VarChar(255)
+  status       InquiryStatus @default(NEW)
   submittedAt  DateTime      @default(now()) @map("submitted_at")
   updatedAt    DateTime      @updatedAt @map("updated_at")
 
@@ -159,3 +166,23 @@ model WebsiteSetting {
 
   @@map("website_settings")
 }
+
+enum LogoType {
+  PARTNER
+  CLIENT
+}
+
+model TrustLogo {
+  id         String   @id @default(uuid()) @db.Uuid
+  name       String   @db.VarChar(150)
+  logoUrl    String   @map("logo_url") @db.Text
+  websiteUrl String?  @map("website_url") @db.Text
+  type       LogoType
+  sortOrder  Int      @default(0) @map("sort_order")
+  isActive   Boolean  @default(true) @map("is_active")
+  createdAt  DateTime @default(now()) @map("created_at")
+  updatedAt  DateTime @updatedAt @map("updated_at")
+
+  @@index([type, isActive])
+  @@map("trust_logos")
+}
```

### Clarification on Candidate Additions vs. Schema Reality
A comparison between items commonly cited for review and the actual working tree indicates:
1. **`TrainingProgram.category`**: NOT a new addition in this diff. It was introduced in the initial migration as a foreign key `categoryId UUID` with relation to `TrainingCategory`.
2. **`TrainingProgram.isFeatured`**: NOT a new addition in this diff. It was introduced in the initial migration as `isFeatured Boolean @default(false)`. The working tree change was purely a 2-space indentation normalization.
3. **`TrainingProgram.sortOrder`**: DOES NOT EXIST on `TrainingProgram`. `sortOrder` is added only to `GalleryImage` and `TrustLogo`.
4. **`NewsArticle.category`**: Added to `NewsArticle` (`String? @db.VarChar(100)` with index).
5. **`GalleryAlbum.isFeatured`**: Added to `GalleryAlbum` (`Boolean @default(false)`).
6. **`GalleryImage.sortOrder`**: Added to `GalleryImage` (`Int @default(0)` with compound index `@@index([albumId, sortOrder])`).

---

## 3. Existing Migration History Summary

The repository currently maintains three recorded migrations in `apps/api/prisma/migrations/`:

| Migration Name | Applied Assets / Tables Created | Notes |
| :--- | :--- | :--- |
| `20260809055241_itsc_initial_migration` | Enums: `AdminRole`, `ContentStatus`, `InquiryStatus`<br>Tables: `administrators`, `training_categories`, `training_programs`, `news_articles`, `gallery_albums`, `gallery_images`, `contact_inquiries`, `website_settings`<br>Foreign keys, unique keys, and primary indexes | Established core schema. Created `website_settings` with `key VARCHAR(120) UNIQUE` and `value JSONB`. |
| `20260921000000_add_contact_inquiry_origin` | Added columns to `contact_inquiries`:<br>- `source_page VARCHAR(500)`<br>- `source_label VARCHAR(255)` | Non-destructive, additive alteration for attribution tracking. |
| `20260921010000_add_training_program_outline` | Added columns to `training_programs`:<br>- `outline_text TEXT`<br>- `outline_file_url TEXT` | Non-destructive, additive alteration for curriculum syllabus. |

**Current Migration Drift:**  
The working tree contains schema definitions that have **not yet been codified into a migration directory** under `apps/api/prisma/migrations/`.

---

## 4. Field-by-Field Compatibility Analysis

### 4.1. `TrustLogo` Model & `LogoType` Enum
1. **Business Requirement:** Replaces static client/partner logo grids on the public homepage and corporate training pages with dynamic, CMS-manageable assets.
2. **Representation Elsewhere:** Defined in `@itsc/shared` as `LogoItem { src, alt, href }` within `HomepageContent.partners` and `HomepageContent.clients`.
3. **Compatibility with Existing Data:** High. Creates a brand-new table `trust_logos`. No collision with existing tables.
4. **Nullability & Defaults:**
   - `id`: UUID primary key.
   - `name`: `VARCHAR(150)` non-null.
   - `logoUrl`: `TEXT` non-null.
   - `websiteUrl`: `TEXT` nullable.
   - `type`: `LogoType` enum (`PARTNER`, `CLIENT`) non-null.
   - `sortOrder`: `Int` default `0`.
   - `isActive`: `Boolean` default `true`.
5. **Indexes:** `@@index([type, isActive])` optimizes the public query filtering active partners/clients ordered by `sortOrder`.
6. **Impact on Queries / DTOs:** No existing queries touch this table yet. Zero regression impact.
7. **Required Data Backfill:** Initial seeding can populate current static partners and clients from mock assets.
8. **CMS Release Priority:** Essential for Phase 3 CMS homepage and corporate trust sections.

### 4.2. `TrainingProgram.objectives` (`String[] @default([])`)
1. **Business Requirement:** Enables structured display of learning objectives on program detail pages ("What you'll learn").
2. **Representation Elsewhere:** Defined in `@itsc/shared` contract `TrainingProgramDetail.objectives: string[]`.
3. **Compatibility with Existing Data:** 100% compatible. Maps to native PostgreSQL `text[]`. Existing rows receive empty array `{}`.
4. **Nullability & Defaults:** Non-null with default empty array `@default([])`. No `NULL` values will be created.
5. **Indexes:** None required (unindexed text array).
6. **Impact on Queries / DTOs:** Prisma automatically returns `string[]`. `training.schema.ts` `createProgramSchema` does not currently include `objectives`, which should be added in Step 2 of Phase 3.
7. **Required Data Backfill:** None required. Optional seed script update to populate realistic bullet points.
8. **CMS Release Priority:** Essential to satisfy `TrainingProgramDetail` contract without runtime defaults.

### 4.3. `TrainingProgram.prerequisites` (`String[] @default([])`)
1. **Business Requirement:** Outlines target audience prerequisites on program detail pages.
2. **Representation Elsewhere:** Defined in `@itsc/shared` contract `TrainingProgramDetail.prerequisites: string[]`.
3. **Compatibility with Existing Data:** 100% compatible. Maps to native PostgreSQL `text[]`. Existing rows receive empty array `{}`.
4. **Nullability & Defaults:** Non-null with default empty array `@default([])`.
5. **Indexes:** None required.
6. **Impact on Queries / DTOs:** Handled cleanly by Prisma client. DTO update scheduled for Phase 3 training module extension.
7. **Required Data Backfill:** None required.
8. **CMS Release Priority:** Essential.

### 4.4. `TrainingProgram.category`
- **Audit Clarification:** This is NOT a new column. It is the existing relation `category TrainingCategory @relation(fields: [categoryId], references: [id])`. The schema diff shows no modifications to this relationship. Fully intact and verified.

### 4.5. `TrainingProgram.isFeatured`
- **Audit Clarification:** This is NOT a new column. It was created in `20260809055241_itsc_initial_migration` as `is_featured BOOLEAN NOT NULL DEFAULT false` with index `training_programs_is_featured_idx`. The diff in the working copy is strictly 2-space indentation normalization.

### 4.6. `TrainingProgram.sortOrder`
- **Audit Clarification:** `sortOrder` does NOT exist on `TrainingProgram` and is NOT proposed in the schema diff. Ordering for training programs is handled by `createdAt: desc` or alphabetical title.

### 4.7. `NewsArticle.category` (`String? @db.VarChar(100)`)
1. **Business Requirement:** Categorization of news items (e.g., "Corporate Announcement", "Press Release", "Training Update").
2. **Representation Elsewhere:** Present in `@itsc/shared` as `NewsArticleSummary.category: string`.
3. **Compatibility with Existing Data:** Fully compatible. Column is nullable (`String?`). Existing articles will have `NULL`.
4. **Nullability & Defaults:** Nullable with no default.
5. **Indexes:** `@@index([category])` added to accelerate filtering by category.
6. **Impact on Queries / DTOs:** Existing queries select all columns; `category` will return `null` for unmigrated data. The frontend can fall back to `"General"` when category is null.
7. **Required Data Backfill:** Minor seed script update for existing mock news articles.
8. **CMS Release Priority:** Recommended for Phase 3 news module enhancements.

### 4.8. `GalleryAlbum.isFeatured` (`Boolean @default(false)`)
1. **Business Requirement:** Allows flagging albums for highlight cards or homepage showcase.
2. **Representation Elsewhere:** Used in public gallery components to prioritize featured albums.
3. **Compatibility with Existing Data:** Fully compatible. Existing rows automatically receive `false`.
4. **Nullability & Defaults:** Non-null with default `false`.
5. **Indexes:** Unindexed. (Low cardinality table; full scan is instantaneous).
6. **Impact on Queries / DTOs:** Additive; existing queries remain functional.
7. **Required Data Backfill:** None required.
8. **CMS Release Priority:** Recommended.

### 4.9. `GalleryImage.sortOrder` (`Int @default(0)`)
1. **Business Requirement:** Enables drag-and-drop or manual reordering of images within an album.
2. **Representation Elsewhere:** Used by Phase 2 gallery manager in `apps/web/src/app/admin/gallery/page.tsx`.
3. **Compatibility with Existing Data:** Fully compatible. Existing images receive `0`.
4. **Nullability & Defaults:** Non-null with default `0`.
5. **Indexes:** Compound index `@@index([albumId, sortOrder])` provides indexed sort performance when fetching album images.
6. **Impact on Queries / DTOs:** Matches the admin UI expectation for image ordering.
7. **Required Data Backfill:** None required.
8. **CMS Release Priority:** Essential for Phase 2/Phase 3 gallery image management integration.

---

## 5. Remote Database State: UNVERIFIED

In compliance with the read-only audit protocol and security standards:
- **Direct live inspection was NOT executed** to avoid exposing production connection credentials or triggering unauthorized lock attempts on the live database.
- **Remote state is classified as UNVERIFIED.**
- **Pre-execution Verification Protocol:** Prior to running `prisma migrate deploy` in staging or production, the database administrator or authorized pipeline must execute:
  ```bash
  # Check current applied migrations against the _prisma_migrations table
  npx prisma migrate status --schema=apps/api/prisma/schema.prisma
  ```
  Expected baseline: 3 applied migrations (`20260809055241_itsc_initial_migration`, `20260921000000_add_contact_inquiry_origin`, `20260921010000_add_training_program_outline`).

---

## 6. Required Neon Connection Configuration

### 6.1. Runtime vs. Migration Architecture
Neon PostgreSQL utilizes **PgBouncer** for connection pooling. This introduces a critical distinction between runtime queries and migration execution:

```
+-------------------------------------------------------------------------------+
|                             NEON POSTGRESQL HOST                              |
+-------------------------------------------------------------------------------+
                                        ^
                                        | (direct port 5432, session mode)
                                        |
       +--------------------------------+--------------------------------+
       |                                                                 |
[DIRECT_URL]                                                      [DATABASE_URL]
Direct Connection (No PgBouncer)                    Pooled Connection (PgBouncer)
Used for:                                           Used for:
- prisma migrate dev / deploy                       - Express API runtime operations
- schema DDL locks                                  - High-concurrency client traffic
- shadow database provisioning                      - Short-lived transactional queries
```

### 6.2. Neon Connection Pitfall & Prisma 6 Mitigation
If `prisma migrate` is pointed at a pooled connection (containing `-pooler` in the host string):
1. **Advisory Lock Failure:** PgBouncer does not preserve session-level advisory locks across multiple statements in transaction mode. Prisma uses `pg_advisory_lock` to ensure migration isolation.
2. **Shadow Database Creation:** `prisma migrate dev` attempts to create and tear down a temporary shadow database. Connection poolers prohibit `CREATE DATABASE` commands.

### 6.3. Required Schema Update
Before authorizing any migration command, `apps/api/prisma/schema.prisma` must be updated with the `directUrl` directive:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

- In `.env` / deployment environment:
  - `DATABASE_URL`: `postgresql://user:pass@ep-...-pooler.region.aws.neon.tech/neondb?sslmode=require`
  - `DIRECT_URL`: `postgresql://user:pass@ep-....region.aws.neon.tech/neondb?sslmode=require` (no `-pooler`)

---

## 7. Data-Loss, Deployment-Order, and Compatibility Risks

| Risk Category | Severity | Analysis & Mitigation |
| :--- | :--- | :--- |
| **Destructive DDL** | **NONE** | No `DROP TABLE`, `DROP COLUMN`, or `DROP TYPE`. All modifications are pure column additions and table creation. |
| **Lock Contention** | **LOW** | Adding nullable columns or columns with constant defaults in PostgreSQL 11+ modifies catalog metadata without table rewrites (`ALTER TABLE ... ADD COLUMN ... DEFAULT ...` is an instantaneous `O(1)` metadata operation). |
| **Data Truncation** | **NONE** | No column type narrowing or length reductions. |
| **Deployment Order** | **FLEXIBLE** | Because all new columns are either nullable or defaulted: <br>1. **Database Migration First:** Deployed before API update — existing API ignores new columns; no disruption.<br>2. **API Deployment First:** API with updated Prisma client will read defaults or nulls safely. |
| **Rollback Risk** | **LOW** | Can be cleanly reverted using an explicit down-migration script without data loss to existing tables. |

---

## 8. Recommended Migration Contents (Exact SQL DDL)

When authorized, the migration will generate the following atomic SQL DDL:

```sql
-- 1. CreateEnum: LogoType
CREATE TYPE "LogoType" AS ENUM ('PARTNER', 'CLIENT');

-- 2. AlterTable: training_programs
ALTER TABLE "training_programs"
ADD COLUMN "objectives" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "prerequisites" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- 3. AlterTable: news_articles
ALTER TABLE "news_articles"
ADD COLUMN "category" VARCHAR(100);

-- 4. AlterTable: gallery_albums
ALTER TABLE "gallery_albums"
ADD COLUMN "is_featured" BOOLEAN NOT NULL DEFAULT false;

-- 5. AlterTable: gallery_images
ALTER TABLE "gallery_images"
ADD COLUMN "sort_order" INTEGER NOT NULL DEFAULT 0;

-- 6. CreateTable: trust_logos
CREATE TABLE "trust_logos" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "logo_url" TEXT NOT NULL,
    "website_url" TEXT,
    "type" "LogoType" NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trust_logos_pkey" PRIMARY KEY ("id")
);

-- 7. CreateIndex: news_articles.category
CREATE INDEX "news_articles_category_idx" ON "news_articles"("category");

-- 8. CreateIndex: gallery_images.album_id_sort_order
CREATE INDEX "gallery_images_album_id_sort_order_idx" ON "gallery_images"("album_id", "sort_order");

-- 9. CreateIndex: trust_logos.type_is_active
CREATE INDEX "trust_logos_type_is_active_idx" ON "trust_logos"("type", "is_active");
```

---

## 9. Verification and Rollback Plan

### 9.1. Post-Migration Verification Steps
1. **Inspect Migration Status:**
   ```bash
   npx prisma migrate status --schema=apps/api/prisma/schema.prisma
   ```
   Must output: `Database schema is up to date!`.
2. **Validate Schema Synchronization:**
   ```bash
   npm --workspace=api run prisma:generate
   npm --workspace=api run typecheck
   ```
   Must output 0 TypeScript compilation errors.
3. **Execute API Test Suite:**
   ```bash
   npm --workspace=api run test
   ```
   All test suites (auth, settings, rbac) must pass without regressions.

### 9.2. Emergency Rollback SQL (Down Migration)
If an unforeseen production issue arises post-migration, execute this non-destructive rollback script via direct connection:

```sql
-- 1. Drop Indexes
DROP INDEX IF EXISTS "trust_logos_type_is_active_idx";
DROP INDEX IF EXISTS "gallery_images_album_id_sort_order_idx";
DROP INDEX IF EXISTS "news_articles_category_idx";

-- 2. Drop New Table
DROP TABLE IF EXISTS "trust_logos";

-- 3. Drop Added Columns from Existing Tables
ALTER TABLE "gallery_images" DROP COLUMN IF EXISTS "sort_order";
ALTER TABLE "gallery_albums" DROP COLUMN IF EXISTS "is_featured";
ALTER TABLE "news_articles" DROP COLUMN IF EXISTS "category";
ALTER TABLE "training_programs" DROP COLUMN IF EXISTS "prerequisites";
ALTER TABLE "training_programs" DROP COLUMN IF EXISTS "objectives";

-- 4. Drop Enum
DROP TYPE IF EXISTS "LogoType";

-- 5. Remove Migration Record from _prisma_migrations
DELETE FROM "_prisma_migrations" WHERE "migration_name" LIKE '%phase_3_cms%';
```

---

## 10. Explicit Go / No-Go Decision

### Current Decision:
```
+--------------------------------------------------------------------------+
|  GO FOR SCHEMA DESIGN                                                    |
|  NO-GO FOR IMMEDIATE MIGRATION EXECUTION                                 |
+--------------------------------------------------------------------------+
```

### Pre-conditions for Migration Authorization:
1. **Schema Configuration:** Update `apps/api/prisma/schema.prisma` to include `directUrl = env("DIRECT_URL")`.
2. **Environment Variable Configuration:** Ensure `DIRECT_URL` (direct Neon connection without `-pooler`) is populated in the relevant `.env` or deployment secrets vault.
3. **Formal User Authorization:** Await explicit user authorization to create migration files and execute `prisma migrate`.

