"use client";

import { CardGallery } from "@/components/card-gallery";
import { ParallaxStarfield, CosmicOrbs } from "@/components/parallax-layers";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeckPage() {
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
            <h1 className="text-lg font-bold text-gold-gradient">The Deck</h1>
          </div>
        </div>

        <div className="pt-8">
          <div className="text-center mb-8 px-6">
            <h2 className="text-4xl font-bold text-gold-gradient mb-4">
              Explore the Adinkrarota
            </h2>
            <p className="text-muted-foreground font-serif max-w-2xl mx-auto">
              Browse all 78 cards. Click any card to examine it in immersive detail.
            </p>
          </div>
          <CardGallery />
        </div>
      </div>
    </div>
  );
}
