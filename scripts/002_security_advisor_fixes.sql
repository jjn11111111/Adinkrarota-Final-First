-- Security Advisor fixes for supabase-adinkra-tarot
-- Run this in Supabase SQL Editor to clear "Function Search Path Mutable" warnings.

-- 1. check_reading_allowance: set search_path so the function is not mutable
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
  if profile_record.year_started != current_year then
    update public.profiles
    set year_started = current_year, readings_this_year = 0
    where id = user_uuid;
    profile_record.readings_this_year := 0;
  end if;
  if profile_record.account_type = 'member' then
    can_read := profile_record.last_reading_date is null
                or profile_record.last_reading_date < current_date;
    readings_remaining := case when can_read then 1 else 0 end;
  else
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

-- 2. record_reading: set search_path so the function is not mutable
create or replace function public.record_reading(user_uuid uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  allowance jsonb;
begin
  allowance := public.check_reading_allowance(user_uuid);
  if not (allowance->>'can_read')::boolean then
    return jsonb_build_object('success', false, 'error', 'Reading allowance exceeded');
  end if;
  update public.profiles
  set
    readings_this_year = readings_this_year + 1,
    last_reading_date = current_date,
    updated_at = now()
  where id = user_uuid;
  return jsonb_build_object('success', true);
end;
$$;
