-- Superseded by scripts/003_rls_policies.sql
--
-- 003 applies:
-- - (select auth.uid()) for auth_rls_initplan efficiency
-- - explicit TO authenticated / TO anon, authenticated (clearer than default-all-roles)
-- - WITH CHECK on updates (prevents row “moving” to another user)
-- - featured_spreads_select_active + is_active null-safe
-- - profiles_enforce_nonprivileged_update trigger (Stripe / membership fields)
--
-- Run the full contents of 003_rls_policies.sql in the Supabase SQL Editor (or psql).

select 1; -- no-op so running this file in tools that require a statement does not error
