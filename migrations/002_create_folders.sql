-- Create Content Folders Table
create table if not exists content_folders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  subject_id uuid references subjects(id) on delete cascade not null,
  name text not null,
  created_at timestamptz default now(),
  unique(subject_id, name) -- Prevent duplicate folder names in the same subject
);

alter table content_folders enable row level security;

-- Policies for content_folders
drop policy if exists "Users can CRUD their own folders" on content_folders;
create policy "Users can CRUD their own folders"
on content_folders for all
using ( auth.uid() = user_id );

-- Update knowledge_pills to reference content_folders if we want to be strict, 
-- but for now keeping 'folder' as a text field for compatibility is easier, 
-- just ensuring the UI can sync them.
