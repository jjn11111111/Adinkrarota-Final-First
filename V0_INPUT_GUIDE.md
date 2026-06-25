# V0 Input Guide - What to Feed V0

## 🎯 Quick Start

When working with V0, copy and paste the relevant sections from this guide to maintain your architecture.

---

## 📋 Essential Context to Give V0 First

**Copy this into V0 chat first:**

```
I have a Next.js app with a unified SPA architecture. The main app component 
(app/page.tsx) handles all views (home, gallery, reading, guidebook, spread-builder) 
using client-side state. Route pages re-export the main app component.

The app uses:
- Supabase for auth (optional - app works without it)
- Stripe for monthly subscriptions ($2.22/month)
- Monthly membership model (not lifetime)
- SSR-safe localStorage operations
- AI SDK with explicit provider imports

Please maintain these patterns when making changes.
```

---

## 🔑 Critical Code Patterns to Preserve

### 1. Main App Component Pattern

**When V0 suggests changes to routing or main page:**

```typescript
// app/page.tsx - Main SPA component
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

type View = "home" | "gallery" | "reading" | "guidebook" | "spread-builder";

const PATH_TO_VIEW: Record<string, View> = {
  "/": "home",
  "/gallery": "gallery",
  "/reading": "reading",
  "/guidebook": "guidebook",
  "/spread-builder": "spread-builder",
};

export default function AdinkrarotaApp() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<View>("home");

  // URL synchronization
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const updateViewFromPath = () => {
      const path = window.location.pathname;
      const viewFromPath = PATH_TO_VIEW[path] || "home";
      setCurrentView(viewFromPath);
    };
    
    updateViewFromPath();
    window.addEventListener("popstate", updateViewFromPath);
    return () => window.removeEventListener("popstate", updateViewFromPath);
  }, []);

  // localStorage SSR safety
  useEffect(() => {
    if (typeof window === "undefined") return;
    // ... localStorage code
  }, []);

  const handleNavigate = (view: View) => {
    setCurrentView(view);
    const path = view === "home" ? "/" : `/${view}`;
    if (typeof window !== "undefined" && window.location.pathname !== path) {
      router.push(path, { scroll: false });
    }
  };

  // ... rest of component
}
```

---

### 2. Route Handler Pattern

**When V0 suggests creating/modifying route pages:**

```typescript
// app/[view]/page.tsx (spread-builder, guidebook, reading, gallery)
// Re-export the main app - it will handle routing based on URL
export { default } from "../page";
```

**Tell V0:**
```
Route pages should always re-export the main app component. 
Don't create separate implementations.
```

---

### 3. Supabase Client Pattern

**When V0 uses Supabase:**

```typescript
// lib/supabase/client.ts
export function createClient(): SupabaseClient | null {
  // Returns null if not configured (doesn't throw)
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  // ... create client
}

// Usage in components:
const supabase = createClient();
if (!supabase) {
  // Handle gracefully - show message or return early
  return;
}
// ... use supabase
```

**Tell V0:**
```
Always check if Supabase client is null before using it. 
The app should work without Supabase configured.
```

---

### 4. Stripe Subscription Pattern

**When V0 modifies payment/subscription code:**

```typescript
// app/actions/stripe.ts
export async function createCheckoutSession(productId: string) {
  if (!isStripeConfigured() || !stripe) {
    return { error: "Payment processing is not available." };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription", // NOT "payment"
    line_items: [{
      price_data: {
        currency: "usd",
        unit_amount: 222, // $2.22
        recurring: {
          interval: "month", // REQUIRED for subscriptions
        },
      },
      quantity: 1,
    }],
    subscription_data: {
      metadata: {
        userId: user.id,
        productId: product.id,
      },
    },
  });
}
```

**Tell V0:**
```
Use Stripe subscriptions (mode: "subscription"), not one-time payments.
Price is $2.22/month (222 cents). Always include recurring interval.
```

---

### 5. Pricing Configuration

**When V0 modifies product/pricing:**

```typescript
// lib/products.ts
export const PRODUCTS: Product[] = [
  {
    id: "monthly-membership", // NOT "lifetime-membership"
    name: "Monthly Membership",
    description: "Full access - renews monthly",
    priceInCents: 222, // $2.22 per month
    features: [
      "Daily readings (1 per day)",
      "All spreads including Celtic Cross",
      "AI Oracle interpretations",
      "Reading journal & history",
      "Custom spread creation",
      "Birth chart integration",
      "Cancel anytime", // Important!
    ],
  },
];
```

**Tell V0:**
```
Membership is $2.22/month, not lifetime. Product ID is "monthly-membership".
Always mention "Cancel anytime" in features.
```

---

### 6. Webhook Subscription Handling

**When V0 modifies webhooks:**

