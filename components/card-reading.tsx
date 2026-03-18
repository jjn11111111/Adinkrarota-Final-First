"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, Eye, RotateCcw, Sparkles, HelpCircle, ArrowLeft, MessageCircle, Hand, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardThumbnail } from "./card-thumbnail";
import { ImmersiveCardViewer } from "./immersive-card-viewer";
import { AIReadingChat } from "./ai-reading-chat";
import { CardPicker } from "./card-picker";
import { ReadingGate } from "./reading-gate";
import { drawCardsWithPolarity, type DrawnCard, suitInfo } from "@/lib/card-data";
import { getAISettings } from "@/lib/ai-settings";
import type { CustomSpread } from "./spread-builder";

type SpreadType = "single" | "three" | "celtic" | "custom";

interface SpreadPosition {
  name: string;
  description: string;
}

interface SpreadConfig {
  name: string;
  positions: SpreadPosition[];
  description?: string;
  creator?: { name: string; tradition?: string };
}

const spreadConfigs: Record<Exclude<SpreadType, "custom">, SpreadConfig> = {
  single: {
    name: "Single Card",
    description: "A focused moment of guidance",
    positions: [
      { name: "The Message", description: "Your guidance for this moment" },
    ],
    creator: { name: "Traditional", tradition: "Universal Tarot Practice" },
  },
  three: {
    name: "Three Card Spread",
    description: "Past, Present, and Future - the eternal timeline",
    positions: [
      { name: "Past", description: "Influences from your past" },
      { name: "Present", description: "Your current situation" },
      { name: "Future", description: "Potential outcomes" },
    ],
    creator: { name: "Traditional", tradition: "Universal Tarot Practice" },
  },
  celtic: {
    name: "Celtic Cross",
    description: "The comprehensive 10-card spread for deep exploration",
    positions: [
      { name: "Present", description: "The current situation" },
      { name: "Challenge", description: "The immediate challenge" },
      { name: "Past", description: "Recent past influences" },
      { name: "Future", description: "Near future" },
      { name: "Above", description: "Your goal or best outcome" },
      { name: "Below", description: "Subconscious influences" },
      { name: "Advice", description: "Recommended approach" },
      { name: "External", description: "External influences" },
      { name: "Hopes/Fears", description: "Your hopes and fears" },
      { name: "Outcome", description: "Final outcome" },
    ],
    creator: { name: "A.E. Waite", tradition: "Golden Dawn / Rider-Waite Tradition" },
  },
};

