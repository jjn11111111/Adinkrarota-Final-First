# For V0: Test & Review – Preservation Rules

**Use this when changing the app.** These patterns are verified; do not remove or contradict them.

---

## What to tell V0 first (copy into chat)

```
When editing this codebase, preserve the following. Do not remove or change these patterns.

ARCHITECTURE
- Main app: app/page.tsx is the single SPA; it owns views: home, gallery, reading, guidebook, spread-builder.
- Route pages (app/gallery/page.tsx, app/reading/page.tsx, app/guidebook/page.tsx, app/spread-builder/page.tsx) must only re-export: export { default } from "../page";
- URL sync: PATH_TO_VIEW mapping and popstate listener in app/page.tsx. handleNavigate must call router.push(path, { scroll: false }).

AUTH & DATA
- Supabase: createClient() returns null when env is missing (no throw). Every Supabase use must check for null first.
- Stripe: Monthly subscription only. mode: "subscription", recurring: { interval: "month" }, product id "monthly-membership", price 222 cents ($2.22/month). Webhook must handle checkout.session.completed, invoice.payment_succeeded, customer.subscription.deleted, invoice.payment_failed.

AI
- Use explicit provider imports: import { anthropic } from "@ai-sdk/anthropic"; and model: anthropic("claude-sonnet-4-20250514") (no raw model strings).

SSR
- Any localStorage or window use must be guarded: if (typeof window === "undefined") return; (or equivalent).

TYPES
- daily-wisdom API: card image from drawnCard.imageUrl (with fallback), not .image.
- Stripe webhook: for Invoice, use (invoice as any).subscription for subscription ID; use invoice.status === "paid" not .paid.
- access-control: check createClient() for null before calling supabase.auth or .from().
- navigation: UserProfile has email, not displayName; use profile?.email?.split("@")[0] for display.
- ai-reading-chat: getReadingContext expects guidebookEntries as array of { lightAspect, shadowAspect, fullDescription, inReadings } | null; map getGuidebookEntry() results to that shape (undefined → null).

After any change, ensure: route pages still re-export app/page, no new throws from missing Supabase/Stripe, and no raw AI model strings or unguarded localStorage/window.
```

---

## Preservation checklist (V0 must keep)

| Area | Rule | Files to touch carefully |
|------|------|---------------------------|
| Routing | Single SPA in app/page.tsx; route pages only re-export | app/page.tsx, app/*/page.tsx |
| URL | PATH_TO_VIEW + popstate + handleNavigate(router.push) | app/page.tsx |
| Supabase | Null-safe client; all calls guard `if (!supabase)` | lib/supabase/client.ts, auth-provider, access-control, auth pages |
| Stripe | Subscription only; 222 cents; subscription_data + metadata | app/actions/stripe.ts, lib/products.ts |
| Webhooks | Handle subscription lifecycle; store subscription ID in stripe_payment_id | app/api/webhooks/stripe/route.ts |
| AI | Provider imports + provider("model-id") | app/api/ai-reading/route.ts, app/api/daily-wisdom/route.ts |
| SSR | Guard localStorage and window | app/page.tsx, components using storage |
| Types | DrawnCard.imageUrl; Invoice via (invoice as any).subscription; UserProfile.email; guidebookEntries shape | daily-wisdom route, stripe webhook, access-control, navigation, ai-reading-chat |

---

## Acceptance criteria (do not break these)

- Navigation: /, /gallery, /reading, /guidebook, /spread-builder all render the main app and URL stays in sync.
- No runtime errors when Supabase or Stripe env vars are missing.
- Pricing and copy show $2.22/month (not lifetime).
- AI routes use `anthropic("...")` (or other providers), not string-only model IDs.
- No localStorage or window access without a window check.

---

## Reference docs

- Full test steps: `TEST_AND_REVIEW.md`
- Code snippets for V0: `V0_COPY_PASTE_CODE.md`
- General V0 rules: `V0_INPUT_GUIDE.md`, `.v0-preserve-patterns.md`
