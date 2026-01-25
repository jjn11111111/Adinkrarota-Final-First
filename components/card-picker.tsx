"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { allCards, type CardType, type DrawnCard, type CardPolarity } from "@/lib/card-data";

interface SpreadPosition {
  name: string;
  description: string;
}

interface CardPickerProps {
  positions: SpreadPosition[];
  onComplete: (cards: DrawnCard[]) => void;
  onCancel: () => void;
  isVisible: boolean;
}

export function CardPicker({ positions, onComplete, onCancel, isVisible }: CardPickerProps) {
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const [selectedCards, setSelectedCards] = useState<DrawnCard[]>([]);
  const [revealedCardIndex, setRevealedCardIndex] = useState<number | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  
  // Shuffle the deck once when the picker opens
  const [shuffledDeck, setShuffledDeck] = useState<Array<{ card: CardType; polarity: CardPolarity }>>([]);
  
  useEffect(() => {
    if (isVisible) {
      // Shuffle deck and assign random polarity to each card position
      const shuffled = [...allCards]
        .sort(() => Math.random() - 0.5)
        .map(card => ({
          card,
          polarity: (Math.random() < 0.5 ? "upright" : "reversed") as CardPolarity
        }));
      setShuffledDeck(shuffled);
      setSelectedCards([]);
      setCurrentPositionIndex(0);
      setRevealedCardIndex(null);
    }
  }, [isVisible]);

  const currentPosition = positions[currentPositionIndex];
  
  // Get indices of already selected cards
  const selectedIndices = useMemo(() => new Set(
    selectedCards.map((_, i) => {
      // Find the index in shuffledDeck for each selected card
      return shuffledDeck.findIndex(d => d.card.id === selectedCards[i]?.id);
    }).filter(i => i >= 0)
  ), [selectedCards, shuffledDeck]);

  const selectCard = (deckIndex: number) => {
    if (isRevealing || selectedIndices.has(deckIndex)) return;
    
    setIsRevealing(true);
    setRevealedCardIndex(deckIndex);
    
    const { card, polarity } = shuffledDeck[deckIndex];
    
    // Create DrawnCard with cosmic polarity
    const midpoint = Math.ceil(card.keywords.length / 2);
    const polarityKeywords = polarity === "upright" 
      ? card.keywords.slice(0, midpoint)
      : card.keywords.slice(midpoint);

    const drawnCard: DrawnCard = {
      ...card,
      polarity,
      polarityKeywords: polarityKeywords.length > 0 ? polarityKeywords : card.keywords,
    };

    // Delay to show the flip animation
    setTimeout(() => {
      const newSelectedCards = [...selectedCards, drawnCard];
      setSelectedCards(newSelectedCards);
      setRevealedCardIndex(null);
      setIsRevealing(false);

      // Move to next position or complete
      if (currentPositionIndex < positions.length - 1) {
        setCurrentPositionIndex(prev => prev + 1);
      } else {
        // All positions filled
        setTimeout(() => {
          onComplete(newSelectedCards);
        }, 500);
      }
    }, 1500);
  };

  const goBack = () => {
    if (currentPositionIndex > 0 && !isRevealing) {
      setSelectedCards(prev => prev.slice(0, -1));
      setCurrentPositionIndex(prev => prev - 1);
    }
  };

  const resetSelection = () => {
    if (!isRevealing) {
      // Reshuffle the deck
      const shuffled = [...allCards]
        .sort(() => Math.random() - 0.5)
        .map(card => ({
          card,
          polarity: (Math.random() < 0.5 ? "upright" : "reversed") as CardPolarity
        }));
      setShuffledDeck(shuffled);
      setSelectedCards([]);
      setCurrentPositionIndex(0);
      setRevealedCardIndex(null);
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/98 backdrop-blur-sm overflow-hidden"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gold-gradient">Trust Your Intuition</h2>
                <p className="text-sm text-muted-foreground font-serif">
                  Let the cosmic winds guide your selection
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetSelection}
                  disabled={isRevealing}
                  className="gap-2 bg-transparent"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reshuffle
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onCancel}
                  disabled={isRevealing}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Current Position Info */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Selecting for Position {currentPositionIndex + 1} of {positions.length}
                    </p>
                    <h3 className="text-lg font-semibold text-primary">{currentPosition.name}</h3>
                    <p className="text-sm text-muted-foreground font-serif">{currentPosition.description}</p>
                  </div>
                </div>
                {currentPositionIndex > 0 && !isRevealing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goBack}
                    className="bg-transparent"
                  >
                    Go Back
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Cards Progress */}
        {selectedCards.length > 0 && (
          <div className="flex-shrink-0 border-b border-border bg-card/30 px-4 py-3">
            <div className="max-w-7xl mx-auto">
              <p className="text-xs text-muted-foreground mb-2">Cards Drawn:</p>
              <div className="flex gap-2 flex-wrap">
                {selectedCards.map((card, index) => (
                  <div
                    key={card.id}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      card.polarity === "reversed"
                        ? "bg-purple-900/30 text-purple-900 border border-purple-700/50"
                        : "bg-primary/20 text-primary border border-primary/30"
                    }`}
                  >
                    {positions[index].name}: {card.name}
                    {card.polarity === "reversed" && " (Shadow)"}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Instruction */}
        <div className="flex-shrink-0 py-4 text-center">
          <p className="text-muted-foreground font-serif italic">
            Close your eyes, breathe deeply, and select the card that calls to you...
          </p>
        </div>

        {/* Face-down Card Grid */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-13 gap-2">
              {shuffledDeck.map((deckItem, index) => {
                const isSelected = selectedCards.some(sc => sc.id === deckItem.card.id);
                const isCurrentlyRevealing = revealedCardIndex === index;
                
                return (
                  <FaceDownCard
                    key={`${deckItem.card.id}-${index}`}
                    card={deckItem.card}
                    polarity={deckItem.polarity}
                    isSelected={isSelected}
                    isRevealing={isCurrentlyRevealing}
                    disabled={isRevealing || isSelected}
                    onClick={() => selectCard(index)}
                    index={index}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Face-down card component with flip animation
interface FaceDownCardProps {
  card: CardType;
  polarity: CardPolarity;
  isSelected: boolean;
  isRevealing: boolean;
  disabled: boolean;
  onClick: () => void;
  index: number;
}

function FaceDownCard({ card, polarity, isSelected, isRevealing, disabled, onClick, index }: FaceDownCardProps) {
  const isReversed = polarity === "reversed";
  
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isSelected ? 0.3 : 1, 
        scale: isSelected ? 0.9 : 1,
      }}
      transition={{ delay: index * 0.005, duration: 0.3 }}
      whileHover={!disabled ? { scale: 1.1, y: -5 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`relative aspect-[2/3] rounded-md overflow-hidden transition-all perspective-1000 ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      } ${isSelected ? "opacity-30" : ""}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={{ rotateY: isRevealing ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Card Back (face-down) */}
        <div
          className="absolute inset-0 w-full h-full rounded-md overflow-hidden border border-primary/30"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src="/images/guidebook/adinkra-symbols-grid.jpeg"
            alt="Card back"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* Subtle glow on hover */}
          {!disabled && (
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-primary/10 border-2 border-primary/50 rounded-md" />
          )}
        </div>

        {/* Card Front (revealed) */}
        <div
          className="absolute inset-0 w-full h-full rounded-md overflow-hidden border-2 border-primary bg-card"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          {card.imageUrl ? (
            <img
              src={card.imageUrl || "/placeholder.svg"}
              alt={card.name}
              className={`w-full h-full object-contain ${isReversed ? "rotate-180" : ""}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-card p-1">
              <span className="text-xs text-center font-medium text-foreground">
                {card.name}
              </span>
            </div>
          )}
          
          {/* Polarity indicator on revealed card */}
          <div className={`absolute bottom-0 left-0 right-0 py-1 text-center text-xs font-bold ${
            isReversed 
              ? "bg-purple-900/80 text-white" 
              : "bg-primary/80 text-white"
          }`}>
            {isReversed ? "Shadow" : "Light"}
          </div>
        </div>
      </motion.div>
      
      {/* Selection sparkle effect */}
      {isRevealing && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
          transition={{ duration: 1 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <Sparkles className="w-8 h-8 text-primary" />
        </motion.div>
      )}
    </motion.button>
  );
}
