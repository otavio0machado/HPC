-- Add is_favorite column if it doesn't exist
ALTER TABLE notes ADD COLUMN IF NOT EXISTS is_favorite boolean DEFAULT false;

-- Add pdf_annotations column if it doesn't exist (just in case)
ALTER TABLE notes ADD COLUMN IF NOT EXISTS pdf_annotations jsonb DEFAULT '[]'::jsonb;
