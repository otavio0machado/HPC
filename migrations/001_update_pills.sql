-- Add new columns to knowledge_pills for enhanced features
ALTER TABLE knowledge_pills 
ADD COLUMN IF NOT EXISTS layout text DEFAULT 'default', -- 'default', 'image_top', 'quote', 'list'
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS folder text; -- Sub-folder name for organization

-- Optional: Create an index on folder for faster lookups if needed later
CREATE INDEX IF NOT EXISTS idx_knowledge_pills_folder ON knowledge_pills(folder);
