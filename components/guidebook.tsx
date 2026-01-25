"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Book, Sparkles, Flame, Droplets, Wind, Coins, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { allCards as cards, type CardType as Card } from "@/lib/card-data";
import { getGuidebookEntry, getSuitIntro } from "@/lib/guidebook-data";
import Image from "next/image";

type GuidebookView = "index" | "introduction" | "symbols" | "card-detail";

interface GuidebookProps {
  initialCardId?: string;
}

export function Guidebook({ initialCardId }: GuidebookProps) {
  const [view, setView] = useState<GuidebookView>(initialCardId ? "card-detail" : "index");
  const [selectedCard, setSelectedCard] = useState<Card | null>(
    initialCardId ? cards.find(c => c.id === initialCardId) || null : null
  );
  const [selectedSuit, setSelectedSuit] = useState<string | null>(null);

  const majorArcana = cards.filter(c => c.suit === "major");
  const wands = cards.filter(c => c.suit === "wands");
  const cups = cards.filter(c => c.suit === "cups");
  const swords = cards.filter(c => c.suit === "swords");
  const pentacles = cards.filter(c => c.suit === "pentacles");

  const suits = [
    { id: "major", name: "Major Arcana", cards: majorArcana, icon: Sparkles, color: "text-purple-700" },
    { id: "wands", name: "Wands", cards: wands, icon: Flame, color: "text-orange-600", element: "Fire" },
    { id: "cups", name: "Cups", cards: cups, icon: Droplets, color: "text-blue-700", element: "Water" },
    { id: "swords", name: "Swords", cards: swords, icon: Wind, color: "text-slate-700", element: "Air" },
    { id: "pentacles", name: "Pentacles", cards: pentacles, icon: Coins, color: "text-green-700", element: "Earth" },
  ];

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
    setView("card-detail");
  };

  const handleBack = () => {
    if (view === "card-detail" && selectedSuit) {
      setView("index");
      setSelectedCard(null);
    } else {
      setView("index");
      setSelectedCard(null);
      setSelectedSuit(null);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
      <AnimatePresence mode="wait">
        {view === "index" && (
          <motion.div
            key="index"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gold-gradient mb-4">
                The Guidebook
              </h1>
              <p className="text-muted-foreground font-serif max-w-2xl mx-auto">
                Explore the wisdom of Adinkrarota. Each card weaves together Tarot archetypes 
                with the philosophical depth of Akan Adinkra symbols.
              </p>
            </div>

            {/* Introduction Sections */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <motion.button
                whileHover={{ y: -4 }}
                onClick={() => setView("introduction")}
                className="p-6 rounded-xl mystical-border bg-card/50 backdrop-blur-sm text-left group"
              >
                <Book className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">Introduction</h3>
                <p className="text-muted-foreground font-serif text-sm">
                  Learn about the fusion of Tarot and Adinkra wisdom traditions.
                </p>
              </motion.button>

              <motion.button
                whileHover={{ y: -4 }}
                onClick={() => setView("symbols")}
                className="p-6 rounded-xl mystical-border bg-card/50 backdrop-blur-sm text-left group"
              >
                <Sparkles className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">Error-Correcting Wisdom</h3>
                <p className="text-muted-foreground font-serif text-sm">
                  Discover the astonishing connection between Adinkra symbols, supersymmetry physics, and the universe{"'"}s error-correcting codes.
                </p>
              </motion.button>
            </div>

            {/* Suits */}
            <h2 className="text-2xl font-bold text-center text-gold-gradient mb-8">
              Browse by Suit
            </h2>
            <div className="space-y-6">
              {suits.map((suit) => (
                <motion.div
                  key={suit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl mystical-border bg-card/30 backdrop-blur-sm overflow-hidden"
                >
                  <button
                    onClick={() => setSelectedSuit(selectedSuit === suit.id ? null : suit.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-primary/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <suit.icon className={`w-6 h-6 ${suit.color}`} />
                      <span className="text-lg font-semibold">{suit.name}</span>
                      {suit.element && (
                        <span className="text-xs text-muted-foreground font-serif">
                          ({suit.element})
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {suit.cards.length} cards
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {selectedSuit === suit.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-border"
                      >
                        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                          {suit.cards.map((card) => (
                            <button
                              key={card.id}
                              onClick={() => handleCardSelect(card)}
                              className="p-3 rounded-lg bg-background/50 hover:bg-primary/10 transition-colors text-left group"
                            >
                              <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                                {card.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {card.adinkraSymbol}
                              </p>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {view === "introduction" && (
          <motion.div
            key="introduction"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Guidebook
            </Button>

            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold text-gold-gradient mb-8 text-center">
                Introduction to Adinkrarota
              </h1>

              <div className="prose prose-invert max-w-none font-serif">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Adinkrarota represents a dual synthesis of traditional Tarot archetypes and 
                  Adinkra symbols—a visual tradition developed by the Akan people, particularly 
                  the Asante of Ghana and related groups in Cote d&apos;Ivoire.
                </p>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  This fusion creates a multi-layered exploration of spiritual, cultural, and 
                  psychological dimensions, where the integrated meanings of both systems enhance 
                  and enrich each other in uniquely powerful ways.
                </p>

                <h2 className="text-2xl font-bold text-primary mt-12 mb-4">The Dual Nature</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Each card in Adinkrarota carries two keywords representing the spectrum of 
                  meaning—the light and shadow aspects of human experience. Truth and Mirage. 
                  Passion and Obsession. Integrity and Insidiousness. These polarities remind us 
                  that wisdom lies in understanding the full range of each archetype.
                </p>

                <h2 className="text-2xl font-bold text-primary mt-12 mb-4">Error-Correcting Wisdom</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Like combining error-correcting codes in information theory, the pairing of 
                  Tarot with Adinkra creates redundancy that deepens understanding and reveals 
                  connections that neither system expresses alone. When both systems point to 
                  the same truth, confidence in the message increases.
                </p>

                <h2 className="text-2xl font-bold text-primary mt-12 mb-4">The Four Suits</h2>
                <div className="grid md:grid-cols-2 gap-4 my-8">
                  <div className="p-4 rounded-lg bg-orange-600/15 border border-orange-600/40">
                    <h3 className="font-bold text-orange-700 mb-2">Wands - Fire</h3>
                    <p className="text-sm text-muted-foreground">
                      Passion, creativity, ambition, and the vital force that drives action.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-600/15 border border-blue-600/40">
                    <h3 className="font-bold text-blue-700 mb-2">Cups - Water</h3>
                    <p className="text-sm text-muted-foreground">
                      Emotions, relationships, intuition, and the flowing nature of feelings.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-500/15 border border-slate-500/40">
                    <h3 className="font-bold text-slate-700 mb-2">Swords - Air</h3>
                    <p className="text-sm text-muted-foreground">
                      Intellect, truth, conflict, and the cutting edge of thought.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-600/15 border border-green-600/40">
                    <h3 className="font-bold text-green-700 mb-2">Pentacles - Earth</h3>
                    <p className="text-sm text-muted-foreground">
                      Material world, resources, body, and the grounded nature of manifestation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {view === "symbols" && (
          <motion.div
            key="symbols"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Guidebook
            </Button>

            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold text-gold-gradient mb-8 text-center">
                The Mathematics of Adinkra
              </h1>
              <p className="text-center text-primary font-serif mb-8 text-lg">
                Error-Correcting Codes, Supersymmetry, and Ancestral Wisdom
              </p>

              {/* Main guidebook image */}
              <div className="relative w-full aspect-video mb-8 rounded-xl overflow-hidden mystical-border">
                <Image
                  src="/images/guidebook/adinkra-symbols.png"
                  alt="Adinkra Symbols Introduction"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="prose prose-invert max-w-none font-serif">
                {/* The Discovery */}
                <div className="p-6 rounded-xl bg-primary/10 border border-primary/30 mb-8">
                  <h2 className="text-2xl font-bold text-primary mb-4">A Profound Discovery</h2>
                  <p className="text-foreground leading-relaxed mb-4">
                    In 2010, theoretical physicist <strong>Dr. Sylvester James Gates Jr.</strong> made an 
                    astonishing discovery while working on supersymmetry theory. Hidden within the 
                    mathematical equations describing the fundamental structure of reality, he found 
                    embedded <strong>error-correcting codes</strong>—specifically, doubly-even self-dual 
                    linear binary error-correcting block codes.
                  </p>
                  <p className="text-foreground leading-relaxed">
                    These are the same types of codes used in computer science to detect and correct 
                    errors in digital communication. The mathematical structures representing these 
                    equations are called <strong>{'"'}Adinkra{'"'}</strong> in physics because of their 
                    graphical resemblance to the traditional Akan symbols.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-primary mb-4">What This Means</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  This convergence suggests something extraordinary: the Akan people of West Africa, 
                  through their Adinkra tradition, may have been encoding mathematical truths about 
                  the structure of reality—truths that modern physics is only now beginning to recognize.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <h3 className="font-bold text-foreground mb-2">In Physics</h3>
                    <p className="text-sm text-muted-foreground">
                      Adinkra graphs represent supersymmetric algebras—the mathematical language 
                      describing how bosons and fermions transform into each other, fundamental 
                      to understanding particle physics and potentially a unified theory of everything.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <h3 className="font-bold text-foreground mb-2">In Computing</h3>
                    <p className="text-sm text-muted-foreground">
                      Error-correcting codes ensure data integrity across noisy channels. The same 
                      mathematical structures appear in the equations governing supersymmetry, 
                      suggesting the universe itself employs error-correction.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <h3 className="font-bold text-foreground mb-2">In Akan Wisdom</h3>
                    <p className="text-sm text-muted-foreground">
                      For centuries, Adinkra symbols have encoded philosophical and spiritual 
                      concepts—wisdom about life, death, transformation, and cosmic order. These 
                      are not mere decoration but compressed wisdom transmissions.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <h3 className="font-bold text-foreground mb-2">In Adinkrarota</h3>
                    <p className="text-sm text-muted-foreground">
                      By pairing Tarot archetypes with Adinkra symbols, we create a REDUNDANT 
                      WISDOM SYSTEM—like error-correcting codes, the combined message is more 
                      robust and clear than either system alone.
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-primary mb-4">The Triune Synthesis</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Adinkrarota represents a convergence of three streams of knowledge:
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">1.</span>
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Ancestral Wisdom</strong> — The Akan philosophical 
                      tradition encoded in visual symbols, carrying generations of insight about the human 
                      condition and cosmic order.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">2.</span>
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Geometry</strong> — The Tarot{"'"}s archetypal 
                      journey through the Major and Minor Arcana, mapping the soul{"'"}s evolution through 
                      universal patterns.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">3.</span>
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Mathematical Truth</strong> — The error-correcting 
                      nature of these symbol systems, providing redundancy and clarity that allows wisdom 
                      to transmit accurately across time, culture, and consciousness.
                    </span>
                  </li>
                </ul>

                {/* Symbols grid image */}
                <div className="relative w-full max-w-md mx-auto aspect-square my-8 rounded-xl overflow-hidden">
                  <Image
                    src="/images/guidebook/adinkra-symbols-grid.jpeg"
                    alt="Adinkra Symbols Grid"
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="p-6 rounded-xl bg-secondary/50 border border-border text-center">
                  <p className="text-foreground font-serif italic text-lg">
                    {'"'}This is not metaphor. This is mathematics, physics, and ancestral wisdom converging 
                    at the point where science and spirituality recognize they have always been describing 
                    the same underlying reality.{'"'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {view === "card-detail" && selectedCard && (
          <motion.div
            key="card-detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Guidebook
            </Button>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Card Image */}
                <div className="relative">
                  {selectedCard.imageUrl ? (
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden mystical-border bg-card">
                      <Image
                        src={selectedCard.imageUrl || "/placeholder.svg"}
                        alt={selectedCard.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[2/3] rounded-xl mystical-border bg-card/50 flex items-center justify-center">
                      <div className="text-center p-8">
                        <div className="text-6xl font-serif text-gold-gradient mb-4">
                          {typeof selectedCard.number === "number" 
                            ? selectedCard.number 
                            : selectedCard.number.charAt(0)}
                        </div>
                        <p className="text-muted-foreground font-serif">
                          {selectedCard.name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Details */}
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                      {selectedCard.suit === "major" ? "Major Arcana" : `${selectedCard.suit} Suit`}
                    </p>
                    <h1 className="text-3xl md:text-4xl font-bold text-gold-gradient">
                      {selectedCard.name}
                    </h1>
                  </div>

                  {/* Adinkra Symbol */}
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                    <h3 className="text-sm uppercase tracking-wider text-primary mb-2">
                      Adinkra Symbol
                    </h3>
                    <p className="text-xl font-semibold mb-1">{selectedCard.adinkraSymbol}</p>
                    <p className="text-muted-foreground font-serif text-sm">
                      {selectedCard.adinkraMeaning}
                    </p>
                  </div>

                  {/* Keywords */}
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
                      Dual Themes
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCard.keywords.map((keyword, i) => (
                        <span
                          key={keyword}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            i === 0 
                              ? "bg-primary/20 text-primary" 
                              : i === 1 
                                ? "bg-destructive/20 text-destructive" 
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Traditional Meaning */}
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                      Traditional Tarot Meaning
                    </h3>
                    <p className="text-muted-foreground font-serif leading-relaxed">
                      {selectedCard.tarotMeaning}
                    </p>
                  </div>

                  {/* Fused Interpretation */}
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                      Adinkrarota Interpretation
                    </h3>
                    <p className="text-foreground font-serif leading-relaxed text-lg">
                      {selectedCard.fusedInterpretation}
                    </p>
                  </div>

                  {/* Full Guidebook Description */}
                  {(() => {
                    const guidebookEntry = getGuidebookEntry(selectedCard.id);
                    if (guidebookEntry) {
                      return (
                        <div className="space-y-4 p-4 rounded-lg bg-card/30 border border-border/50">
                          <h3 className="text-sm uppercase tracking-wider text-primary mb-2 flex items-center gap-2">
                            <Book className="w-4 h-4" />
                            Full Guidebook Entry
                          </h3>
                          <p className="text-muted-foreground font-serif leading-relaxed text-sm whitespace-pre-line">
                            {guidebookEntry.fullDescription}
                          </p>
                          
                          {/* Light and Shadow Aspects */}
                          <div className="grid sm:grid-cols-2 gap-3 mt-4">
                            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                              <div className="flex items-center gap-2 mb-2">
                                <Sun className="w-4 h-4 text-primary" />
                                <span className="text-xs uppercase tracking-wide text-primary font-medium">Light Aspect</span>
                              </div>
                              <p className="text-sm text-foreground">{guidebookEntry.lightAspect}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                              <div className="flex items-center gap-2 mb-2">
                                <Moon className="w-4 h-4 text-destructive" />
                                <span className="text-xs uppercase tracking-wide text-destructive font-medium">Shadow Aspect</span>
                              </div>
                              <p className="text-sm text-foreground">{guidebookEntry.shadowAspect}</p>
                            </div>
                          </div>

                          {/* In Readings */}
                          <div className="mt-4 pt-3 border-t border-border/50">
                            <h4 className="text-xs uppercase tracking-wide text-muted-foreground mb-2">In Readings</h4>
                            <p className="text-sm text-foreground font-serif">{guidebookEntry.inReadings}</p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Element/Celestial */}
                  <div className="pt-4 border-t border-border">
                    {selectedCard.element && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Element:</span> {selectedCard.element}
                      </p>
                    )}
                    {selectedCard.celestialBody && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Celestial Body:</span> {selectedCard.celestialBody}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation between cards */}
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-center text-muted-foreground mb-4 font-serif">
                  Explore More Cards
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {cards
                    .filter(c => c.suit === selectedCard.suit && c.id !== selectedCard.id)
                    .slice(0, 8)
                    .map((card) => (
                      <button
                        key={card.id}
                        onClick={() => handleCardSelect(card)}
                        className="px-3 py-2 rounded-lg bg-card/50 hover:bg-primary/10 transition-colors text-sm"
                      >
                        {card.name}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
