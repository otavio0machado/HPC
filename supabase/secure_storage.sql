-- 1. HARDEN "content_pdfs" BUCKET
-- Remove old loose policies
drop policy if exists "Computers can upload content pdfs" on storage.objects;
drop policy if exists "Computers can view content pdfs" on storage.objects;
drop policy if exists "Authenticated users can upload" on storage.objects;
drop policy if exists "Authenticated users can select" on storage.objects;

-- Create restrictive policies for "content_pdfs"
-- Assuming structure: user_id/filename.pdf
create policy "Users can upload their own content pdfs"
on storage.objects for insert
with check (
  bucket_id = 'content_pdfs' 
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can view their own content pdfs"
on storage.objects for select
using (
  bucket_id = 'content_pdfs' 
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can update their own content pdfs"
on storage.objects for update
using (
  bucket_id = 'content_pdfs' 
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete their own content pdfs"
on storage.objects for delete
using (
  bucket_id = 'content_pdfs' 
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 2. HARDEN "library" BUCKET
-- Remove potentially loose policies (if any exists, usually created in UI)
-- We will just ensure correct ones exist.

-- Assuming libraryService uses: user_id/timestamp_name
create policy "Users can upload their own library books"
on storage.objects for insert
with check (
  bucket_id = 'library' 
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can view their own library books"
on storage.objects for select
using (
  bucket_id = 'library' 
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete their own library books"
on storage.objects for delete
using (
  bucket_id = 'library' 
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);
