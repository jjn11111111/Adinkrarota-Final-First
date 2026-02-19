"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { getUserAccess, type UserAccess } from "@/lib/access-control";
import { Button } from "@/components/ui/button";
import { useMouseParallax } from "@/hooks/use-parallax";
import {
  Sparkles,
  BookOpen,
  Layout,
  History,
  LogOut,
  Star,
  Shield,
  Calendar,
  Clock,
  ArrowRight,
  User,
} from "lucide-react";
import { DailyWisdom } from "@/components/daily-wisdom";

export default function PortalPage() {
  const router = useRouter();
  const [access, setAccess] = useState<UserAccess | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAccess() {
      const userAccess = await getUserAccess();
      if (!userAccess.isAuthenticated) {
        router.push("/auth/login");
        return;
      }
      setAccess(userAccess);
      setLoading(false);
    }
    loadAccess();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading || !access) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading your portal...</div>
      </div>
    );
  }

  const isMember = access.accountType === "member";
  const mousePosition = useMouseParallax({ strength: 20, easing: 0.04 });

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Parallax background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Base pattern */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url('/images/adinkra-pattern.png')`,
            backgroundSize: "400px",
            backgroundRepeat: "repeat",
            transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`,
          }}
        />
        
        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * -0.2}px, ${mousePosition.y * -0.2}px)`,
          }}
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.08, 0.12, 0.08],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary/5 rounded-full blur-2xl"
          style={{
            transform: `translate(${mousePosition.x * 0.15}px, ${mousePosition.y * 0.15}px)`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold text-gold-gradient mb-2">
              Your Portal
            </h1>
            <div className="flex items-center gap-2">
              {isMember ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                  <Star className="w-4 h-4" />
                  Lifetime Member
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-muted-foreground text-sm">
                  <Shield className="w-4 h-4" />
                  Guest
                </span>
              )}
              <span className="text-sm text-muted-foreground">
                {access.profile?.email}
              </span>
            </div>
          </div>

          <Button variant="ghost" onClick={handleSignOut} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        {/* Reading Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="p-6 rounded-2xl bg-card border border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Reading Allowance
                </h2>
                <div className="flex items-center gap-4">
                  {isMember ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span className="text-muted-foreground">
                          {access.canDoReading
                            ? "1 reading available today"
                            : "Today's reading used"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Resets at midnight
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span className="text-muted-foreground">
                          {access.readingsRemaining} of 7 readings remaining this year
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Button
                asChild
                disabled={!access.canDoReading}
                className="gap-2"
              >
                <Link href="/reading">
                  <Sparkles className="w-4 h-4" />
                  {access.canDoReading ? "Begin Reading" : "No Readings Left"}
                </Link>
              </Button>
            </div>

            {/* Upgrade prompt for guests */}
            {!isMember && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Unlock daily readings and all premium features
                  </p>
                  <Button asChild variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Link href="/membership/checkout">
                      <Star className="w-4 h-4" />
                      Become a Member - $9.99
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Daily Wisdom - AI Feature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <DailyWisdom />
        </motion.div>

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              href="/reading"
              className="block p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group"
            >
              <Sparkles className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                New Reading
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Consult the Oracle for guidance
              </p>
              <span className="inline-flex items-center gap-1 text-primary text-sm group-hover:gap-2 transition-all">
                Begin <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/deck"
              className="block p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group"
            >
              <Layout className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Explore Deck
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Browse all 78 cards and their wisdom
              </p>
              <span className="inline-flex items-center gap-1 text-primary text-sm group-hover:gap-2 transition-all">
                Explore <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/guidebook"
              className="block p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group"
            >
              <BookOpen className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Guidebook
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Learn the mathematics of Adinkra
              </p>
              <span className="inline-flex items-center gap-1 text-primary text-sm group-hover:gap-2 transition-all">
                Study <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>

          {/* Member-only features */}
          {isMember && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href="/portal/history"
                  className="block p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group"
                >
                  <History className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Reading History
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Review and journal past readings
                  </p>
                  <span className="inline-flex items-center gap-1 text-primary text-sm group-hover:gap-2 transition-all">
                    View <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href="/spread-builder"
                  className="block p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group"
                >
                  <Layout className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Custom Spreads
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your own spread patterns
                  </p>
                  <span className="inline-flex items-center gap-1 text-primary text-sm group-hover:gap-2 transition-all">
                    Create <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  href="/portal/profile"
                  className="block p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group"
                >
                  <User className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Birth Chart
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    View your astrological profile
                  </p>
                  <span className="inline-flex items-center gap-1 text-primary text-sm group-hover:gap-2 transition-all">
                    View <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Data protection reminder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="p-4 rounded-xl bg-secondary/50 border border-border flex items-center gap-3"
        >
          <Shield className="w-5 h-5 text-primary flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Your data is protected. We never sell, trade, or share
            your information. <Link href="/privacy" className="text-primary hover:underline">Read our pledge</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
