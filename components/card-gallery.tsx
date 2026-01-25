"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Grid3X3, LayoutList } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CardThumbnail } from "./card-thumbnail";
import { ImmersiveCardViewer } from "./immersive-card-viewer";
import { allCards, type CardType, type CardSuit, suitInfo } from "@/lib/card-data";

const suits: CardSuit[] = ["major", "wands", "cups", "swords", "pentacles"];

export function CardGallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSuits, setSelectedSuits] = useState<CardSuit[]>(suits);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      const matchesSuit = selectedSuits.includes(card.suit);
      const matchesSearch =
        searchQuery === "" ||
        card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.adinkraSymbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.keywords.some((k) =>
          k.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesSuit && matchesSearch;
    });
  }, [searchQuery, selectedSuits]);

  const toggleSuit = (suit: CardSuit) => {
    setSelectedSuits((prev) =>
      prev.includes(suit) ? prev.filter((s) => s !== suit) : [...prev, suit]
    );
  };

  const groupedCards = useMemo(() => {
    const groups: Record<CardSuit, CardType[]> = {
      major: [],
      wands: [],
      cups: [],
      swords: [],
      pentacles: [],
    };
    filteredCards.forEach((card) => {
      groups[card.suit].push(card);
    });
    return groups;
  }, [filteredCards]);

  return (
    <div className="w-full">
      {/* Search and Filter Bar */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md py-4 mb-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search cards, symbols, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border font-serif"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filter</span>
                  {selectedSuits.length < suits.length && (
                    <span className="text-xs bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
                      {selectedSuits.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {suits.map((suit) => (
                  <DropdownMenuCheckboxItem
                    key={suit}
                    checked={selectedSuits.includes(suit)}
                    onCheckedChange={() => toggleSuit(suit)}
                    className="font-serif"
                  >
                    <span
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: suitInfo[suit].color }}
                    />
                    {suitInfo[suit].name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Toggle */}
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="rounded-none"
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="sr-only">Grid view</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="rounded-none"
              >
                <LayoutList className="w-4 h-4" />
                <span className="sr-only">List view</span>
              </Button>
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground font-serif">
            {filteredCards.length} of {allCards.length} cards
          </p>
        </div>
      </div>

      {/* Cards Display */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {viewMode === "grid" ? (
          <div className="space-y-16">
            {suits.map((suit) => {
              const cards = groupedCards[suit];
              if (cards.length === 0) return null;

              return (
                <section key={suit}>
                  <div className="flex items-center gap-4 mb-8">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: suitInfo[suit].color }}
                    />
                    <h2 className="text-2xl font-semibold text-gold-gradient">
                      {suitInfo[suit].name}
                    </h2>
                    <span className="text-sm text-muted-foreground font-serif">
                      {suitInfo[suit].element} • {cards.length} cards
                    </span>
                  </div>
                  <p className="text-muted-foreground font-serif mb-6 max-w-2xl">
                    {suitInfo[suit].description}
                  </p>
                  <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.03,
                        },
                      },
                    }}
                  >
                    {cards.map((card) => (
                      <motion.div
                        key={card.id}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                      >
                        <CardThumbnail
                          card={card}
                          onClick={() => setSelectedCard(card)}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCards.map((card) => (
              <motion.button
                key={card.id}
                onClick={() => setSelectedCard(card)}
                className="w-full p-4 flex items-center gap-4 bg-card hover:bg-muted rounded-lg border border-border transition-colors text-left"
                whileHover={{ x: 4 }}
              >
                <div
                  className="w-12 h-16 rounded-md flex items-center justify-center text-xl font-bold"
                  style={{
                    backgroundColor: `${suitInfo[card.suit].color}20`,
                    color: suitInfo[card.suit].color,
                  }}
                >
                  {typeof card.number === "number" ? card.number : card.number.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {card.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-serif truncate">
                    {card.adinkraSymbol} • {card.adinkraMeaning}
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  {card.keywords.slice(0, 2).map((keyword) => (
                    <span
                      key={keyword}
                      className="px-2 py-1 text-xs rounded-full border border-border text-muted-foreground font-serif"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: suitInfo[card.suit].color }}
                />
              </motion.button>
            ))}
          </div>
        )}

        {filteredCards.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-serif">
              No cards found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* Immersive Card Viewer Modal */}
      <AnimatePresence>
        {selectedCard && (
          <ImmersiveCardViewer
            card={selectedCard}
            onClose={() => setSelectedCard(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
