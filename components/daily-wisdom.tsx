"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface DailyWisdomData {
  card: {
    id: string;
    name: string;
    image: string;
    polarity: "upright" | "reversed";
    adinkraSymbol: string;
    polarityKeywords: string[];
  };
  wisdom: string;
  generatedAt: string;
}

const STORAGE_KEY = "adinkrarota_daily_wisdom";

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function DailyWisdom() {
  const [wisdom, setWisdom] = useState<DailyWisdomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for cached wisdom on mount
  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as DailyWisdomData;
        const generatedDate = new Date(parsed.generatedAt);
        const now = new Date();
        
        // If cached wisdom is from today, use it
        if (isSameDay(generatedDate, now)) {
          setWisdom(parsed);
          setLoading(false);
          return;
        }
      } catch {
        // Invalid cache, will fetch fresh
      }
    }
    
    // No valid cache, fetch fresh wisdom
    fetchWisdom();
  }, []);

  const fetchWisdom = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/daily-wisdom", {
        method: "POST",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch wisdom");
      }
      
      const data = await response.json();
      setWisdom(data);
      
      // Cache the wisdom
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 rounded-2xl bg-card border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Sun className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Daily Wisdom</h3>
            <p className="text-sm text-muted-foreground">Loading your message...</p>
          </div>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
              <Sun className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Daily Wisdom</h3>
              <p className="text-sm text-muted-foreground">Could not load wisdom</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchWisdom}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!wisdom) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 overflow-hidden relative"
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Sun className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Daily Wisdom</h3>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("en-US", { 
                  weekday: "long", 
                  month: "long", 
                  day: "numeric" 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Card and Wisdom */}
        <div className="flex gap-4">
          {/* Mini card */}
          <div className="flex-shrink-0">
            <div 
              className={`w-16 h-24 rounded-lg overflow-hidden border border-border shadow-lg ${
                wisdom.card.polarity === "reversed" ? "rotate-180" : ""
              }`}
            >
              <Image
                src={wisdom.card.image}
                alt={wisdom.card.name}
                width={64}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Wisdom text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-primary">
                {wisdom.card.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {wisdom.card.polarity === "reversed" ? "(Shadow)" : "(Light)"}
              </span>
            </div>
            
            <p className="text-sm text-foreground leading-relaxed font-serif italic">
              {wisdom.wisdom}
            </p>

            {/* Keywords */}
            <div className="flex flex-wrap gap-1 mt-3">
              {wisdom.card.polarityKeywords.slice(0, 3).map((keyword) => (
                <span
                  key={keyword}
                  className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
