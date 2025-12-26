-- Create Library Tables (Books and Kindle Highlights)

-- 1. BOOKS Table
create table if not exists books (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  author text,
  cover_url text,
  file_url text not null,
  file_path text not null, -- Storage path
  format text not null check (format in ('pdf', 'epub')),
  progress_location text, -- CFI for epub, page number for pdf
  progress_percentage numeric default 0,
  created_at timestamptz default now()
);

alter table books enable row level security;

-- Policy (Drop if exists to avoid error on rerun, or just use separate name if simple)
drop policy if exists "Users can CRUD their own books" on books;
create policy "Users can CRUD their own books"
on books for all
using ( auth.uid() = user_id );


-- 2. KINDLE HIGHLIGHTS Table
create table if not exists kindle_highlights (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  book_title text not null,
  author text,
  content text not null,
  location text, -- "Page 123" or "Loc 1234"
  highlighted_at text, -- Original date string from Kindle
  created_at timestamptz default now()
);

alter table kindle_highlights enable row level security;

drop policy if exists "Users can CRUD their own highlights" on kindle_highlights;
create policy "Users can CRUD their own highlights"
on kindle_highlights for all
using ( auth.uid() = user_id );
