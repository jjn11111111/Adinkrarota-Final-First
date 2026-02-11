"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth-provider";
import { DailyWisdom } from "@/components/daily-wisdom";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Star,
  BookOpen,
  Crown,
  LogOut,
  ArrowRight,
  Calendar,
  Heart,
  Eye,
  Trash2,
  ChevronDown,
  ChevronUp,
  User,
  Shield,
} from "lucide-react";

interface ReadingRecord {
  id: string;
  spread_type: string;
  spread_name: string;
  cards: unknown;
  question: string | null;
  ai_interpretation: string | null;
  is_favorited: boolean;
  created_at: string;
}

export default function PortalPage() {
  const router = useRouter();
  const {
    user,
    profile,
    isLoading,
    isAuthenticated,
    canPerformReading,
    remainingReadings,
    readingMessage,
    signOut,
    refreshProfile,
  } = useAuth();

  const [readings, setReadings] = useState<ReadingRecord[]>([]);
  const [loadingReadings, setLoadingReadings] = useState(true);
  const [expandedReading, setExpandedReading] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Fetch reading history
  useEffect(() => {
    async function fetchReadings() {
      if (!user) return;
      const supabase = createClient();
      const { data, error } = await supabase
        .from("readings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error && data) {
        setReadings(data);
      }
      setLoadingReadings(false);
    }

    if (isAuthenticated) {
      fetchReadings();
    }
  }, [user, isAuthenticated]);

  const toggleFavorite = async (readingId: string, currentState: boolean) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("readings")
      .update({ is_favorited: !currentState })
      .eq("id", readingId);

    if (!error) {
      setReadings((prev) =>
        prev.map((r) =>
          r.id === readingId ? { ...r, is_favorited: !currentState } : r
        )
      );
    }
  };

  const deleteReading = async (readingId: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("readings")
      .delete()
      .eq("id", readingId);

    if (!error) {
      setReadings((prev) => prev.filter((r) => r.id !== readingId));
      await refreshProfile();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          className="w-16 h-16 rounded-full border-2 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (!isAuthenticated || !profile) return null;

  const isMember = profile.accountType === "member";

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/images/portal-logo.png"
              alt="Adinkrarota"
              width={40}
              height={40}
              className="opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <span className="text-lg font-semibold tracking-wider text-gold-gradient hidden sm:block">
              ADINKRAROTA
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                Home
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-card border border-border mb-6"
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                {isMember ? (
                  <Crown className="w-7 h-7 text-primary" />
                ) : (
                  <User className="w-7 h-7 text-muted-foreground" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {profile.birthName || profile.email.split("@")[0]}
                </h1>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      isMember
                        ? "bg-primary/20 text-primary"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {isMember ? (
                      <>
                        <Star className="w-3 h-3" />
                        Lifetime Member
                      </>
                    ) : (
                      <>
                        <Shield className="w-3 h-3" />
                        Guest
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Reading status */}
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    canPerformReading ? "bg-green-500" : "bg-amber-500"
                  }`}
                />
                <span className="text-sm font-medium text-foreground">
                  {remainingReadings} reading{remainingReadings !== 1 ? "s" : ""} available
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{readingMessage}</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
        >
          <Link href="/">
            <Button
              variant="outline"
              className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-transparent hover:bg-primary/5"
            >
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-xs">New Reading</span>
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-transparent hover:bg-primary/5"
            >
              <Eye className="w-5 h-5 text-primary" />
              <span className="text-xs">The Deck</span>
            </Button>
          </Link>
          <Link href="/guidebook">
            <Button
              variant="outline"
              className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-transparent hover:bg-primary/5"
            >
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="text-xs">Guidebook</span>
            </Button>
          </Link>
          {!isMember ? (
            <Link href="/membership/checkout">
              <Button className="w-full h-auto py-4 flex flex-col items-center gap-2">
                <Crown className="w-5 h-5" />
                <span className="text-xs">Upgrade</span>
              </Button>
            </Link>
          ) : (
            <Link href="/spread-builder">
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-transparent hover:bg-primary/5"
              >
                <Star className="w-5 h-5 text-primary" />
                <span className="text-xs">Spreads</span>
              </Button>
            </Link>
          )}
        </motion.div>

        {/* Daily Wisdom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <DailyWisdom />
        </motion.div>

        {/* Reading History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Reading History
            </h2>
            <span className="text-sm text-muted-foreground">
              {readings.length} reading{readings.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loadingReadings ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-xl bg-card border border-border animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : readings.length === 0 ? (
            <div className="p-8 rounded-2xl bg-card border border-dashed border-border text-center">
              <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No readings yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Begin your journey with your first card reading
              </p>
              <Link href="/">
                <Button className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Start a Reading
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {readings.map((reading) => (
                <motion.div
                  key={reading.id}
                  layout
                  className="p-4 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground text-sm">
                          {reading.spread_name}
                        </h3>
                        <span className="text-xs text-muted-foreground px-2 py-0.5 bg-secondary rounded-full">
                          {reading.spread_type}
                        </span>
                        {reading.is_favorited && (
                          <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(reading.created_at).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                      {reading.question && (
                        <p className="text-xs text-muted-foreground mt-1 italic truncate">
                          {reading.question}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleFavorite(reading.id, reading.is_favorited)}
                        title={reading.is_favorited ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            reading.is_favorited
                              ? "text-primary fill-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      </Button>
                      {reading.ai_interpretation && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            setExpandedReading(
                              expandedReading === reading.id ? null : reading.id
                            )
                          }
                          title="View AI interpretation"
                        >
                          {expandedReading === reading.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => deleteReading(reading.id)}
                        title="Delete reading"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Expanded AI interpretation */}
                  <AnimatePresence>
                    {expandedReading === reading.id && reading.ai_interpretation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-border overflow-hidden"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <span className="text-xs font-semibold text-foreground">
                            AI Interpretation
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap font-serif leading-relaxed">
                          {reading.ai_interpretation}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Upgrade Banner for Guests */}
        {!isMember && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-6 rounded-2xl bg-primary/10 border border-primary/20 text-center"
          >
            <Crown className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-bold text-foreground mb-2">
              Unlock More with Lifetime Membership
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Daily readings, Celtic Cross spread, AI Oracle, reading journal, custom spreads,
              and birth chart integration -- all for a one-time payment.
            </p>
            <Link href="/membership/checkout">
              <Button className="gap-2">
                <Star className="w-4 h-4" />
                Become a Member - $9.99
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground font-serif">
            ADINKRAROTA -- Where ancestral wisdom, geometry, and mathematical truth converge
          </p>
        </div>
      </div>
    </div>
  );
}
