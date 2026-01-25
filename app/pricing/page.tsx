"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles, Star, Shield, Crown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCTS, GUEST_YEARLY_READINGS, DATA_PLEDGE } from "@/lib/products";

export default function PricingPage() {
  const product = PRODUCTS.find((p) => p.id === "lifetime-membership");

  const guestFeatures = [
    `${GUEST_YEARLY_READINGS} readings per year`,
    "Single card draws",
    "3-card spreads",
    "Basic card meanings",
    "Access to the Guidebook",
  ];

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
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <Star className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gold-gradient mb-3">
            Membership
          </h1>
          <p className="text-muted-foreground font-serif text-lg max-w-2xl mx-auto">
            Unlock the full wisdom of the Adinkrarota deck with a one-time offering
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Guest Tier */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-card border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-muted-foreground" />
              <h2 className="text-xl font-semibold text-foreground">Guest</h2>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-foreground">Free</span>
            </div>

            <p className="text-muted-foreground mb-6 font-serif">
              Begin your journey with limited access to the deck
            </p>

            <div className="space-y-3 mb-8">
              {guestFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <Link href="/auth/register">
              <Button variant="outline" className="w-full">
                Register as Guest
              </Button>
            </Link>
          </motion.div>

          {/* Member Tier */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-card border-2 border-primary relative overflow-hidden"
          >
            {/* Recommended badge */}
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-xs font-medium rounded-bl-lg">
              Recommended
            </div>

            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                {product?.name}
              </h2>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-primary">$9.99</span>
              <span className="text-muted-foreground ml-2">one-time</span>
            </div>

            <p className="text-muted-foreground mb-6 font-serif">
              {product?.description}
            </p>

            <div className="space-y-3 mb-8">
              {product?.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <Link href="/membership/checkout">
              <Button className="w-full gap-2">
                <Sparkles className="w-4 h-4" />
                Become a Member
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Data Protection Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 rounded-2xl bg-secondary/30 border border-border"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">
              Your Data is Protected
            </h3>
          </div>
          
          <div className="prose prose-sm prose-invert max-w-none">
            <p className="text-muted-foreground font-serif whitespace-pre-line leading-relaxed">
              {DATA_PLEDGE}
            </p>
          </div>
        </motion.div>

        {/* FAQ or Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            Questions? Contact us at support@adinkrarota.com
          </p>
        </motion.div>
      </div>
    </div>
  );
}
