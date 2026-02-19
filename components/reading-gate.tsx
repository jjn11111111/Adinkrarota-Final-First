"use client";

import React from "react"

import { motion } from "framer-motion";
import { Lock, Sparkles, User, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./safe-auth-provider";
import Link from "next/link";

interface ReadingGateProps {
  children: React.ReactNode;
  spreadType?: "single" | "three" | "celtic" | "custom";
  onReadingComplete?: () => void;
}

export function ReadingGate({ children, spreadType = "single" }: ReadingGateProps) {
  const { 
    isLoading, 
    isAuthenticated, 
    profile, 
    canPerformReading, 
    remainingReadings, 
    readingMessage 
  } = useAuth();

  // Check if spread type requires member access
  const requiresMember = spreadType === "celtic" || spreadType === "custom";
  const isGuest = profile?.accountType === "guest";
  const needsUpgrade = requiresMember && isGuest;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <motion.div
          className="w-16 h-16 rounded-full border-2 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-muted-foreground font-serif">Consulting the cosmos...</p>
      </div>
    );
  }

  // Not authenticated - show login prompt
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          
          <h2 className="text-3xl font-bold text-gold-gradient mb-4">
            Begin Your Journey
          </h2>
          
          <p className="text-muted-foreground font-serif mb-6 leading-relaxed">
            To receive guidance from the Adinkrarota, please register or sign in. 
            Your readings will be preserved for your reflection.
          </p>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-card/50 border border-border text-left">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold text-foreground">Guest Access</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">Free</span>
              </div>
              <p className="text-sm text-muted-foreground">
                7 readings per year - Perfect for occasional seekers
              </p>
            </div>

            <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 text-left">
              <div className="flex items-center gap-3 mb-2">
                <Crown className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Member Access</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">$9.99 lifetime</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Daily readings, all spreads, AI Oracle, reading journal
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link href="/auth/login" className="flex-1">
              <Button variant="outline" className="w-full gap-2 bg-transparent">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register" className="flex-1">
              <Button className="w-full gap-2">
                Register
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Authenticated but needs upgrade for this spread type
  if (needsUpgrade) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-primary" />
          </div>
          
          <h2 className="text-3xl font-bold text-gold-gradient mb-4">
            Member Feature
          </h2>
          
          <p className="text-muted-foreground font-serif mb-6 leading-relaxed">
            {spreadType === "celtic" 
              ? "The Celtic Cross spread is a deep exploration requiring Member access."
              : "Custom spreads are a Member feature for personalized guidance."}
          </p>

          <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 mb-6">
            <p className="text-sm text-foreground font-medium mb-2">
              Upgrade to Member for $9.99 (one-time)
            </p>
            <ul className="text-sm text-muted-foreground text-left space-y-1">
              <li>- Daily readings (vs. 7/year)</li>
              <li>- All spread types including Celtic Cross</li>
              <li>- Custom spread creation</li>
              <li>- AI Oracle wisdom</li>
              <li>- Reading journal and history</li>
            </ul>
          </div>

          <Link href="/membership/checkout">
            <Button className="gap-2">
              <Sparkles className="w-4 h-4" />
              Upgrade to Member
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Authenticated but no readings remaining
  if (!canPerformReading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-amber-500" />
          </div>
          
          <h2 className="text-3xl font-bold text-gold-gradient mb-4">
            Rest and Reflect
          </h2>
          
          <p className="text-muted-foreground font-serif mb-6 leading-relaxed">
            {readingMessage}
          </p>

          {isGuest && (
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 mb-6">
              <p className="text-sm text-foreground font-medium mb-2">
                Want more guidance?
              </p>
              <p className="text-sm text-muted-foreground">
                Upgrade to Member for daily readings at just $9.99 (one-time payment).
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/portal">
              <Button variant="outline" className="gap-2 bg-transparent">
                View Reading History
              </Button>
            </Link>
            {isGuest && (
              <Link href="/membership/checkout">
                <Button className="gap-2">
                  <Crown className="w-4 h-4" />
                  Upgrade to Member
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // All checks passed - show children with reading allowance indicator
  return (
    <div className="relative">
      {/* Reading allowance indicator */}
      <div className="absolute top-4 right-4 z-20">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-sm border border-border text-sm">
          <div className={`w-2 h-2 rounded-full ${canPerformReading ? "bg-green-500" : "bg-amber-500"}`} />
          <span className="text-muted-foreground font-serif">
            {typeof remainingReadings === "number" 
              ? `${remainingReadings} reading${remainingReadings !== 1 ? "s" : ""} available`
              : "Unlimited readings"}
          </span>
        </div>
      </div>
      
      {children}
    </div>
  );
}
