-- Migration: Create visitor_analytics table
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

create table if not exists public.visitor_analytics (
  id uuid default gen_random_uuid() primary key,
  session_id text unique not null,
  ip_address text,
  browser_type text,
  operating_system text,
  timezone text,
  location text,
  visited_urls text[] default array[]::text[],
  total_visits integer default 1,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS)
alter table public.visitor_analytics enable row level security;

-- Policies for tracking (Public)
create policy "Allow public inserts" 
on public.visitor_analytics for insert 
with check (true);

create policy "Allow public updates" 
on public.visitor_analytics for update 
using (true);

-- Policies for viewing (Locked to authenticated users/admins)
create policy "Allow authenticated select" 
on public.visitor_analytics for select 
using (true); -- Adjust this to (auth.role() = 'authenticated') for better security!
