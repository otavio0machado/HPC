-- ==========================================
-- SUPER FIX SCRIPT: LIBRARY MODULE
-- ==========================================

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. TABLES SETUP
-- Create 'books' table if it doesn't exist
create table if not exists books (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  author text,
  cover_url text,
  file_url text not null,
  file_path text not null,
  format text not null check (format in ('pdf', 'epub')),
  progress_location text,
  progress_percentage numeric default 0,
  created_at timestamptz default now()
);

-- Safely enable RLS
alter table books enable row level security;

-- Safely recreate policy for books
drop policy if exists "Users can CRUD their own books" on books;
create policy "Users can CRUD their own books"
on books for all
using ( auth.uid() = user_id );


-- Create 'kindle_highlights' table if it doesn't exist
create table if not exists kindle_highlights (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  book_title text not null,
  author text,
  content text not null,
  location text,
  highlighted_at text,
  created_at timestamptz default now()
);

-- Safely enable RLS
alter table kindle_highlights enable row level security;

-- Safely recreate policy for highlights
drop policy if exists "Users can CRUD their own highlights" on kindle_highlights;
create policy "Users can CRUD their own highlights"
on kindle_highlights for all
using ( auth.uid() = user_id );


-- 2. STORAGE SETUP
-- Create 'library' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('library', 'library', true)
on conflict (id) do nothing;

-- 3. STORAGE POLICIES (Idempotent)
-- Public Access
drop policy if exists "Public Access to Library" on storage.objects;
create policy "Public Access to Library"
  on storage.objects for select
  using ( bucket_id = 'library' );

-- Upload Access
drop policy if exists "Authenticated Users can Upload Books" on storage.objects;
create policy "Authenticated Users can Upload Books"
  on storage.objects for insert
  with check ( 
    bucket_id = 'library' 
    and auth.role() = 'authenticated' 
  );

-- Delete Access
drop policy if exists "Users can delete own books" on storage.objects;
create policy "Users can delete own books"
  on storage.objects for delete
  using ( 
    bucket_id = 'library' 
    and auth.uid() = owner 
  );

-- 4. FORCE CACHE REFRESH
-- This is a dummy operation that forces PostgREST to notice a schema change
comment on table books is 'Table for storing user books';
comment on table kindle_highlights is 'Table for storing Kindle clippings';
