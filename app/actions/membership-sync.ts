"use server";

import { stripe, isStripeConfigured } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type SyncMembershipResult =
  | { ok: true; status: "updated_member" | "unchanged" }
  | { ok: false; error: string };

/**
 * Fixes profiles that paid in Stripe but never got webhook updates (or env was wrong).
 * Safe: only promotes to member when Stripe shows an active/trialing subscription for this user.
 */
export async function syncMembershipFromStripe(): Promise<SyncMembershipResult> {
  if (!isStripeConfigured() || !stripe) {
    return { ok: false, error: "Payment system is not configured." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { ok: false, error: "Please sign in again." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) {
    return { ok: false, error: "Please sign in again." };
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return {
      ok: false,
      error: "Membership sync is temporarily unavailable.",
    };
  }

  const loadProfileRow = async () =>
    admin
      .from("profiles")
      .select("stripe_customer_id, stripe_payment_id, account_type")
      .eq("id", user.id)
      .single();

  let { data: row, error: rowError } = await loadProfileRow();

  if (rowError || !row) {
    // Recovery path: some projects miss the auth->profiles trigger or have stale rows.
    // Create a minimal profile so paid users can self-restore without support.
    const { error: insertError } = await admin.from("profiles").upsert(
      {
        id: user.id,
        email: user.email || "",
        account_type: "guest",
        year_started: new Date().getFullYear(),
        readings_this_year: 0,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (insertError) {
      return { ok: false, error: "Could not load your profile." };
    }

    const retry = await loadProfileRow();
    row = retry.data;
    rowError = retry.error;
    if (rowError || !row) {
      return { ok: false, error: "Could not load your profile." };
    }
  }

  const persistMember = async (opts: {
    subscriptionId: string;
    customerId: string | null;
  }) => {
    await admin
      .from("profiles")
      .update({
        account_type: "member",
        stripe_payment_id: opts.subscriptionId,
        ...(opts.customerId ? { stripe_customer_id: opts.customerId } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
  };

  const isActive = (status: string) =>
    status === "active" || status === "trialing";

  try {
    const subId =
      typeof row.stripe_payment_id === "string" &&
      row.stripe_payment_id.startsWith("sub_")
        ? row.stripe_payment_id
        : null;

    if (subId) {
      const sub = await stripe.subscriptions.retrieve(subId);
      if (isActive(sub.status)) {
        const cust =
          typeof sub.customer === "string"
            ? sub.customer
            : sub.customer?.id ?? null;
        await persistMember({ subscriptionId: sub.id, customerId: cust });
        return { ok: true, status: "updated_member" };
      }
    }

    const customerId =
      typeof row.stripe_customer_id === "string"
        ? row.stripe_customer_id
        : null;

    if (customerId) {
      const subs = await stripe.subscriptions.list({
        customer: customerId,
        limit: 10,
      });
      const hit = subs.data.find((s) => isActive(s.status));
      if (hit) {
        await persistMember({
          subscriptionId: hit.id,
          customerId,
        });
        return { ok: true, status: "updated_member" };
      }
    }

    if (user.email) {
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 5,
      });
      for (const c of customers.data) {
        const subs = await stripe.subscriptions.list({
          customer: c.id,
          limit: 10,
        });
        const hit = subs.data.find((s) => isActive(s.status));
        if (hit) {
          await persistMember({
            subscriptionId: hit.id,
            customerId: c.id,
          });
          return { ok: true, status: "updated_member" };
        }
      }
    }

    return { ok: true, status: "unchanged" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not verify subscription.";
    return { ok: false, error: msg };
  }
}
