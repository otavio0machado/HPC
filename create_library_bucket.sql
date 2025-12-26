-- Create the storage bucket for library books
insert into storage.buckets (id, name, public)
values ('library', 'library', true)
on conflict (id) do nothing;

-- Set up security policies for Library

-- 1. Allow public read access (so you can read the books via URL)
drop policy if exists "Public Access to Library" on storage.objects;
create policy "Public Access to Library"
  on storage.objects for select
  using ( bucket_id = 'library' );

-- 2. Allow authenticated users to upload books
drop policy if exists "Authenticated Users can Upload Books" on storage.objects;
create policy "Authenticated Users can Upload Books"
  on storage.objects for insert
  with check ( 
    bucket_id = 'library' 
    and auth.role() = 'authenticated' 
  );

-- 3. Allow users to delete their own books
drop policy if exists "Users can delete own books" on storage.objects;
create policy "Users can delete own books"
  on storage.objects for delete
  using ( 
    bucket_id = 'library' 
    and auth.uid() = owner 
  );
