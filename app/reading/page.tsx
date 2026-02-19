"use client";

import { CardReading } from "@/components/card-reading";
import { ReadingGate } from "@/components/reading-gate";
import { ParallaxStarfield, CosmicOrbs } from "@/components/parallax-layers";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReadingPage() {
  return (
    <div className="min-h-screen cosmic-bg">
      <ParallaxStarfield />
      <CosmicOrbs />

      <div className="relative z-10">
        {/* Back navigation */}
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/portal">
                <ArrowLeft className="w-4 h-4" />
                Portal
              </Link>
            </Button>
            <h1 className="text-lg font-bold text-gold-gradient">Card Reading</h1>
          </div>
        </div>

        <div className="pt-8">
          <ReadingGate spreadType="single">
            <CardReading />
          </ReadingGate>
        </div>
      </div>
    </div>
  );
}
