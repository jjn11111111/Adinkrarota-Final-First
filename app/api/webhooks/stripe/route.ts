import { NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// Create admin client for webhook (bypasses RLS) - only if configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export async function POST(request: Request) {
  if (!isStripeConfigured() || !stripe || !supabaseAdmin) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
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

  // Handle subscription checkout completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId || session.subscription_data?.metadata?.userId;
    const subscriptionId = session.subscription as string;

    if (userId && session.payment_status === "paid") {
      try {
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            account_type: "member",
            membership_purchased_at: new Date().toISOString(),
            stripe_customer_id: session.customer as string || null,
            stripe_payment_id: subscriptionId || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        if (error) {
          console.error("Error updating profile:", error);
        } else {
          console.log(`User ${userId} upgraded to member via subscription ${subscriptionId}`);
        }
      } catch (err) {
        console.error("Webhook handler error:", err);
      }
    }
  }

  // Handle subscription renewal
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = invoice.customer as string;

    if (customerId) {
      try {
        // Ensure user stays as member on successful renewal
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            account_type: "member",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error("Error updating profile on renewal:", error);
        }
      } catch (err) {
        console.error("Renewal handler error:", err);
      }
    }
  }

  // Handle subscription cancellation
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    if (customerId) {
      try {
        // Downgrade user to guest on cancellation
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            account_type: "guest",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error("Error downgrading profile:", error);
        } else {
          console.log(`Customer ${customerId} downgraded to guest after subscription cancellation`);
        }
      } catch (err) {
        console.error("Cancellation handler error:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
