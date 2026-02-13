"use client";

import React from "react"

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { X, ZoomIn, ZoomOut, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CardType, DrawnCard } from "@/lib/card-data";
import { suitInfo } from "@/lib/card-data";

// Helper to check if card has polarity (is a DrawnCard)
function hasPolarity(card: CardType | DrawnCard): card is DrawnCard {
  return "polarity" in card;
}

interface ImmersiveCardViewerProps {
  card: CardType | DrawnCard;
  onClose: () => void;
}

export function ImmersiveCardViewer({ card, onClose }: ImmersiveCardViewerProps) {
  const isReversed = hasPolarity(card) && card.polarity === "reversed";
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDetails, setShowDetails] = useState(true); // Auto-show details by default

  // Mouse tracking for 3D rotation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring animation for smooth rotation
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);

  // Handle mouse movement for 3D effect
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || isFlipped) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = (event.clientX - centerX) / rect.width;
      const y = (event.clientY - centerY) / rect.height;

      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY, isFlipped]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.2, 2));
      if (e.key === "-") setZoom((z) => Math.max(z - 0.2, 0.5));
      if (e.key === "r") setIsFlipped((f) => !f);
      if (e.key === " ") {
        e.preventDefault();
        setShowDetails((d) => !d);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const suitData = suitInfo[card.suit];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Enhanced ambient light effect with parallax */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${suitData.color}15 0%, transparent 60%)`,
        }}
        animate={{
          opacity: [0.8, 1, 0.8],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Floating particle orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: `${suitData.color}10` }}
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: `${suitData.color}08` }}
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Controls */}
      <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
          className="bg-card/80 border-border hover:bg-muted"
        >
          <ZoomOut className="h-4 w-4" />
          <span className="sr-only">Zoom out</span>
        </Button>
        <span className="text-sm text-muted-foreground font-serif min-w-[3rem] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
          className="bg-card/80 border-border hover:bg-muted"
        >
          <ZoomIn className="h-4 w-4" />
          <span className="sr-only">Zoom in</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsFlipped((f) => !f)}
          className="bg-card/80 border-border hover:bg-muted ml-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="sr-only">Flip card</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowDetails((d) => !d)}
          className="bg-card/80 border-border hover:bg-muted"
        >
          <Sparkles className="h-4 w-4" />
          <span className="sr-only">Toggle details</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onClose}
          className="bg-card/80 border-border hover:bg-muted ml-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      {/* Keyboard hints */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 text-xs text-muted-foreground font-serif">
        <span>
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground">+/-</kbd> Zoom
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground">R</kbd> Flip
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground">Space</kbd> Details
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground">Esc</kbd> Close
        </span>
      </div>

      {/* Main card container */}
      <div className="flex items-center gap-8 max-w-6xl w-full px-6">
        {/* 3D Card */}
        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center perspective-1000"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            className="relative preserve-3d cursor-grab active:cursor-grabbing"
            style={{
              rotateX: isFlipped ? 0 : rotateX,
              rotateY: isFlipped ? 180 : rotateY,
              scale: zoom,
              transformStyle: "preserve-3d",
            }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
          >
            {/* Card Front */}
            <motion.div
              className="relative w-[300px] h-[480px] md:w-[350px] md:h-[560px] rounded-xl overflow-hidden backface-hidden"
              style={{
                backfaceVisibility: "hidden",
                boxShadow: `
                  0 0 40px ${suitData.color}40,
                  0 0 80px ${suitData.color}20,
                  0 25px 50px rgba(0,0,0,0.5)
                `,
              }}
            >
              {/* Card Image or Fallback */}
              {card.imageUrl ? (
                <div 
                  className={`absolute inset-0 bg-card flex items-center justify-center transition-transform duration-500 ${
                    isReversed ? "rotate-180" : ""
                  }`}
                >
                  <img
                    src={card.imageUrl || "/placeholder.svg"}
                    alt={card.name}
                    className="w-full h-full object-contain pointer-events-none select-none"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>
              ) : (
                <>
                  {/* Fallback background with gradient */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `
                        linear-gradient(135deg, ${suitData.color}20 0%, transparent 50%),
                        linear-gradient(225deg, var(--cosmic-purple) 0%, transparent 50%),
                        linear-gradient(315deg, var(--cosmic-blue) 0%, transparent 50%),
                        var(--card)
                      `,
                    }}
                  />

                  {/* Decorative border */}
                  <div className="absolute inset-2 border border-primary/30 rounded-lg" />
                  <div className="absolute inset-4 border border-primary/20 rounded-lg" />

                  {/* Fallback card content */}
                  <div className="relative h-full flex flex-col items-center justify-between p-6 text-center">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-2xl font-bold" style={{ color: suitData.color }}>
                        {card.number}
                      </span>
                      <span className="text-xs uppercase tracking-widest text-muted-foreground">
                        {card.suit === "major" ? "Major Arcana" : suitData.name}
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center py-8">
                      <div
                        className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center mb-6"
                        style={{
                          background: `radial-gradient(circle, ${suitData.color}30 0%, transparent 70%)`,
                          boxShadow: `0 0 60px ${suitData.color}40`,
                        }}
                      >
                        <span className="text-5xl md:text-6xl text-gold-gradient font-serif">
                          {card.adinkraSymbol.charAt(0)}
                        </span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-gold-gradient tracking-wide">
                        {card.name}
                      </h2>
                      <p className="text-sm mt-2 italic" style={{ color: suitData.color }}>
                        {card.adinkraSymbol}
                      </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                      {card.keywords.slice(0, 3).map((keyword) => (
                        <span
                          key={keyword}
                          className="px-3 py-1 text-xs rounded-full border border-primary/30 text-primary/80 font-serif"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>

            {/* Card Back */}
            <motion.div
              className="absolute inset-0 w-[300px] h-[480px] md:w-[350px] md:h-[560px] rounded-xl overflow-hidden backface-hidden"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                boxShadow: `
                  0 0 40px rgba(212, 175, 55, 0.3),
                  0 25px 50px rgba(0,0,0,0.5)
                `,
              }}
            >
              {/* Adinkra symbols grid background */}
              <div className="absolute inset-0 bg-card flex items-center justify-center">
                <img
                  src="/images/guidebook/adinkra-symbols-grid.jpeg"
                  alt="Card back"
                  className="w-full h-full object-contain pointer-events-none select-none"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
              <div className="absolute inset-2 border border-primary/30 rounded-lg" />
              <div className="absolute inset-4 border border-primary/20 rounded-lg" />
            </motion.div>
          </motion.div>
        </div>

        {/* Details Panel - Artful animated reveal */}
        <motion.div
          initial={{ opacity: 0, x: 80, scale: 0.95 }}
          animate={{
            opacity: showDetails ? 1 : 0,
            x: showDetails ? 0 : 80,
            scale: showDetails ? 1 : 0.95,
            pointerEvents: showDetails ? "auto" : "none",
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-96 max-h-[80vh] overflow-y-auto mystical-border rounded-xl bg-card/90 backdrop-blur-sm p-6 hidden md:block"
        >
          <motion.div 
            className="space-y-6"
            initial="hidden"
            animate={showDetails ? "visible" : "hidden"}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.2,
                },
              },
            }}
          >
            {/* Header with name and polarity */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-semibold text-gold-gradient">
                  {card.name}
                </h3>
                {hasPolarity(card) && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      isReversed 
                        ? "bg-purple-900/30 text-purple-300 border border-purple-700/50" 
                        : "bg-primary/20 text-primary border border-primary/30"
                    }`}
                  >
                    {isReversed ? "Shadow" : "Light"}
                  </motion.span>
                )}
              </div>
              <p className="text-sm text-muted-foreground font-serif">
                {card.suit === "major" ? "Major Arcana" : `${suitData.name} • ${suitData.element}`}
              </p>
              
              {/* Decorative divider */}
              <motion.div 
                className="mt-4 h-px w-full"
                style={{ background: `linear-gradient(to right, transparent, ${suitData.color}50, transparent)` }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: showDetails ? 1 : 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              />
            </motion.div>

            {/* Adinkra Symbol */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
              className="bg-secondary/30 rounded-lg p-4"
            >
              <h4 className="text-xs uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: suitData.color }} />
                Adinkra Symbol
              </h4>
              <p className="text-lg font-serif font-semibold" style={{ color: suitData.color }}>
                {card.adinkraSymbol}
              </p>
              <p className="text-sm text-muted-foreground font-serif mt-1 italic">
                {card.adinkraMeaning}
              </p>
            </motion.div>

            {/* Tarot Meaning */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
            >
              <h4 className="text-xs uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: suitData.color }} />
                Tarot Meaning
              </h4>
              <p className="text-sm text-foreground/80 font-serif leading-relaxed">
                {card.tarotMeaning}
              </p>
            </motion.div>

            {/* Fused Interpretation - Highlighted */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div 
                className="absolute -left-2 top-0 bottom-0 w-0.5 rounded-full"
                style={{ backgroundColor: suitData.color }}
              />
              <h4 className="text-xs uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                Fused Interpretation
              </h4>
              <p className="text-sm text-foreground font-serif leading-relaxed">
                {card.fusedInterpretation}
              </p>
            </motion.div>

            {/* Keywords */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
            >
              <h4 className="text-xs uppercase tracking-widest text-primary mb-3">
                Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {card.keywords.map((keyword, index) => (
                  <motion.span
                    key={keyword}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="px-3 py-1.5 text-xs rounded-full bg-muted text-foreground/80 font-serif border border-border/50 hover:border-primary/50 transition-colors"
                  >
                    {keyword}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Celestial & Element Row */}
            {(card.celestialBody || card.element) && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4 }}
                className="flex gap-4 pt-2"
              >
                {card.celestialBody && (
                  <div className="flex-1 bg-secondary/20 rounded-lg p-3 text-center">
                    <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                      Celestial
                    </h4>
                    <p className="text-sm font-serif text-foreground">
                      {card.celestialBody}
                    </p>
                  </div>
                )}
                {card.element && (
                  <div className="flex-1 bg-secondary/20 rounded-lg p-3 text-center">
                    <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                      Element
                    </h4>
                    <p className="text-sm font-serif" style={{ color: suitData.color }}>
                      {card.element}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
        
        {/* Mobile Details Bottom Sheet */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: showDetails ? 0 : "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-primary/20 rounded-t-2xl max-h-[60vh] overflow-y-auto z-50"
        >
          <div className="sticky top-0 bg-card/95 backdrop-blur-sm p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gold-gradient">{card.name}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(false)}
              className="text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-4 space-y-4">
            <div className="bg-secondary/30 rounded-lg p-3">
              <p className="text-sm font-semibold" style={{ color: suitData.color }}>
                {card.adinkraSymbol}
              </p>
              <p className="text-xs text-muted-foreground font-serif italic">
                {card.adinkraMeaning}
              </p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-primary mb-1">Fused Interpretation</h4>
              <p className="text-sm text-foreground/90 font-serif leading-relaxed">
                {card.fusedInterpretation}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {card.keywords.map((keyword) => (
                <span key={keyword} className="px-2 py-1 text-xs rounded-full bg-muted text-foreground/80 font-serif">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Mobile Details Toggle Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showDetails ? 0 : 1 }}
          transition={{ delay: 0.5 }}
          className="md:hidden absolute bottom-24 left-1/2 -translate-x-1/2"
        >
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowDetails(true)}
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            View Details
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
