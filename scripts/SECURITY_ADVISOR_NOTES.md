# Supabase Security Advisor – How to Fix

**Do not paste this file into the SQL Editor.** This is documentation. Use **`002_security_advisor_fixes.sql`** in the SQL Editor.

---

## 1. Function Search Path Mutable (2 warnings)

**Fixed in code:** `001_create_users_and_readings.sql` and `002_security_advisor_fixes.sql` now set `search_path = public` on both functions.

**To fix your current Supabase project:**

1. In Supabase Dashboard: **SQL Editor** → New query.
2. Paste and run the contents of **`002_security_advisor_fixes.sql`**.
3. In **Security Advisor**, click **Refresh**. The two “Function Search Path Mutable” warnings should clear.

---

## 2. Leaked Password Protection Disabled (Auth)

This is an **Auth** setting, not SQL.

**To enable:**

1. In Supabase Dashboard go to **Authentication** → **Providers** → **Email** (or **Auth** → **Settings** / **Security**, depending on UI).
2. Find **“Leaked password protection”** (or “Breached password detection” / “Have I Been Pwned”).
3. Turn it **On**.

Supabase can then check passwords against a list of known leaked passwords and block weak/leaked ones.

---

## Summary

| Warning                         | Fix                                                                 |
|---------------------------------|---------------------------------------------------------------------|
| `check_reading_allowance` path  | Run `002_security_advisor_fixes.sql` in SQL Editor                  |
| `record_reading` path           | Same script                                                        |
| Leaked password protection     | Auth → Email (or Security) → enable leaked password protection     |
