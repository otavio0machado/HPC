-- Nexus Mind: Block-Based Architecture Schema

-- 1. BLOCKS TABLE
-- Stores individual content nodes (nodes in the ProseMirror/TipTap tree)
CREATE TABLE public.blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE NOT NULL,
  
  -- The content of the block (e.g., text, or JSON for complex nodes)
  content TEXT, 
  
  -- Block Type: 'paragraph', 'heading', 'bulletList', 'listItem', 'image', 'codeBlock', etc.
  type TEXT NOT NULL,
  
  -- Hierarchy
  parent_block_id UUID REFERENCES public.blocks(id) ON DELETE CASCADE,
  
  -- Metadata / Properties (JSONB is flexible for: collapsed state, SRS data, specialized attrs)
  properties JSONB DEFAULT '{}'::JSONB,
  
  -- Ordering
  rank TEXT, -- We will use string-based ranking (LexoRank style) or simple indexes later. For now, we might rely on the array order in the editor JSON for reconstruction.
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup of all blocks in a note
CREATE INDEX idx_blocks_note_id ON public.blocks(note_id);

-- Enable RLS
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see/edit blocks if they own the note
-- (Assuming we can join to notes.user_id efficiently, otherwise we might duplicate user_id on blocks)
-- For performance/simplicity, let's duplicate user_id or do a join check.
-- Duplicating user_id is safer for RLS.

ALTER TABLE public.blocks ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL;

CREATE POLICY "Users can CRUD their own blocks"
ON public.blocks FOR ALL
USING ( auth.uid() = user_id );

-- 2. LINKS TABLE (For Backlinks & Graph)
-- Stores the edges between notes or blocks
CREATE TABLE public.links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_block_id UUID REFERENCES public.blocks(id) ON DELETE CASCADE, -- The block containing the link
  source_note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE NOT NULL, -- The note containing the link
  
  target_note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE, -- The note being linked to (optional if linking to specific block)
  target_block_id UUID REFERENCES public.blocks(id) ON DELETE CASCADE, -- The specific block being linked to (optional)
  
  type TEXT DEFAULT 'wiki', -- 'wiki', 'embed', 'tag', etc.
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_links_source_note ON public.links(source_note_id);
CREATE INDEX idx_links_target_note ON public.links(target_note_id);

ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own links"
ON public.links FOR ALL
USING ( 
  EXISTS (
    SELECT 1 FROM public.notes WHERE id = links.source_note_id AND user_id = auth.uid()
  )
);
