-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Linked to auth.users)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  name text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view their own profile" 
on profiles for select 
using ( auth.uid() = id );

create policy "Users can update their own profile" 
on profiles for update 
using ( auth.uid() = id );

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. NOTES
create table notes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  parent_id uuid references notes(id) on delete cascade, -- Recursive relationship
  name text not null,
  type text not null check (type in ('folder', 'markdown', 'pdf')),
  content text, -- Markdown content
  tags text[] default '{}', -- Tags for filtering
  is_favorite boolean default false, -- Favorite status
  pdf_url text, -- We will store URL instead of base64 if possible, but for now matching interface logic implies data.
  pdf_data text, -- Storing base64 here if needed, but discouraged for large files. keeping for compat.
  created_at bigint not null default extract(epoch from now())::bigint * 1000,
  updated_at bigint not null default extract(epoch from now())::bigint * 1000
);

alter table notes enable row level security;

create policy "Users can CRUD their own notes"
on notes for all
using ( auth.uid() = user_id );


-- 3. FLASHCARDS
create table flashcards (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  front text not null,
  back text not null,
  folder_path text[] default '{}', -- Array of strings for path
  next_review bigint not null,
  interval int not null, -- Days (or whatever unit logic uses)
  ease float not null,
  repetitions int not null default 0,
  created_at timestamptz default now()
);

alter table flashcards enable row level security;

create policy "Users can CRUD their own flashcards"
on flashcards for all
using ( auth.uid() = user_id );


-- 4. TASKS (Planner)
create table tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  completed boolean default false,
  scope text not null check (scope in ('Daily', 'Weekly', 'Monthly')),
  priority text not null check (priority in ('High', 'Medium', 'Low')),
  date text, -- DD/MM/YYYY
  time text, -- HH:MM
  created_at bigint not null default extract(epoch from now())::bigint * 1000
);

alter table tasks enable row level security;

create policy "Users can CRUD their own tasks"
on tasks for all
using ( auth.uid() = user_id );


-- 5. SIMULADOS
create table simulados (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date text not null,
  exam_type text not null,
  areas jsonb not null, -- Stores the array of area objects
  essay_score numeric,
  total_score numeric,
  ai_analysis text,
  created_at timestamptz default now()
);

alter table simulados enable row level security;

create policy "Users can CRUD their own simulados"
on simulados for all
using ( auth.uid() = user_id );
