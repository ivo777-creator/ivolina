-- ===========================================================
-- IVOLINA — Supabase schema
-- Copy ALL of this and run it in Supabase SQL Editor (one time)
-- ===========================================================

-- Single key-value table. Simple and flexible.
create table if not exists kv (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table kv enable row level security;

-- Allow public read/write (the app's password gate is our security)
-- This is intentional for this small two-person project.
drop policy if exists "read all" on kv;
create policy "read all" on kv for select using (true);

drop policy if exists "write all" on kv;
create policy "write all" on kv for insert with check (true);

drop policy if exists "update all" on kv;
create policy "update all" on kv for update using (true);

drop policy if exists "delete all" on kv;
create policy "delete all" on kv for delete using (true);

-- Enable realtime on this table so both phones sync live
alter publication supabase_realtime add table kv;
