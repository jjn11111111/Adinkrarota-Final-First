"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { CardType } from "@/lib/card-data";
import { suitInfo } from "@/lib/card-data";

interface CardThumbnailProps {
  card: CardType;
  onClick: () => void;
}

export function CardThumbnail({ card, onClick }: CardThumbnailProps) {
  const suitData = suitInfo[card.suit];
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[2/3] rounded-lg overflow-hidden card-glow group perspective-1000"
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        transform: `perspective(1000px) rotateX(${mousePosition.y * -10}deg) rotateY(${mousePosition.x * 10}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Card Image or Fallback Background */}
      {card.imageUrl ? (
        <div className="absolute inset-0 bg-card">
          <img
            src={card.imageUrl || "/placeholder.svg"}
            alt={card.name}
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <>
          {/* Fallback Background */}
          <div
            className="absolute inset-0 transition-all duration-300"
            style={{
              background: `
                linear-gradient(135deg, ${suitData.color}30 0%, transparent 50%),
                linear-gradient(225deg, var(--cosmic-purple) 0%, transparent 60%),
                var(--card)
              `,
            }}
          />

          {/* Fallback Content */}
          <div className="relative h-full flex flex-col items-center justify-between p-3 text-center">
            <span className="text-sm font-bold" style={{ color: suitData.color }}>
              {card.number}
            </span>
            <div className="flex-1 flex items-center justify-center">
              <div
                className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle, ${suitData.color}30 0%, transparent 70%)`,
                }}
              >
                <span className="text-2xl md:text-3xl text-gold-gradient font-serif">
                  {card.adinkraSymbol.charAt(0)}
                </span>
              </div>
            </div>
            <div className="w-full">
              <h3 className="text-xs md:text-sm font-medium text-foreground truncate leading-tight">
                {card.name}
              </h3>
              <p
                className="text-[10px] md:text-xs truncate mt-0.5 font-serif"
                style={{ color: `${suitData.color}cc` }}
              >
                {card.adinkraSymbol}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Border glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: `inset 0 0 30px ${suitData.color}40`,
        }}
      />

      {/* Inner border */}
      <div className="absolute inset-1.5 border border-primary/20 rounded-md group-hover:border-primary/40 transition-colors" />

      {/* Shine effect on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(105deg, transparent 40%, ${suitData.color}10 45%, ${suitData.color}20 50%, ${suitData.color}10 55%, transparent 60%)`,
        }}
      />
    </motion.button>
  );
}
