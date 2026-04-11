-- Canonical RLS setup for Adinkrarota (run in Supabase SQL Editor on existing projects).
-- Idempotent: safe to re-run after 001/002.
--
-- Goals:
-- 1. User-owned tables: only the authenticated session can touch their rows; (select auth.uid()) for initplan efficiency.
-- 2. featured_spreads: public read of active rows for anon + authenticated; no client writes (use service role / dashboard).
-- 3. Prevent self-service updates to membership / Stripe columns (service_role and security-definer triggers still work).

-- --- Drop prior policies (names must match 001 / 002) ---
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

drop policy if exists "featured_spreads_select_all" on public.featured_spreads;

-- --- Block privilege escalation on profiles (Stripe / membership) ---
create or replace function public.profiles_enforce_nonprivileged_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Service role (webhooks, admin client) may change billing fields.
  if coalesce(auth.jwt() ->> 'role', '') = 'service_role' then
    return new;
  end if;
  -- SQL Editor / maintenance sessions (no JWT) run as database superuser roles.
  if session_user in ('postgres', 'supabase_admin') then
    return new;
  end if;

  new.account_type := old.account_type;
  new.membership_purchased_at := old.membership_purchased_at;
  new.stripe_customer_id := old.stripe_customer_id;
  new.stripe_payment_id := old.stripe_payment_id;
  return new;
end;
$$;

drop trigger if exists profiles_enforce_nonprivileged_update on public.profiles;
create trigger profiles_enforce_nonprivileged_update
  before update on public.profiles
  for each row
  execute function public.profiles_enforce_nonprivileged_update();

alter table public.profiles enable row level security;
alter table public.readings enable row level security;
alter table public.custom_spreads enable row level security;
alter table public.featured_spreads enable row level security;

-- --- profiles: signed-in users only ---
create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

create policy "profiles_insert_own" on public.profiles
  for insert to authenticated
  with check ((select auth.uid()) = id);

create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- --- readings ---
create policy "readings_select_own" on public.readings
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "readings_insert_own" on public.readings
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "readings_update_own" on public.readings
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "readings_delete_own" on public.readings
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- --- custom_spreads ---
create policy "custom_spreads_select_own" on public.custom_spreads
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "custom_spreads_insert_own" on public.custom_spreads
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "custom_spreads_update_own" on public.custom_spreads
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "custom_spreads_delete_own" on public.custom_spreads
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- --- featured_spreads: catalog visible to everyone; no insert/update/delete for anon/authenticated ---
create policy "featured_spreads_select_active" on public.featured_spreads
  for select to anon, authenticated
  using (coalesce(is_active, true) = true);
