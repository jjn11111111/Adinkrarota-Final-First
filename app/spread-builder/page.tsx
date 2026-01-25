"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { SpreadBuilder, type CustomSpread } from "@/components/spread-builder";
import { CardReading } from "@/components/card-reading";

const STORAGE_KEY = "adinkrarota-custom-spreads";

export default function SpreadBuilderPage() {
  const [customSpreads, setCustomSpreads] = useState<CustomSpread[]>([]);
  const [activeSpread, setActiveSpread] = useState<CustomSpread | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load spreads from localStorage on mount
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

  // Save spreads to localStorage when they change
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

  const handleUseSpread = (spread: CustomSpread) => {
    setActiveSpread(spread);
  };

  const handleBackToBuilder = () => {
    setActiveSpread(null);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen cosmic-bg">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-muted-foreground font-serif">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cosmic-bg">
      <Navigation />
      <main className="pt-20 pb-12 px-6">
        {activeSpread ? (
          <CardReading
            customSpread={activeSpread}
            onBackToBuilder={handleBackToBuilder}
          />
        ) : (
          <SpreadBuilder
            existingSpreads={customSpreads}
            onSave={handleSaveSpread}
            onDeleteSpread={handleDeleteSpread}
            onUseSpread={handleUseSpread}
          />
        )}
      </main>
    </div>
  );
}
