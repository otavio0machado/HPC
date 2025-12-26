-- Add pdf_annotations column to notes table
ALTER TABLE notes 
ADD COLUMN IF NOT EXISTS pdf_annotations jsonb DEFAULT '[]'::jsonb;
