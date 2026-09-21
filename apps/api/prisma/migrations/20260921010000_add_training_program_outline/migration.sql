-- Optional outline content and supporting document for each training programme.
ALTER TABLE "training_programs"
ADD COLUMN "outline_text" TEXT,
ADD COLUMN "outline_file_url" TEXT;
