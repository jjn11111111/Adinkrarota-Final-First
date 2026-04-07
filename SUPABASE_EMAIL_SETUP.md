# Supabase email (auth confirmations, password reset)

SMTP and templates are configured **in the Supabase Dashboard**, not in this repo. This file is the **rollout checklist** so Production / Preview stay aligned with the app.

## 0. Vercel environment variables

**Vercel → Project → Settings → Environment Variables** — set for **Production** and **Preview** as needed:

| Variable | Required |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes |
| `NEXT_PUBLIC_BASE_URL` | Recommended for stable redirects (optional on client; see `lib/site-config`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only: Stripe webhooks, membership sync (`getSupabaseAdmin`) |

Redeploy after any change.

## 1. Supabase → Authentication → Providers → Email

- **Enable Email provider** — ON  
- **Confirm email** — ON if you want confirmation emails  

## 2. Supabase → Authentication → URL configuration

- **Site URL** — canonical app URL (e.g. production domain).  
- **Redirect URLs** — must include:
  - `https://YOUR_DOMAIN/auth/callback`
  - `http://localhost:3000/auth/callback` (local)
  - `https://*.vercel.app/**` (previews), or each preview host explicitly  

Forgot password uses `/auth/callback?next=/auth/update-password` — wildcard preview URLs cover query strings.

## 3. Custom SMTP (Authentication → Emails)

Use this when built-in email is unreliable or you see **`535 Authentication credentials invalid`** in **Logs → Auth**.

### Option A — Gmail (`@gmail.com`)

1. Google account: enable **2-Step Verification**.  
2. Create an **[App password](https://myaccount.google.com/apppasswords)** (Mail / custom name “Supabase”).  
3. **Supabase → Authentication → Emails → Custom SMTP**:

| Field | Value |
|-------|--------|
| Host | `smtp.gmail.com` |
| Port | `587` |
| Username | Full Gmail address (e.g. `you@gmail.com`) |
| Password | **App password** (16 characters — not your normal Gmail password) |
| Sender email | **Same** as username |
| Sender name | e.g. `ADINKRAROTA` |

4. **Save**, then test **Forgot password** once and check **Logs → Auth**.

### Option B — Google Workspace (`@yourdomain.com`)

Same as A, but username + sender = your Workspace address (e.g. `hello@yourdomain.com`).  
SPF/MX for that domain should already include Google if mail is hosted on Workspace.

### Option C — Resend SMTP

Host `smtp.resend.com`, port `587`, user `resend`, password = **Resend API key**, sender = address on a **verified domain** in Resend.  
If your DNS is limited (e.g. some Wix setups), verify the domain in Resend or use Gmail until DNS allows Resend records.

## 4. Limits and deliverability

- Supabase may rate-limit auth email per address (429) — wait or lower limits under **Authentication → Emails** for testing.  
- Ask users to check **spam**.  

## 5. In-app “Resend confirmation”

- **Register success** and **Login** pages can **resend the signup confirmation email** via Supabase (`auth.resend()`); that is separate from any third-party mail API. They need the same Supabase URL/anon key on Vercel as above.
