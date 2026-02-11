"use server";

import { stripe } from "@/lib/stripe";
import { PRODUCTS } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";
import { getBaseUrl } from "@/lib/site-config";

export async function createCheckoutSession(productId: string) {
  // Find product in our secure catalog
  const product = PRODUCTS.find((p) => p.id === productId);
  
  if (!product) {
    return { error: "Product not found" };
  }

  // Get the current user
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please sign in to continue" };
  }

  try {
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
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      allow_promotion_codes: true,
      return_url: `${getBaseUrl()}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        userId: user.id,
        productId: product.id,
        userEmail: user.email || "",
      },
    });

    return { clientSecret: session.client_secret };
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return { error: "Failed to create checkout session" };
  }
}

export async function getCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return { session };
  } catch (error) {
    console.error("Error retrieving session:", error);
    return { error: "Failed to retrieve session" };
  }
}
