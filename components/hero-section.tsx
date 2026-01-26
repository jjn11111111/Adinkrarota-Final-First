"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ChevronDown, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMouseParallax } from "@/hooks/use-parallax";
import { FloatingElement } from "@/components/parallax-layers";
import { useRef } from "react";

interface HeroSectionProps {
  onExplore: () => void;
  onReading: () => void;
}

export function HeroSection({ onExplore, onReading }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const mousePosition = useMouseParallax({ strength: 25, easing: 0.04 });
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms for different layers
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  // Smooth spring physics
  const smoothBgY = useSpring(bgY, { stiffness: 50, damping: 20 });
  const smoothOrb1Y = useSpring(orb1Y, { stiffness: 40, damping: 15 });
  const smoothOrb2Y = useSpring(orb2Y, { stiffness: 60, damping: 25 });
  const smoothContentY = useSpring(contentY, { stiffness: 80, damping: 30 });

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      {/* Background with Adinkra symbols pattern - Layer 1 (furthest) */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: smoothBgY }}
      >
        <div 
          className="absolute inset-0 opacity-20 scale-110"
          style={{
            backgroundImage: 'url(/images/guidebook/adinkra-symbols-grid.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80" />
      </motion.div>
      
      {/* Floating orbs - Layer 2 */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none"
        style={{ 
          y: smoothOrb1Y,
          x: mousePosition.x * 0.4,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none"
        style={{ 
          y: smoothOrb2Y,
          x: mousePosition.x * -0.3,
        }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      
      {/* Additional floating particles */}
      <motion.div 
        className="absolute top-[15%] right-[20%] w-32 h-32 bg-primary/30 rounded-full blur-2xl pointer-events-none"
        style={{ 
          x: mousePosition.x * 0.6,
          y: mousePosition.y * 0.4,
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div 
        className="absolute bottom-[20%] left-[15%] w-48 h-48 bg-accent/25 rounded-full blur-2xl pointer-events-none"
        style={{ 
          x: mousePosition.x * -0.5,
          y: mousePosition.y * 0.5,
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Content - Layer 3 (foreground) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-4xl mx-auto"
        style={{ y: smoothContentY, opacity: contentOpacity }}
      >
        {/* Portal Wheel with Energy Cloud - Enhanced parallax */}
        <FloatingElement amplitude={12} duration={5}>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] mx-auto mb-8"
            style={{
              transform: `translate(${mousePosition.x * 0.15}px, ${mousePosition.y * 0.15}px)`,
            }}
          >
            {/* Energy cloud layers with mouse parallax */}
            <motion.div
              className="absolute inset-[-20%] rounded-full bg-primary/10 blur-3xl"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
              }}
            />
            <motion.div
              className="absolute inset-[-10%] rounded-full bg-accent/10 blur-2xl"
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.2, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              style={{
                transform: `translate(${mousePosition.x * -0.2}px, ${mousePosition.y * -0.2}px)`,
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/5 blur-xl"
              animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.3, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            
            {/* Levitating Portal Wheels with mouse response */}
            <motion.div
              className="absolute inset-0"
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                transform: `translate(${mousePosition.x * 0.08}px, ${mousePosition.y * 0.08}px)`,
              }}
            >
              {/* Outer wheel - clockwise */}
              <motion.div
                className="absolute inset-0 w-full h-full overflow-hidden rounded-full"
                style={{
                  filter: 'drop-shadow(0 0 30px rgba(233, 30, 140, 0.3)) drop-shadow(0 0 60px rgba(0, 184, 148, 0.2))',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
              >
                <img
                  src="/images/portal-wheel.png"
                  alt="ADINKRAROTA - Tarot + Adinkra Portal"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-auto max-w-none"
                />
              </motion.div>
              
              {/* Inner wheel - counter-clockwise with opposite parallax */}
              <motion.div
                className="absolute inset-[18%] w-[64%] h-[64%] overflow-hidden rounded-full opacity-75"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(0, 184, 148, 0.4)) brightness(1.1)',
                  transform: `translate(${mousePosition.x * -0.05}px, ${mousePosition.y * -0.05}px)`,
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              >
                <img
                  src="/images/portal-wheel.png"
                  alt=""
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-auto max-w-none"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </FloatingElement>

        {/* Title with Water Reflection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative mb-6"
        >
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider">
            <span className="gold-shimmer">ADINKRAROTA</span>
          </h1>
          
          {/* Water Reflection */}
          <div className="relative h-16 md:h-20 lg:h-24 overflow-hidden" aria-hidden="true">
            <div 
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider text-primary/30"
              style={{
                transform: 'scaleY(-1)',
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 90%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 90%)',
              }}
            >
              ADINKRAROTA
            </div>
            {/* Water ripple effect overlay */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(233,30,140,0.03) 2px, rgba(233,30,140,0.03) 4px)',
                animation: 'ripple 3s ease-in-out infinite',
              }}
            />
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-xl md:text-2xl text-muted-foreground font-serif mb-4 italic"
        >
          Error Correction for the Soul
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-base md:text-lg text-muted-foreground/80 font-serif max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Journey through 78 cards where ancient West African wisdom meets timeless Tarot archetypes. 
          Each card holds layered meanings, weaving Akan Adinkra symbols with cosmic insight.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            onClick={onReading}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8"
          >
            <Sparkles className="w-5 h-5" />
            Begin Reading
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onExplore}
            className="gap-2 text-base px-8 bg-transparent"
          >
            <BookOpen className="w-5 h-5" />
            Explore the Deck
          </Button>
        </motion.div>

        {/* Cultural note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 text-sm text-muted-foreground/60 font-serif max-w-lg mx-auto"
        >
          <p>
            Adinkra symbols originate from the Akan people of Ghana and Cote d{"'"}Ivoire, 
            carrying centuries of wisdom and cultural heritage.
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-muted-foreground/50"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </section>
  );
}
