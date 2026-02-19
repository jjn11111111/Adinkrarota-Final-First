"use client";

import { useState, useEffect } from "react";
import { SpreadBuilder, type CustomSpread } from "@/components/spread-builder";
import { CardReading } from "@/components/card-reading";
import { ReadingGate } from "@/components/reading-gate";
import { ParallaxStarfield, CosmicOrbs } from "@/components/parallax-layers";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "adinkrarota-custom-spreads";

export default function SpreadBuilderPage() {
  const [customSpreads, setCustomSpreads] = useState<CustomSpread[]>([]);
  const [activeSpread, setActiveSpread] = useState<CustomSpread | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCustomSpreads(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load custom spreads:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customSpreads));
    }
  }, [customSpreads, isLoaded]);

  const handleSaveSpread = (spread: CustomSpread) => {
    setCustomSpreads((prev) => {
      const existing = prev.findIndex((s) => s.id === spread.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = spread;
        return updated;
      }
      return [...prev, spread];
    });
  };

  const handleDeleteSpread = (id: string) => {
    setCustomSpreads((prev) => prev.filter((s) => s.id !== id));
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen cosmic-bg flex items-center justify-center">
        <div className="text-muted-foreground font-serif">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cosmic-bg">
      <ParallaxStarfield />
      <CosmicOrbs />

      <div className="relative z-10">
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/portal">
                <ArrowLeft className="w-4 h-4" />
                Portal
              </Link>
            </Button>
            <h1 className="text-lg font-bold text-gold-gradient">
              {activeSpread ? "Custom Reading" : "Spread Builder"}
            </h1>
            {activeSpread && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveSpread(null)}
                className="ml-auto"
              >
                Back to Builder
              </Button>
            )}
          </div>
        </div>

        <div className="pt-8 px-6">
          <ReadingGate spreadType="custom">
            {activeSpread ? (
              <CardReading
                customSpread={activeSpread}
                onBackToBuilder={() => setActiveSpread(null)}
              />
            ) : (
              <SpreadBuilder
                existingSpreads={customSpreads}
                onSave={handleSaveSpread}
                onDeleteSpread={handleDeleteSpread}
                onUseSpread={(spread) => setActiveSpread(spread)}
              />
            )}
          </ReadingGate>
        </div>
      </div>
    </div>
  );
}
