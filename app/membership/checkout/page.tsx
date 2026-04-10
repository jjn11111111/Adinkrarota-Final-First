"use client";

import { useState, useEffect, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { createCheckoutSession } from "@/app/actions/stripe";
import { PRODUCTS } from "@/lib/products";
import { PAYMENT_UNAVAILABLE_MESSAGE } from "@/lib/auth-copy";
import { Sparkles, Shield, Star, Check } from "lucide-react";

// Only load Stripe if configured
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export default function MembershipCheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(() =>
    stripePromise ? null : PAYMENT_UNAVAILABLE_MESSAGE,
  );
  const product = PRODUCTS.find((p) => p.id === "monthly-membership");

  const fetchClientSecret = useCallback(async () => {
    const result = await createCheckoutSession("monthly-membership");
    if (result.error) {
      setError(result.error);
      return "";
    }
    return result.clientSecret || "";
  }, []);

  useEffect(() => {
    if (!stripePromise) {
      return;
    }

    let cancelled = false;

    function load() {
      setError(null);
      setClientSecret(null);
      fetchClientSecret()
        .then((secret) => {
          if (cancelled) return;
          if (secret) {
            setClientSecret(secret);
          }
        })
        .catch(() => {
          if (cancelled) return;
          setError("Could not start checkout. Please refresh and try again.");
        });
    }

    load();

    function onPageShow(e: PageTransitionEvent) {
      if (e.persisted) {
        load();
      }
    }

    window.addEventListener("pageshow", onPageShow);
    return () => {
      cancelled = true;
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [fetchClientSecret]);

  return (
    <div className="min-h-screen bg-background">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/images/adinkra-pattern.png')`,
            backgroundSize: "400px",
            backgroundRepeat: "repeat",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <Star className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gold-gradient mb-2">
            Complete Your Membership
          </h1>
          <p className="text-muted-foreground font-serif mb-4">
            Monthly subscription - cancel anytime
          </p>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Thank you for choosing to support Adinkrarota. Your membership helps us continue 
            developing this fusion of Tarot and Adinkra wisdom for seekers around the world.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  {product?.name}
                </h2>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-primary">$2.22</span>
                <span className="text-muted-foreground ml-2">per month</span>
              </div>

              <p className="text-muted-foreground mb-6 font-serif">
                {product?.description}
              </p>

              <div className="space-y-3">
                {(product?.features ?? []).map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security note */}
            <div className="p-4 rounded-xl bg-secondary/50 border border-border flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Secure Payment
                </p>
                <p className="text-xs text-muted-foreground">
                  Your payment is processed securely through Stripe. We never
                  store your card details.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stripe checkout */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl bg-card border border-border"
          >
            {error ? (
              <div className="text-center py-12">
                <p className="text-destructive mb-4">{error}</p>
                <p className="text-sm text-muted-foreground">
                  Please try again or contact support.
                </p>
              </div>
            ) : clientSecret && stripePromise ? (
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ clientSecret }}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="animate-pulse text-primary">
                  Preparing checkout...
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
