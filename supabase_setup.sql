-- ══════════════════════════════════════════
-- Run this ONCE in your Supabase SQL Editor
-- Project: https://keytnnyuqahejpvnnskw.supabase.co
-- ══════════════════════════════════════════

-- 1. Create bookings table
create table if not exists public.bookings (
  id          text        primary key default 'BK' || extract(epoch from now())::text,
  fname       text        not null,
  lname       text        not null,
  email       text        not null,
  phone       text,
  home        text        not null,
  guests      text,
  checkin     date,
  checkout    date,
  requests    text,
  status      text        not null default 'pending',
  notes       text        default '',
  payment_id  text,
  amount_paid integer     default 0,
  received    timestamptz default now()
);

-- 2. Enable Row Level Security
alter table public.bookings enable row level security;

-- 3. Allow anyone to INSERT (guests booking)
create policy "Allow guest insert"
  on public.bookings
  for insert
  to anon
  with check (true);

-- 4. Allow anyone to SELECT (admin reads — tighten this with auth later)
create policy "Allow admin select"
  on public.bookings
  for select
  to anon
  using (true);

-- 5. Allow anyone to UPDATE (admin updates status)
create policy "Allow admin update"
  on public.bookings
  for update
  to anon
  using (true);

-- 6. Allow anyone to DELETE (admin deletes)
create policy "Allow admin delete"
  on public.bookings
  for delete
  to anon
  using (true);

-- 7. Enable realtime for live updates in admin
alter publication supabase_realtime add table public.bookings;
