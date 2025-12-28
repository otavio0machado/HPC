-- Create a table for Whiteboards
create table if not exists whiteboards (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null default 'Novo Quadro',
  nodes jsonb not null default '[]'::jsonb,
  thumbnail_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table whiteboards enable row level security;

create policy "Users can view their own whiteboards"
  on whiteboards for select
  using (auth.uid() = user_id);

create policy "Users can insert their own whiteboards"
  on whiteboards for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own whiteboards"
  on whiteboards for update
  using (auth.uid() = user_id);

create policy "Users can delete their own whiteboards"
  on whiteboards for delete
  using (auth.uid() = user_id);
