-- Fix Supabase linter auth_rls_initplan (WARN): wrap auth.uid() in (select auth.uid())
-- so the value is not re-evaluated for each row. Safe to run on existing projects.
-- Run in Supabase SQL Editor or: psql ... -f scripts/002_rls_wrap_auth_uid_for_initplan.sql

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

drop policy if exists "readings_select_own" on public.readings;
drop policy if exists "readings_insert_own" on public.readings;
drop policy if exists "readings_update_own" on public.readings;
drop policy if exists "readings_delete_own" on public.readings;

drop policy if exists "custom_spreads_select_own" on public.custom_spreads;
drop policy if exists "custom_spreads_insert_own" on public.custom_spreads;
drop policy if exists "custom_spreads_update_own" on public.custom_spreads;
drop policy if exists "custom_spreads_delete_own" on public.custom_spreads;

create policy "profiles_select_own" on public.profiles
  for select using ((select auth.uid()) = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles
  for update using ((select auth.uid()) = id);

create policy "readings_select_own" on public.readings
  for select using ((select auth.uid()) = user_id);
create policy "readings_insert_own" on public.readings
  for insert with check ((select auth.uid()) = user_id);
create policy "readings_update_own" on public.readings
  for update using ((select auth.uid()) = user_id);
create policy "readings_delete_own" on public.readings
  for delete using ((select auth.uid()) = user_id);

create policy "custom_spreads_select_own" on public.custom_spreads
  for select using ((select auth.uid()) = user_id);
create policy "custom_spreads_insert_own" on public.custom_spreads
  for insert with check ((select auth.uid()) = user_id);
create policy "custom_spreads_update_own" on public.custom_spreads
  for update using ((select auth.uid()) = user_id);
create policy "custom_spreads_delete_own" on public.custom_spreads
  for delete using ((select auth.uid()) = user_id);
