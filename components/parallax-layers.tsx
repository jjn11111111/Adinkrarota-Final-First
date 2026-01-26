"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useMouseParallax, useScrollParallax } from "@/hooks/use-parallax";

// Floating cosmic orbs with mouse parallax
export function CosmicOrbs() {
  const mousePosition = useMouseParallax({ strength: 30, easing: 0.05 });
  const scrollOffset = useScrollParallax({ speed: 0.2 });

  const orbs = [
    { size: 400, x: "15%", y: "20%", color: "primary", depth: 0.3, blur: 60 },
    { size: 300, x: "75%", y: "30%", color: "accent", depth: 0.5, blur: 50 },
    { size: 500, x: "60%", y: "70%", color: "primary", depth: 0.2, blur: 80 },
    { size: 250, x: "25%", y: "75%", color: "accent", depth: 0.6, blur: 40 },
    { size: 350, x: "85%", y: "80%", color: "primary", depth: 0.4, blur: 55 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: orb.color === "primary" 
              ? "radial-gradient(circle, rgba(233, 30, 140, 0.15) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(0, 184, 148, 0.12) 0%, transparent 70%)",
            filter: `blur(${orb.blur}px)`,
            transform: `translate(${mousePosition.x * orb.depth}px, ${mousePosition.y * orb.depth + scrollOffset * orb.depth}px)`,
            transition: "transform 0.1s linear",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Enhanced starfield with depth layers
export function ParallaxStarfield() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMouseParallax({ strength: 15, easing: 0.03 });
  const scrollOffset = useScrollParallax({ speed: 0.1 });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Clear existing stars
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Create stars in three depth layers
    const layers = [
      { count: 60, sizeRange: [1, 2], speedMultiplier: 0.3, opacity: 0.3 },
      { count: 40, sizeRange: [2, 3], speedMultiplier: 0.5, opacity: 0.5 },
      { count: 20, sizeRange: [3, 4], speedMultiplier: 0.8, opacity: 0.8 },
    ];

    layers.forEach((layer, layerIndex) => {
      const layerDiv = document.createElement("div");
      layerDiv.className = "parallax-star-layer";
      layerDiv.dataset.layer = String(layerIndex);
      layerDiv.style.position = "absolute";
      layerDiv.style.inset = "0";
      layerDiv.style.pointerEvents = "none";

      for (let i = 0; i < layer.count; i++) {
        const star = document.createElement("div");
        const size = Math.random() * (layer.sizeRange[1] - layer.sizeRange[0]) + layer.sizeRange[0];
        
        star.style.position = "absolute";
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.borderRadius = "50%";
        star.style.background = Math.random() > 0.7 
          ? "rgba(233, 30, 140, 0.8)" 
          : Math.random() > 0.5 
            ? "rgba(0, 184, 148, 0.6)"
            : "#fff";
        star.style.opacity = String(layer.opacity);
        star.style.animation = `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        
        layerDiv.appendChild(star);
      }

      container.appendChild(layerDiv);
    });
  }, []);

  // Update layer positions based on mouse and scroll
  useEffect(() => {
    if (!containerRef.current) return;

    const layers = containerRef.current.querySelectorAll(".parallax-star-layer");
    layers.forEach((layer) => {
      const depth = parseInt((layer as HTMLElement).dataset.layer || "0") + 1;
      const multiplier = depth * 0.3;
      (layer as HTMLElement).style.transform = `translate(${mousePosition.x * multiplier}px, ${mousePosition.y * multiplier + scrollOffset * multiplier}px)`;
    });
  }, [mousePosition, scrollOffset]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    />
  );
}

// Parallax section wrapper for content sections
interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down";
}

export function ParallaxSection({ children, className = "", speed = 0.3, direction = "up" }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const multiplier = direction === "up" ? -1 : 1;
  const rawY = useTransform(scrollYProgress, [0, 1], [100 * speed * multiplier, -100 * speed * multiplier]);
  const y = useSpring(rawY, { stiffness: 100, damping: 30 });

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// Floating element with gentle drift
interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
  delay?: number;
}

export function FloatingElement({ 
  children, 
  className = "", 
  amplitude = 15, 
  duration = 6,
  delay = 0 
}: FloatingElementProps) {
  const mousePosition = useMouseParallax({ strength: 10, easing: 0.05 });

  return (
    <motion.div
      className={className}
      animate={{
        y: [-amplitude, amplitude, -amplitude],
        rotate: [-1, 1, -1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      style={{
        x: mousePosition.x * 0.3,
      }}
    >
      {children}
    </motion.div>
  );
}

// Reveal on scroll with parallax offset
interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function RevealOnScroll({ children, className = "", delay = 0 }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.3"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y: springY }}
      className={className}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
