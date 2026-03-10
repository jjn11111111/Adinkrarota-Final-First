# Supabase Email / Confirmation Setup

If users don't receive the registration confirmation email, or resend says "unavailable", check these in order.

## 0. Vercel environment variables (most common cause)

In **Vercel → Project → Settings → Environment Variables**, ensure these are set for **Production** (and Preview if needed):

| Variable | Required |
|---------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes |

Without these, registration, login, and email resend will not work. Redeploy after adding/updating env vars.

## 1. Supabase Dashboard → Authentication → Providers → Email

- **Enable Email provider** – must be ON
- **Confirm email** – must be ON (otherwise no confirmation email is sent)

## 2. Supabase Dashboard → Authentication → URL Configuration

- **Site URL** – your app’s base URL (e.g. `https://yourdomain.com`)
- **Redirect URLs** – must include your callback URL:
  - `https://yourdomain.com/auth/callback`
  - For local dev: `http://localhost:3000/auth/callback`
  - For Vercel preview: `https://your-project-*.vercel.app/auth/callback`

## 3. Environment variable

Set `NEXT_PUBLIC_BASE_URL` so the app builds the correct redirect URL:

```env
# Production
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# Local dev (optional – app will use window.location.origin on client)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 4. Supabase default email limits

- **Free tier**: ~4 confirmation emails per hour per project
- Emails can land in **spam** – ask users to check spam/promotions

## 5. Custom SMTP (optional, better deliverability)

In Supabase Dashboard → **Project Settings → Auth → SMTP**:

- Enable custom SMTP
- Use a provider such as Resend, SendGrid, or AWS SES
- Improves deliverability and reduces spam issues

## 6. Resend confirmation from the app

- **Register success page**: "Resend confirmation email" (email prefilled if you came from registration)
- **Login page**: "Resend Confirmation Email" button (appears when "Email not confirmed" error shows)