// Download spread configuration as JSON
const downloadSpreadConfig = (config: SpreadConfig, type: string) => {
  const exportData = {
    format: "adinkrarota-spread-v1",
    type,
    name: config.name,
    description: config.description,
    positions: config.positions,
    creator: config.creator,
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${config.name.replace(/\s+/g, "-").toLowerCase()}-spread.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

interface CardReadingProps {
  customSpread?: CustomSpread | null;
  onBackToBuilder?: () => void;
}

export function CardReading({ customSpread, onBackToBuilder }: CardReadingProps) {
  const [spreadType, setSpreadType] = useState<SpreadType>(customSpread ? "custom" : "three");
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [selectedCard, setSelectedCard] = useState<DrawnCard | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showCardPicker, setShowCardPicker] = useState(false);
  const [hasAIConfigured, setHasAIConfigured] = useState(false);
  const [autoInterpret, setAutoInterpret] = useState(false);
  const [aiDismissedForSpread, setAIDismissedForSpread] = useState(false);

  // Check if AI is configured on mount
  useEffect(() => {
    const settings = getAISettings();
    setHasAIConfigured(settings?.enabled ?? false);
  }, []);

  // Auto-open AI chat when all cards are revealed
  useEffect(() => {
    const allRevealed = drawnCards.length > 0 && revealedIndices.size === drawnCards.length;
    if (allRevealed && hasAIConfigured && !showAIChat && !aiDismissedForSpread) {
      const timer = setTimeout(() => {
        setAutoInterpret(true);
        setShowAIChat(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [drawnCards.length, revealedIndices.size, hasAIConfigured, showAIChat, aiDismissedForSpread]);

  // Get spread config - use custom spread if provided, otherwise use built-in
  const spread = customSpread && spreadType === "custom"
    ? {
        name: customSpread.name,
        positions: customSpread.positions.map((p) => ({
          name: p.name,
          description: p.description,
        })),
      }
    : spreadConfigs[spreadType as Exclude<SpreadType, "custom">];

  const drawCards = useCallback(() => {
    setIsDrawing(true);
    setRevealedIndices(new Set());
    setAIDismissedForSpread(false);
    
    setTimeout(() => {
      const cards = drawCardsWithPolarity(spread.positions.length);
      setDrawnCards(cards);
      setIsDrawing(false);
    }, 800);
  }, [spread.positions.length]);

  const revealCard = (index: number) => {
    setRevealedIndices((prev) => new Set([...prev, index]));
  };

  const revealAll = () => {
    setRevealedIndices(new Set(drawnCards.map((_, i) => i)));
  };

  const reset = () => {
    setDrawnCards([]);
    setRevealedIndices(new Set());
    setShowAIChat(false);
    setAutoInterpret(false);
    setAIDismissedForSpread(false);
  };

  const handleManualSelection = (cards: DrawnCard[]) => {
    setDrawnCards(cards);
    setRevealedIndices(new Set(cards.map((_, i) => i)));
    setShowCardPicker(false);
    setAIDismissedForSpread(false);
  };

  // Determine if this spread type requires membership
  const requiresMembership = spreadType === "celtic" || spreadType === "custom";

  return (
    <ReadingGate spreadType={requiresMembership ? "celtic" : "single"}>
      <div className="w-full max-w-6xl mx-auto px-6 py-12">
        {/* Back button for custom spreads */}
        {customSpread && onBackToBuilder && (
          <Button
            variant="ghost"
            onClick={onBackToBuilder}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Spread Builder
          </Button>
        )}

        {/* Spread Type Selection */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gold-gradient mb-4">
            {customSpread ? customSpread.name : "Divine Reading"}
          </h2>
          <p className="text-muted-foreground font-serif mb-8 max-w-xl mx-auto">
            {customSpread
              ? customSpread.description || `A custom ${customSpread.positions.length}-card spread`
              : "Choose your spread and draw cards to receive cosmic guidance through the fusion of Tarot and Adinkra wisdom."}
          </p>

          {/* Only show spread selection if not using custom spread */}
          {!customSpread && (
            <div className="space-y-4 mb-8">
              <div className="flex flex-wrap justify-center gap-2">
                {(Object.entries(spreadConfigs) as [Exclude<SpreadType, "custom">, SpreadConfig][]).map(
                  ([type, config]) => (
                    <Button
                      key={type}
                      variant={spreadType === type ? "default" : "outline"}
                      onClick={() => {
                        setSpreadType(type);
                        reset();
                        setAIDismissedForSpread(false);
                      }}
                      className={spreadType === type ? "font-serif" : "font-serif bg-transparent"}
                    >
                      {config.name}
                      <span className="ml-2 text-xs opacity-70">
                        ({config.positions.length})
                      </span>
                    </Button>
                  )
                )}
              </div>
              {/* Current spread info and download */}
              {spreadType !== "custom" && spreadConfigs[spreadType] && (
                <div className="flex flex-col items-center gap-2 text-center">
                  <p className="text-sm text-muted-foreground font-serif italic">
                    {spreadConfigs[spreadType].description}
                  </p>
                  {spreadConfigs[spreadType].creator && (
                    <p className="text-xs text-muted-foreground">
                      {"Origin: "}{spreadConfigs[spreadType].creator?.tradition}
                      {spreadConfigs[spreadType].creator?.name !== "Traditional" && (
                        <span>{" — "}{spreadConfigs[spreadType].creator?.name}</span>
                      )}
                    </p>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadSpreadConfig(spreadConfigs[spreadType], spreadType)}
                    className="gap-1 text-xs"
                  >
                    <Download className="w-3 h-3" />
                    Download Spread
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={drawCards}
              disabled={isDrawing}
              size="lg"
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Shuffle className={`w-5 h-5 ${isDrawing ? "animate-spin" : ""}`} />
              {drawnCards.length > 0 ? "Draw Again" : "Cosmic Draw"}
            </Button>
            
            <Button
              onClick={() => setShowCardPicker(true)}
              disabled={isDrawing}
              size="lg"
              variant="outline"
              className="gap-2 bg-transparent"
            >
              <Hand className="w-5 h-5" />
              {drawnCards.length > 0 ? "Choose Again" : "Choose Cards"}
            </Button>

            {drawnCards.length > 0 && (
              <>
                <Button
                  variant="outline"
                  onClick={revealAll}
                  disabled={revealedIndices.size === drawnCards.length}
                  className="gap-2 bg-transparent"
                >
                  <Eye className="w-4 h-4" />
                  Reveal All
                </Button>
                <Button variant="outline" onClick={reset} className="gap-2 bg-transparent">
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
                <Button
                  variant={hasAIConfigured ? "default" : "outline"}
                  onClick={() => setShowAIChat(true)}
                  className={hasAIConfigured ? "gap-2" : "gap-2 bg-transparent"}
                  title="Open AI Collaborator to get interpretations of this spread"
                >
                  <MessageCircle className="w-4 h-4" />
                  AI Insight
                </Button>
              </>
            )}
          </div>
          {drawnCards.length > 0 && hasAIConfigured && !showAIChat && (
            <p className="text-xs text-muted-foreground mt-2 text-center sm:text-left">
              Tap <strong className="text-foreground">AI Insight</strong> above to chat with AI about this spread — this is the only place to get interpretations.
            </p>
          )}
        </div>

        {/* Drawing Animation */}
        <AnimatePresence>
          {isDrawing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-20"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 mx-auto mb-4"
                >
                  <Sparkles className="w-full h-full text-primary" />
                </motion.div>
                <p className="text-muted-foreground font-serif animate-pulse">
                  The cosmos aligns...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spread Layout */}
        {drawnCards.length > 0 && !isDrawing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Celtic Cross has special layout, others use grid */}
            {spreadType === "celtic" && !customSpread ? (
              <CelticCrossLayout
                cards={drawnCards}
                positions={spread.positions}
                revealedIndices={revealedIndices}
                onReveal={revealCard}
                onSelect={setSelectedCard}
              />
            ) : (
              <div
                className={`grid gap-6 ${
                  spread.positions.length === 1
                    ? "grid-cols-1 max-w-xs mx-auto"
                    : spread.positions.length <= 3
                    ? "grid-cols-1 md:grid-cols-3"
                    : spread.positions.length <= 6
                    ? "grid-cols-2 md:grid-cols-3"
                    : spread.positions.length <= 8
                    ? "grid-cols-2 md:grid-cols-4"
                    : "grid-cols-2 md:grid-cols-5"
                }`}
              >
                {drawnCards.map((card, index) => (
                  <SpreadCard
                    key={`${card.id}-${index}`}
                    card={card}
                    position={spread.positions[index]}
                    isRevealed={revealedIndices.has(index)}
                    onReveal={() => revealCard(index)}
                    onSelect={() => setSelectedCard(card)}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {drawnCards.length === 0 && !isDrawing && (
          <div className="text-center py-20 border border-dashed border-border rounded-xl">
            <HelpCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground font-serif">
              Select a spread type and draw your cards
            </p>
          </div>
        )}

        {/* Card Viewer Modal */}
        <AnimatePresence>
          {selectedCard && (
            <ImmersiveCardViewer
              card={selectedCard}
              onClose={() => setSelectedCard(null)}
            />
          )}
        </AnimatePresence>

        {/* AI Reading Chat */}
        <AIReadingChat
          cards={drawnCards}
          positions={spread.positions}
          spreadName={spread.name}
          isVisible={showAIChat}
          onClose={() => {
            setShowAIChat(false);
            setAutoInterpret(false);
            setAIDismissedForSpread(true);
          }}
          autoInterpret={autoInterpret}
        />

        {/* Card Picker Modal */}
        <AnimatePresence>
          {showCardPicker && (
            <CardPicker
              positions={spread.positions}
              onComplete={handleManualSelection}
              onCancel={() => setShowCardPicker(false)}
              isVisible={showCardPicker}
            />
          )}
        </AnimatePresence>
      </div>
    </ReadingGate>
  );
}

// Individual spread card component
interface SpreadCardProps {
  card: DrawnCard;
  position: SpreadPosition;
  isRevealed: boolean;
  onReveal: () => void;
  onSelect: () => void;
  delay?: number;
}

function SpreadCard({
  card,
  position,
  isRevealed,
  onReveal,
  onSelect,
  delay = 0,
}: SpreadCardProps) {
  const suitData = suitInfo[card.suit];
  const isReversed = card.polarity === "reversed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateY: 180 }}
      animate={{ opacity: 1, y: 0, rotateY: isRevealed ? 0 : 180 }}
      transition={{ delay, duration: 0.6, type: "spring" }}
      className="flex flex-col items-center"
    >
      {/* Position label */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-primary">{position.name}</h3>
        <p className="text-sm text-muted-foreground font-serif">
          {position.description}
        </p>
      </div>

      {/* Card */}
      <div className="perspective-1000 w-full max-w-[200px]">
        <motion.div
          className="relative preserve-3d cursor-pointer"
          animate={{ rotateY: isRevealed ? 0 : 180 }}
          transition={{ duration: 0.6, type: "spring" }}
          onClick={() => (isRevealed ? onSelect() : onReveal())}
        >
          {/* Card Front - rotated 180deg if reversed */}
          <motion.div
            className="w-full aspect-[2/3] rounded-lg overflow-hidden backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
            animate={{ rotate: isRevealed && isReversed ? 180 : 0 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
          >
            <CardThumbnail card={card} onClick={onSelect} />
          </motion.div>

          {/* Card Back */}
          <div
            className="absolute inset-0 w-full aspect-[2/3] rounded-lg overflow-hidden backface-hidden mystical-border bg-card"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <img
              src="/images/guidebook/adinkra-symbols-grid.jpeg"
              alt="Card back"
              className="absolute inset-0 w-full h-full object-contain"
            />
            <div className="absolute inset-1 border border-primary/30 rounded-md" />
            <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-white font-serif drop-shadow-lg">
              Click to reveal
            </p>
          </div>
        </motion.div>
      </div>

      {/* Revealed interpretation with polarity */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 text-center max-w-xs"
          >
            {/* Polarity badge */}
            <div className="flex justify-center mb-2">
              <span 
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  isReversed 
                    ? "bg-purple-900/30 text-purple-300 border border-purple-700/50" 
                    : "bg-primary/20 text-primary border border-primary/30"
                }`}
              >
                {isReversed ? "Shadow Aspect" : "Light Aspect"}
              </span>
            </div>
            <p className="text-sm font-serif text-foreground/80">
              <span style={{ color: suitData.color }}>{card.adinkraSymbol}</span>
              {" — "}
              {card.polarityKeywords.join(", ")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Celtic Cross special layout
interface CelticCrossLayoutProps {
  cards: DrawnCard[];
  positions: SpreadPosition[];
  revealedIndices: Set<number>;
  onReveal: (index: number) => void;
  onSelect: (card: DrawnCard) => void;
}

function CelticCrossLayout({
  cards,
  positions,
  revealedIndices,
  onReveal,
  onSelect,
}: CelticCrossLayoutProps) {
  // Celtic Cross positions:
  // 0: Present (center)
  // 1: Challenge (crossing)
  // 2: Past (left)
  // 3: Future (right)
  // 4: Above (top)
  // 5: Below (bottom)
  // 6-9: Staff (right column, bottom to top)

  const gridPositions = [
    { index: 4, gridArea: "1 / 2 / 2 / 3" }, // Above
    { index: 2, gridArea: "2 / 1 / 3 / 2" }, // Past
    { index: 0, gridArea: "2 / 2 / 3 / 3", isCenter: true }, // Present
    { index: 1, gridArea: "2 / 2 / 3 / 3", isCrossing: true }, // Challenge (crossing)
    { index: 3, gridArea: "2 / 3 / 3 / 4" }, // Future
    { index: 5, gridArea: "3 / 2 / 4 / 3" }, // Below
  ];

  const staffPositions = [9, 8, 7, 6]; // Bottom to top

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
      {/* Main Cross */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(3, minmax(120px, 150px))",
          gridTemplateRows: "repeat(3, auto)",
        }}
      >
        {gridPositions.map(({ index, gridArea, isCenter, isCrossing }) => (
          <div
            key={index}
            style={{ gridArea }}
            className={`${isCrossing ? "absolute inset-0 rotate-90 scale-75 opacity-80" : ""} ${
              isCenter ? "relative" : ""
            }`}
          >
            <SpreadCard
              card={cards[index]}
              position={positions[index]}
              isRevealed={revealedIndices.has(index)}
              onReveal={() => onReveal(index)}
              onSelect={() => onSelect(cards[index])}
              delay={index * 0.1}
            />
          </div>
        ))}
      </div>

      {/* Staff (right column) */}
      <div className="flex flex-col gap-4">
        {staffPositions.map((index) => (
          <SpreadCard
            key={index}
            card={cards[index]}
            position={positions[index]}
            isRevealed={revealedIndices.has(index)}
            onReveal={() => onReveal(index)}
            onSelect={() => onSelect(cards[index])}
            delay={index * 0.1}
          />
        ))}
      </div>
    </div>
  );
}
