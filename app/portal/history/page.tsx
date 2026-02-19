"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Star,
  StarOff,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  Pencil,
  Check,
  X,
} from "lucide-react";

interface Reading {
  id: string;
  spread_type: string;
  spread_name: string;
  question: string | null;
  cards: unknown;
  ai_interpretation: string | null;
  user_notes: string | null;
  is_favorited: boolean;
  created_at: string;
}

export default function ReadingHistoryPage() {
  const router = useRouter();
  const supabase = createClient();
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [filter, setFilter] = useState<"all" | "favorited">("all");

  const fetchReadings = useCallback(async () => {
    if (!supabase) { router.push("/auth/login"); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    let query = supabase
      .from("readings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (filter === "favorited") {
      query = query.eq("is_favorited", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching readings:", error);
    } else {
      setReadings(data || []);
    }
    setLoading(false);
  }, [filter, router, supabase]);

  useEffect(() => {
    fetchReadings();
  }, [fetchReadings]);

  const toggleFavorite = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("readings")
      .update({ is_favorited: !current })
      .eq("id", id);

    if (!error) {
      setReadings((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_favorited: !current } : r))
      );
    }
  };

  const saveNote = async (id: string) => {
    const { error } = await supabase
      .from("readings")
      .update({ user_notes: noteText })
      .eq("id", id);

    if (!error) {
      setReadings((prev) =>
        prev.map((r) => (r.id === id ? { ...r, user_notes: noteText } : r))
      );
      setEditingNoteId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatCards = (cards: unknown): string[] => {
    if (!cards) return [];
    if (Array.isArray(cards)) {
      return cards.map((c: { name?: string; polarity?: string }) =>
        c.name ? `${c.name}${c.polarity === "reversed" ? " (Shadow)" : ""}` : String(c)
      );
    }
    return [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary font-serif">
          Loading your reading history...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/portal">
              <ArrowLeft className="w-4 h-4" />
              Portal
            </Link>
          </Button>
          <h1 className="text-lg font-bold text-gold-gradient">
            Reading History
          </h1>
          <div className="ml-auto flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className={filter !== "all" ? "bg-transparent" : ""}
            >
              <BookOpen className="w-4 h-4 mr-1" />
              All
            </Button>
            <Button
              variant={filter === "favorited" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("favorited")}
              className={filter !== "favorited" ? "bg-transparent" : ""}
            >
              <Star className="w-4 h-4 mr-1" />
              Favorites
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {readings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {filter === "favorited"
                ? "No favorites yet"
                : "No readings yet"}
            </h2>
            <p className="text-muted-foreground font-serif mb-6">
              {filter === "favorited"
                ? "Star readings you want to revisit."
                : "Begin your journey with a card reading."}
            </p>
            {filter === "all" && (
              <Button asChild>
                <Link href="/reading">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Begin a Reading
                </Link>
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-6">
              {readings.length} reading{readings.length !== 1 ? "s" : ""}{" "}
              {filter === "favorited" ? "favorited" : "total"}
            </p>

            <AnimatePresence>
              {readings.map((reading, index) => {
                const isExpanded = expandedId === reading.id;
                const cards = formatCards(reading.cards);

                return (
                  <motion.div
                    key={reading.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-xl border border-border bg-card overflow-hidden"
                  >
                    {/* Summary row */}
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : reading.id)
                      }
                      className="w-full p-4 flex items-center gap-4 text-left hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-foreground capitalize">
                            {reading.spread_name || reading.spread_type}
                          </span>
                          {reading.ai_interpretation && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              AI
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {formatDate(reading.created_at)}
                        </div>
                        {reading.question && (
                          <p className="text-sm text-muted-foreground mt-1 truncate font-serif italic">
                            {reading.question}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(reading.id, reading.is_favorited);
                        }}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                        aria-label={reading.is_favorited ? "Remove from favorites" : "Add to favorites"}
                      >
                        {reading.is_favorited ? (
                          <Star className="w-5 h-5 text-primary fill-primary" />
                        ) : (
                          <StarOff className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>

                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
                            {/* Cards drawn */}
                            {cards.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-foreground mb-2">
                                  Cards Drawn
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {cards.map((card, i) => (
                                    <span
                                      key={i}
                                      className="px-3 py-1.5 text-sm rounded-lg bg-secondary text-secondary-foreground"
                                    >
                                      {card}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* AI Interpretation */}
                            {reading.ai_interpretation && (
                              <div>
                                <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-primary" />
                                  AI Interpretation
                                </h4>
                                <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                                  <p className="text-sm text-foreground font-serif leading-relaxed whitespace-pre-line">
                                    {reading.ai_interpretation}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* User Notes */}
                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                <Pencil className="w-4 h-4 text-muted-foreground" />
                                Your Notes
                              </h4>
                              {editingNoteId === reading.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={noteText}
                                    onChange={(e) =>
                                      setNoteText(e.target.value)
                                    }
                                    placeholder="Write your reflections..."
                                    className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-sm font-serif min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-primary/50"
                                  />
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        saveNote(reading.id)
                                      }
                                      className="gap-1"
                                    >
                                      <Check className="w-3 h-3" />
                                      Save
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="bg-transparent gap-1"
                                      onClick={() =>
                                        setEditingNoteId(null)
                                      }
                                    >
                                      <X className="w-3 h-3" />
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditingNoteId(reading.id);
                                    setNoteText(
                                      reading.user_notes || ""
                                    );
                                  }}
                                  className="w-full text-left p-3 rounded-lg border border-dashed border-border hover:border-primary/30 transition-colors"
                                >
                                  {reading.user_notes ? (
                                    <p className="text-sm text-foreground font-serif whitespace-pre-line">
                                      {reading.user_notes}
                                    </p>
                                  ) : (
                                    <p className="text-sm text-muted-foreground italic">
                                      Click to add your reflections...
                                    </p>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
