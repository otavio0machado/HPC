-- 1. Create Subjects Table
create table if not exists subjects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  icon text, -- Lucide icon name
  color text, -- Tailwind color class
  created_at timestamptz default now()
);

alter table subjects enable row level security;

-- Drop existing policy if it exists to avoid errors on re-run
drop policy if exists "Users can CRUD their own subjects" on subjects;

create policy "Users can CRUD their own subjects"
on subjects for all
using ( auth.uid() = user_id );

-- 2. Create Content Folders Table (NEW)
create table if not exists content_folders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  subject_id uuid references subjects(id) on delete cascade not null,
  name text not null,
  created_at timestamptz default now(),
  unique(subject_id, name)
);

alter table content_folders enable row level security;

-- Policies for content_folders
drop policy if exists "Users can CRUD their own folders" on content_folders;
create policy "Users can CRUD their own folders"
on content_folders for all
using ( auth.uid() = user_id );

-- 3. Create Knowledge Pills Table
create table if not exists knowledge_pills (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  subject_id uuid references subjects(id) on delete cascade not null,
  title text not null,
  description text,
  content text not null,
  read_time text,
  source_pdf_url text, -- Optional: link to original file if stored
  layout text default 'default', -- 'default', 'image_top', 'quote', 'list'
  image_url text,
  folder text, -- Keeping as text for compatibility, or can link to content_folders(name)
  created_at timestamptz default now()
);

alter table knowledge_pills enable row level security;

-- Drop existing policy if it exists
drop policy if exists "Users can CRUD their own pills" on knowledge_pills;

create policy "Users can CRUD their own pills"
on knowledge_pills for all
using ( auth.uid() = user_id );

-- 4. Storage Bucket for PDFs
insert into storage.buckets (id, name, public) 
values ('content_pdfs', 'content_pdfs', false)
on conflict (id) do nothing;

drop policy if exists "Computers can upload content pdfs" on storage.objects;
drop policy if exists "Computers can view content pdfs" on storage.objects;

create policy "Computers can upload content pdfs"
on storage.objects for insert
with check ( bucket_id = 'content_pdfs' and auth.role() = 'authenticated' );

create policy "Computers can view content pdfs"
on storage.objects for select
using ( bucket_id = 'content_pdfs' and auth.role() = 'authenticated' );
