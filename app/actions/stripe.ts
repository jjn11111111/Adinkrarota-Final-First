"use server";

import { stripe, isStripeConfigured } from "@/lib/stripe";
import { PRODUCTS } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";
import { getBaseUrl } from "@/lib/site-config";
import { PAYMENT_UNAVAILABLE_MESSAGE } from "@/lib/auth-copy";

export async function createCheckoutSession(productId: string) {
  if (!isStripeConfigured() || !stripe) {
    return { error: PAYMENT_UNAVAILABLE_MESSAGE };
  }

  // Find product in our secure catalog
  const product = PRODUCTS.find((p) => p.id === productId);
  
  if (!product) {
    return { error: "Product not found" };
  }

  // Get the current user
  const supabase = await createClient();
  if (!supabase) {
    return { error: "Please sign in to continue" };
  }
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please sign in to continue" };
  }

  try {
    // Create Stripe Price for subscription (if it doesn't exist, create it)
    // For monthly subscription, we'll create a price object
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.priceInCents,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      return_url: `${getBaseUrl()}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        userId: user.id,
        productId: product.id,
        userEmail: user.email || "",
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          productId: product.id,
        },
      },
    });

    return { clientSecret: session.client_secret };
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return { error: "Failed to create checkout session" };
  }
}

export async function getCheckoutSession(sessionId: string) {
  if (!isStripeConfigured() || !stripe) {
    return { error: PAYMENT_UNAVAILABLE_MESSAGE };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { error: "Please sign in to continue" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please sign in to continue" };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Prevent one user from probing another user's checkout sessions
    const ownerId = session.metadata?.userId;
    if (!ownerId || ownerId !== user.id) {
      return { error: "Unauthorized" };
    }

    return { session };
  } catch (error) {
    console.error("Error retrieving session:", error);
    return { error: "Failed to retrieve session" };
  }
}
