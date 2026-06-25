-- Adinkrarota Economy Database Schema
-- This schema supports the guest/member access model with strict privacy protections

-- User profiles table (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  
  -- Account type: 'guest' (free, 7 readings/year) or 'member' (paid, daily readings)
  account_type text not null default 'guest' check (account_type in ('guest', 'member')),
  
  -- Member-only fields (encrypted/protected)
  birth_name text,
  birth_date date,
  birth_time time,
  birth_place text,
  birth_country text,
  gender text,
  
  -- Membership details
  membership_purchased_at timestamptz,
  stripe_customer_id text,
  stripe_payment_id text,
  
  -- Usage tracking
  readings_this_year integer default 0,
  last_reading_date date,
  year_started integer,
  
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- Privacy consent
  privacy_consent_at timestamptz,
  data_retention_consent boolean default false
);

-- Reading history table (for members)
create table if not exists public.readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  
  -- Reading details
  spread_type text not null,
  spread_name text not null,
  cards jsonb not null, -- Array of drawn cards with positions and polarities
  
  -- AI interpretation (if requested)
  ai_interpretation text,
  
  -- User notes/journal
  question text,
  user_notes text,
  
  -- Astrological context (if member with birth data)
  astrological_context jsonb,
  
  -- Timestamps
  created_at timestamptz default now(),
  
  -- Favorite/bookmark
  is_favorited boolean default false
);

-- Custom spreads table
create table if not exists public.custom_spreads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  
  name text not null,
  description text,
  positions jsonb not null, -- Array of position objects
  
  -- Creator attribution
  creator_name text,
  creator_contact text,
  creator_location text,
  
  -- Submission status for featuring
  submission_status text default 'draft' check (submission_status in ('draft', 'submitted', 'approved', 'rejected')),
  is_featured boolean default false,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Featured/approved spreads (public, no user association required)
create table if not exists public.featured_spreads (
  id uuid primary key default gen_random_uuid(),
  
  name text not null,
  description text,
  positions jsonb not null,
  
  -- Attribution
  creator_name text not null,
  creator_contact text,
  creator_location text,
  tradition text, -- e.g., "Golden Dawn", "Traditional", "Community Created"
  
  -- Metadata
  category text, -- e.g., "relationship", "career", "spiritual"
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  
  created_at timestamptz default now(),
  is_active boolean default true
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.readings enable row level security;
alter table public.custom_spreads enable row level security;
alter table public.featured_spreads enable row level security;

-- Profiles: Users can only see/edit their own profile
create policy "profiles_select_own" on public.profiles 
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles 
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles 
  for update using (auth.uid() = id);

-- Readings: Users can only see/manage their own readings
create policy "readings_select_own" on public.readings 
  for select using (auth.uid() = user_id);
create policy "readings_insert_own" on public.readings 
  for insert with check (auth.uid() = user_id);
create policy "readings_update_own" on public.readings 
  for update using (auth.uid() = user_id);
create policy "readings_delete_own" on public.readings 
  for delete using (auth.uid() = user_id);

-- Custom spreads: Users can only see/manage their own spreads
create policy "custom_spreads_select_own" on public.custom_spreads 
  for select using (auth.uid() = user_id);
create policy "custom_spreads_insert_own" on public.custom_spreads 
  for insert with check (auth.uid() = user_id);
create policy "custom_spreads_update_own" on public.custom_spreads 
  for update using (auth.uid() = user_id);
create policy "custom_spreads_delete_own" on public.custom_spreads 
  for delete using (auth.uid() = user_id);

-- Featured spreads: Everyone can read, only admins can modify (handled at app level)
create policy "featured_spreads_select_all" on public.featured_spreads 
  for select using (is_active = true);

-- Trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, 
    email, 
    account_type,
    year_started,
    readings_this_year
  )
  values (
    new.id,
    new.email,
    'guest',
    extract(year from now()),
    0
  )
  on conflict (id) do nothing;
  
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Function to check and reset yearly reading count
create or replace function public.check_reading_allowance(user_uuid uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  profile_record record;
  current_year integer;
  can_read boolean;
  readings_remaining integer;
begin
  current_year := extract(year from now());
  
  select * into profile_record from public.profiles where id = user_uuid;
  
  if not found then
    return jsonb_build_object('error', 'User not found');
  end if;
  
  -- Reset yearly count if new year
  if profile_record.year_started != current_year then
    update public.profiles 
    set year_started = current_year, readings_this_year = 0
    where id = user_uuid;
    profile_record.readings_this_year := 0;
  end if;
  
  -- Check allowance based on account type
  if profile_record.account_type = 'member' then
    -- Members: 1 reading per day
    can_read := profile_record.last_reading_date is null 
                or profile_record.last_reading_date < current_date;
    readings_remaining := case when can_read then 1 else 0 end;
  else
    -- Guests: 7 readings per year
    can_read := profile_record.readings_this_year < 7;
    readings_remaining := 7 - profile_record.readings_this_year;
  end if;
  
  return jsonb_build_object(
    'can_read', can_read,
    'readings_remaining', readings_remaining,
    'account_type', profile_record.account_type,
    'is_member', profile_record.account_type = 'member'
  );
end;
$$;

-- Function to record a reading
create or replace function public.record_reading(user_uuid uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  allowance jsonb;
begin
  -- Check allowance first
  allowance := public.check_reading_allowance(user_uuid);
  
  if not (allowance->>'can_read')::boolean then
    return jsonb_build_object('success', false, 'error', 'Reading allowance exceeded');
  end if;
  
  -- Update reading count
  update public.profiles
  set 
    readings_this_year = readings_this_year + 1,
    last_reading_date = current_date,
    updated_at = now()
  where id = user_uuid;
  
  return jsonb_build_object('success', true);
end;
$$;
