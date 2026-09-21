-- Preserve the page and programme context for leads submitted through contact CTAs.
ALTER TABLE "contact_inquiries"
ADD COLUMN "source_page" VARCHAR(500),
ADD COLUMN "source_label" VARCHAR(255);