```typescript
// app/api/webhooks/stripe/route.ts
// Handle subscription events:
if (event.type === "checkout.session.completed") {
  const subscriptionId = session.subscription as string;
  // Store subscription ID (not payment intent)
  stripe_payment_id: subscriptionId,
}

// Handle renewals
if (event.type === "invoice.payment_succeeded") {
  // Subscription renewed - user stays member
}

// Handle cancellations
if (event.type === "customer.subscription.deleted") {
  // Downgrade user to guest
  account_type: "guest",
}
```

**Tell V0:**
```
Webhook handles subscriptions, not one-time payments. Store subscription ID.
Handle cancellation by downgrading to guest.
```

---

### 7. localStorage SSR Safety

**When V0 uses localStorage:**

```typescript
useEffect(() => {
  if (typeof window === "undefined") return;
  // ... localStorage code
}, []);
```

**Tell V0:**
```
Always check typeof window === "undefined" before accessing localStorage 
or window object to prevent SSR errors.
```

---

### 8. AI Provider Imports

**When V0 modifies AI routes:**

```typescript
// app/api/ai-reading/route.ts
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
// ... other providers

const model = anthropic("claude-sonnet-4-20250514");
// NOT: model: "anthropic/claude-sonnet-4-20250514"
```

**Tell V0:**
```
Import AI providers explicitly: import { anthropic } from '@ai-sdk/anthropic'
Use provider functions like anthropic('model-name'), not model strings.
```

---

## 📝 V0 Prompt Templates

### For Route Pages
```
Keep route pages (spread-builder, guidebook, reading, gallery) as simple 
re-exports: export { default } from '../page'
```

### For Main App
```
Maintain unified SPA architecture in app/page.tsx. All main views should be 
handled by state in this component, not separate route pages. Include URL 
synchronization with PATH_TO_VIEW mapping and popstate listener.
```

### For Supabase
```
Always check if Supabase client is null before using it. The app should work 
gracefully without Supabase configured. Use: const supabase = createClient(); 
if (!supabase) return;
```

### For Stripe
```
Use Stripe subscriptions (mode: "subscription") with recurring interval 
"month". Price is $2.22/month (222 cents). Product ID is "monthly-membership".
```

### For localStorage
```
Always check typeof window === "undefined" before accessing localStorage 
or window object.
```

### For AI Routes
```
Import AI providers explicitly: import { anthropic } from '@ai-sdk/anthropic'
Use provider functions, not model strings.
```

---

## 🎯 Complete V0 Session Starter

**Copy this entire block when starting a new V0 session:**

```
I have a Next.js app with these requirements:

ARCHITECTURE:
- Unified SPA: app/page.tsx handles all views (home, gallery, reading, guidebook, spread-builder)
- Route pages re-export main app: export { default } from '../page'
- URL sync: PATH_TO_VIEW mapping + popstate listener
- Navigation updates URL: router.push(path, { scroll: false })

AUTHENTICATION:
- Supabase is optional - app works without it
- Always check: const supabase = createClient(); if (!supabase) return;
- AuthProvider handles missing Supabase gracefully

PAYMENTS:
- Monthly subscription: $2.22/month (NOT lifetime)
- Product ID: "monthly-membership"
- Stripe mode: "subscription" (NOT "payment")
- Webhook handles: checkout.session.completed, invoice.payment_succeeded, customer.subscription.deleted

STORAGE:
- localStorage: Always check typeof window === "undefined" first
- SSR-safe: Wrap all browser API access

AI:
- Import providers: import { anthropic } from '@ai-sdk/anthropic'
- Use provider functions: anthropic('model-name')
- NOT model strings: "anthropic/model-name"

Please maintain these patterns in all changes.
```

---

## 📚 Reference Files

When V0 asks for code, reference these files:
1. **V0_TEST_AND_REVIEW.md** - Preservation rules and copy-paste block for V0 (use this first)
2. **V0_COPY_PASTE_CODE.md** - Complete code blocks
3. **V0_INTEGRATION_GUIDE.md** - Full integration guide
4. **.v0-preserve-patterns.md** - Pattern reference
5. **SUBSCRIPTION_MIGRATION_SUMMARY.md** - Subscription details
6. **TEST_AND_REVIEW.md** - Full test checklist and acceptance criteria

---

## ⚠️ Common V0 Mistakes to Prevent

1. **Don't let V0 create duplicate route implementations**
   - Route pages must re-export main app

2. **Don't let V0 use model strings for AI**
   - Must import providers explicitly

3. **Don't let V0 forget localStorage checks**
   - Always check typeof window

4. **Don't let V0 use one-time payments**
   - Must use subscriptions with recurring interval

5. **Don't let V0 forget Supabase null checks**
   - App must work without Supabase

---

## ✅ Quick Checklist Before V0 Session

- [ ] Read this guide
- [ ] Paste preservation block from V0_TEST_AND_REVIEW.md first
- [ ] Have V0_COPY_PASTE_CODE.md open for code snippets
- [ ] Know which patterns to preserve (see V0_TEST_AND_REVIEW.md)
- [ ] Ready to verify changes don't break patterns (TEST_AND_REVIEW.md)

---

**Last Updated:** After subscription migration
**Status:** ✅ Ready for V0 use
