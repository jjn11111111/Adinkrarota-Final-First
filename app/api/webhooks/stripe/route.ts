import { NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// Create admin client for webhook (bypasses RLS) - only if configured
const supabaseAdmin = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

export async function POST(request: Request) {
  if (!isStripeConfigured() || !stripe) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

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
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Development: parse without verification (NOT for production)
      console.warn("STRIPE_WEBHOOK_SECRET not set - skipping signature verification");
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle subscription events
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Get user ID from metadata
    const userId = session.metadata?.userId;
    const subscriptionId = session.subscription as string;

    if (userId && session.payment_status === "paid" && subscriptionId) {
      try {
        // Update user profile to member
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            account_type: "member",
            membership_purchased_at: new Date().toISOString(),
            stripe_customer_id: session.customer as string || null,
            stripe_payment_id: subscriptionId, // Store subscription ID instead of payment intent
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        if (error) {
          console.error("Error updating profile:", error);
        } else {
          console.log(`User ${userId} subscribed to membership`);
        }
      } catch (err) {
        console.error("Webhook handler error:", err);
      }
    }
  }

  // Handle subscription renewal
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    // Invoice.subscription can be a string (ID) or Subscription object
    // Using type assertion as Stripe types may not expose this property directly
    const subscription = (invoice as any).subscription;
    const subscriptionId = typeof subscription === "string" 
      ? subscription 
      : subscription?.id || null;

    if (subscriptionId && invoice.status === "paid") {
      // Subscription renewed successfully - ensure user remains a member
      // The subscription is active, so user should already be a member
      // This is mainly for logging and ensuring status is correct
      console.log(`Subscription ${subscriptionId} renewed successfully`);
    }
  }

  // Handle subscription cancellation or failure
  if (event.type === "customer.subscription.deleted" || event.type === "invoice.payment_failed") {
    let subscriptionId: string | null = null;
    let customerId: string | null = null;

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      subscriptionId = subscription.id;
      customerId = typeof subscription.customer === "string" 
        ? subscription.customer 
        : subscription.customer?.id || null;
    } else {
      // invoice.payment_failed
      const invoice = event.data.object as Stripe.Invoice;
      const subscription = (invoice as any).subscription;
      subscriptionId = typeof subscription === "string" 
        ? subscription 
        : subscription?.id || null;
      const customer = (invoice as any).customer;
      customerId = typeof customer === "string"
        ? customer
        : customer?.id || null;
    }

    if (subscriptionId) {
      try {
        // Find user by subscription ID or customer ID
        let query = supabaseAdmin.from("profiles").select("id");
        
        if (customerId) {
          query = query.eq("stripe_customer_id", customerId);
        } else {
          query = query.eq("stripe_payment_id", subscriptionId);
        }

        const { data: profiles } = await query;

        if (profiles && profiles.length > 0) {
          // Downgrade to guest
          await supabaseAdmin
            .from("profiles")
            .update({
              account_type: "guest",
              updated_at: new Date().toISOString(),
            })
            .in("id", profiles.map(p => p.id));

          console.log(`Users downgraded to guest due to subscription ${subscriptionId} cancellation/failure`);
        }
      } catch (err) {
        console.error("Error handling subscription cancellation:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
