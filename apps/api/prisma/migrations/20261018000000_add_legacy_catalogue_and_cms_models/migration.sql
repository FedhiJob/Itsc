-- CreateEnum
CREATE TYPE "LogoType" AS ENUM ('PARTNER', 'CLIENT');

-- AlterTable
ALTER TABLE "training_categories"
ADD COLUMN "parent_id" UUID,
ADD COLUMN "sort_order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "training_programs"
ADD COLUMN "code" VARCHAR(50),
ADD COLUMN "sort_order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "objectives" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "prerequisites" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "news_articles"
ADD COLUMN "category" VARCHAR(100);

-- AlterTable
ALTER TABLE "gallery_albums"
ADD COLUMN "is_featured" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "gallery_images"
ADD COLUMN "sort_order" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
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

-- CreateIndex
CREATE INDEX "training_categories_parent_id_idx" ON "training_categories"("parent_id");

-- CreateIndex
CREATE INDEX "news_articles_category_idx" ON "news_articles"("category");

-- CreateIndex
CREATE INDEX "gallery_images_album_id_sort_order_idx" ON "gallery_images"("album_id", "sort_order");

-- CreateIndex
CREATE INDEX "trust_logos_type_is_active_idx" ON "trust_logos"("type", "is_active");

-- AddForeignKey
ALTER TABLE "training_categories" ADD CONSTRAINT "training_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "training_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

