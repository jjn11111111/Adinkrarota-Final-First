import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// Lazy-init admin client for webhook (bypasses RLS)
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (webhookSecret) {
      // Production: verify signature
      event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Development: parse without verification (NOT for production)
      console.warn("STRIPE_WEBHOOK_SECRET not set - skipping signature verification");
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Get user ID from metadata
    const userId = session.metadata?.userId;

    if (userId && session.payment_status === "paid") {
      try {
        // Update user profile to member using correct column names
        const { error } = await getSupabaseAdmin()
          .from("profiles")
          .update({
            account_type: "member",
            membership_purchased_at: new Date().toISOString(),
            stripe_customer_id: session.customer as string || null,
            stripe_payment_id: session.payment_intent as string || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        if (error) {
          console.error("Error updating profile:", error);
        } else {
          console.log(`User ${userId} upgraded to member`);
        }
      } catch (err) {
        console.error("Webhook handler error:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
