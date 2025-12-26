-- Create the storage bucket for notes
insert into storage.buckets (id, name, public)
values ('notes-attachments', 'notes-attachments', true)
on conflict (id) do nothing;

-- Set up security policies

-- 1. Allow public read access (so you can view the PDFs)
create policy "Public Access to Notes Attachments"
  on storage.objects for select
  using ( bucket_id = 'notes-attachments' );

-- 2. Allow authenticated users to upload files
create policy "Authenticated Users can Upload Attachments"
  on storage.objects for insert
  with check ( 
    bucket_id = 'notes-attachments' 
    and auth.role() = 'authenticated' 
  );

-- 3. Allow users to delete their own uploads (optional, but good practice)
create policy "Users can delete own attachments"
  on storage.objects for delete
  using ( 
    bucket_id = 'notes-attachments' 
    and auth.uid() = owner 
  );
