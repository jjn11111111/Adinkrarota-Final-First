"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, ChevronRight, Flame, Droplets, Wind, Mountain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { guidebookEntries, suitIntros, type CardGuidebookEntry, type SuitIntro } from "@/lib/guidebook-data";
import { majorArcana, wands, cups, swords, pentacles } from "@/lib/card-data";

type Section = "intro" | "major" | "wands" | "cups" | "swords" | "pentacles";

const suitIcons = {
  wands: Flame,
  cups: Droplets,
  swords: Wind,
  pentacles: Mountain,
  major: Sparkles,
};

const suitColors = {
  wands: "#c2410c",  // Darker orange for contrast
  cups: "#0369a1",   // Darker blue for contrast  
  swords: "#475569", // Dark slate for contrast on cyan
  pentacles: "#166534", // Darker green for contrast
  major: "#be185d",  // Darker magenta for contrast
};

export default function GuidebookPage() {
  const [activeSection, setActiveSection] = useState<Section>("intro");
  const [selectedCard, setSelectedCard] = useState<CardGuidebookEntry | null>(null);

  const sections: { id: Section; label: string; icon: typeof Book }[] = [
    { id: "intro", label: "Introduction", icon: Book },
    { id: "major", label: "Major Arcana", icon: Sparkles },
    { id: "wands", label: "Wands", icon: Flame },
    { id: "cups", label: "Cups", icon: Droplets },
    { id: "swords", label: "Swords", icon: Wind },
    { id: "pentacles", label: "Pentacles", icon: Mountain },
  ];

  const getCardsForSection = (section: Section) => {
    switch (section) {
      case "major": return majorArcana;
      case "wands": return wands;
      case "cups": return cups;
      case "swords": return swords;
      case "pentacles": return pentacles;
      default: return [];
    }
  };

  const getSuitIntro = (section: Section): SuitIntro | undefined => {
    if (section === "major" || section === "intro") return undefined;
    return suitIntros.find(s => s.suit === section);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Book className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">ADINKRAROTA Guidebook</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 shrink-0">
            <nav className="sticky top-24 space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <Button
                    key={section.id}
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start gap-3 ${
                      isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                    onClick={() => {
                      setActiveSection(section.id);
                      setSelectedCard(null);
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    {section.label}
                  </Button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {activeSection === "intro" ? (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="prose prose-lg max-w-none">
                    <h2 className="text-3xl font-bold text-foreground mb-6">Welcome to ADINKRAROTA</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      ADINKRAROTA is a fusion of traditional Tarot wisdom with the profound symbolism of 
                      Adinkra—the visual language of the Akan people of Ghana and Cote d&apos;Ivoire. Each card 
                      in this deck pairs classic Tarot archetypes with an Adinkra symbol that deepens and 
                      enriches its meaning.
                    </p>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      The Adinkra symbols carry centuries of wisdom, encoding concepts of philosophy, 
                      spirituality, and human experience into visual forms. When combined with Tarot&apos;s 
                      archetypal imagery, they create a powerful tool for self-reflection and guidance.
                    </p>
                  </div>

                  {/* Suit Introductions */}
                  <div className="grid md:grid-cols-2 gap-6 mt-12">
                    {suitIntros.map((suit) => {
                      const Icon = suitIcons[suit.suit as keyof typeof suitIcons];
                      const color = suitColors[suit.suit as keyof typeof suitColors];
                      return (
                        <motion.div
                          key={suit.suit}
                          className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/30 transition-colors cursor-pointer"
                          onClick={() => setActiveSection(suit.suit as Section)}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div 
                              className="w-12 h-12 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: `${color}20` }}
                            >
                              <Icon className="w-6 h-6" style={{ color }} />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold capitalize text-foreground">{suit.suit}</h3>
                              <p className="text-sm text-muted-foreground">{suit.element} • {suit.energy}</p>
                            </div>
                          </div>
                          <p className="text-muted-foreground text-sm">{suit.description}</p>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {suit.keywords.slice(0, 5).map((keyword) => (
                              <span 
                                key={keyword}
                                className="px-2 py-1 text-xs rounded-full border"
                                style={{ borderColor: `${color}50`, color }}
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : selectedCard ? (
                <motion.div
                  key={selectedCard.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedCard(null)}
                    className="mb-4"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180 mr-2" />
                    Back to {activeSection === "major" ? "Major Arcana" : activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                  </Button>

                  <div className="bg-card rounded-xl border border-border/50 p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Card Info Header */}
                      <div className="md:w-1/3">
                        <div 
                          className="aspect-[3/4] rounded-lg flex items-center justify-center mb-4"
                          style={{ 
                            backgroundColor: `${suitColors[activeSection as keyof typeof suitColors] || suitColors.major}15`,
                            border: `2px solid ${suitColors[activeSection as keyof typeof suitColors] || suitColors.major}30`
                          }}
                        >
                          <div className="text-center p-6">
                            <h3 className="text-2xl font-bold text-foreground mb-2">{selectedCard.name}</h3>
                            <div 
                              className="text-4xl font-serif mb-4"
                              style={{ color: suitColors[activeSection as keyof typeof suitColors] || suitColors.major }}
                            >
                              {selectedCard.adinkraSymbol.charAt(0)}
                            </div>
                            <p className="text-sm font-medium" style={{ color: suitColors[activeSection as keyof typeof suitColors] || suitColors.major }}>
                              {selectedCard.adinkraSymbol}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{selectedCard.adinkraMeaning}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                            <p className="text-xs uppercase tracking-wide text-accent mb-1">Light Aspect</p>
                            <p className="text-sm text-foreground">{selectedCard.lightAspect}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                            <p className="text-xs uppercase tracking-wide text-destructive mb-1">Shadow Aspect</p>
                            <p className="text-sm text-foreground">{selectedCard.shadowAspect}</p>
                          </div>
                        </div>
                      </div>

                      {/* Full Description */}
                      <div className="md:w-2/3">
                        <h2 className="text-3xl font-bold text-foreground mb-2">{selectedCard.name}</h2>
                        <p 
                          className="text-lg font-medium mb-6"
                          style={{ color: suitColors[activeSection as keyof typeof suitColors] || suitColors.major }}
                        >
                          {selectedCard.adinkraSymbol}
                        </p>
                        
                        <div className="prose prose-lg max-w-none">
                          <p className="text-foreground leading-relaxed whitespace-pre-line">
                            {selectedCard.fullDescription}
                          </p>
                        </div>

                        <div className="mt-8 p-4 rounded-lg border border-primary/20 bg-primary/5">
                          <h4 className="font-semibold text-foreground mb-2">In Readings</h4>
                          <p className="text-muted-foreground">{selectedCard.inReadings}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {/* Suit Intro */}
                  {getSuitIntro(activeSection) && (
                    <div className="p-6 rounded-xl border border-border/50 bg-card">
                      <div className="flex items-center gap-4 mb-4">
                        {(() => {
                          const Icon = suitIcons[activeSection as keyof typeof suitIcons];
                          const color = suitColors[activeSection as keyof typeof suitColors];
                          return (
                            <>
                              <div 
                                className="w-16 h-16 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: `${color}20` }}
                              >
                                <Icon className="w-8 h-8" style={{ color }} />
                              </div>
                              <div>
                                <h2 className="text-3xl font-bold capitalize text-foreground">{activeSection}</h2>
                                <p className="text-muted-foreground">
                                  {getSuitIntro(activeSection)?.element} Element • {getSuitIntro(activeSection)?.energy} Energy
                                </p>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                      <p className="text-muted-foreground">{getSuitIntro(activeSection)?.description}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {getSuitIntro(activeSection)?.keywords.map((keyword) => (
                          <span 
                            key={keyword}
                            className="px-3 py-1 text-sm rounded-full border border-border text-muted-foreground"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-4">
                        {getSuitIntro(activeSection)?.zodiacSigns.map((sign) => (
                          <span key={sign.sign} className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">{sign.sign}</span> — {sign.modality}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Major Arcana Header */}
                  {activeSection === "major" && (
                    <div className="p-6 rounded-xl border border-border/50 bg-card">
                      <div className="flex items-center gap-4 mb-4">
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${suitColors.major}20` }}
                        >
                          <Sparkles className="w-8 h-8" style={{ color: suitColors.major }} />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-foreground">Major Arcana</h2>
                          <p className="text-muted-foreground">The Fool&apos;s Journey Through Life&apos;s Great Mysteries</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        The 22 Major Arcana cards represent life&apos;s karmic and spiritual lessons. They represent a path to 
                        spiritual self-awareness and depict the various stages we encounter as we search for greater meaning 
                        and understanding. In ADINKRAROTA, each Major Arcana card is paired with an Adinkra symbol that 
                        deepens its archetypal meaning.
                      </p>
                    </div>
                  )}

                  {/* Card Grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getCardsForSection(activeSection).map((card) => {
                      const entry = guidebookEntries.find(e => e.id === card.id);
                      const color = suitColors[activeSection as keyof typeof suitColors] || suitColors.major;
                      
                      return (
                        <motion.button
                          key={card.id}
                          className="p-4 rounded-xl border border-border/50 bg-card hover:border-primary/30 transition-all text-left"
                          onClick={() => entry && setSelectedCard(entry)}
                          whileHover={{ scale: 1.02 }}
                          disabled={!entry}
                        >
                          <div className="flex items-start gap-3">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg font-serif"
                              style={{ backgroundColor: `${color}20`, color }}
                            >
                              {card.adinkraSymbol.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-semibold text-foreground truncate">{card.name}</h3>
                              <p className="text-xs text-muted-foreground truncate">{card.adinkraSymbol}</p>
                              <div className="flex gap-1 mt-2">
                                {card.keywords.slice(0, 2).map((kw) => (
                                  <span 
                                    key={kw}
                                    className="px-2 py-0.5 text-xs rounded-full"
                                    style={{ backgroundColor: `${color}15`, color }}
                                  >
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
