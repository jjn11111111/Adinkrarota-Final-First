"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface ParallaxOptions {
  speed?: number;
  direction?: "up" | "down";
  easing?: number;
}

interface MouseParallaxOptions {
  strength?: number;
  inverted?: boolean;
  easing?: number;
}

// Scroll-based parallax hook
export function useScrollParallax(options: ParallaxOptions = {}) {
  const { speed = 0.5, direction = "up", easing = 0.1 } = options;
  const [offset, setOffset] = useState(0);
  const targetOffset = useRef(0);
  const currentOffset = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const multiplier = direction === "up" ? -1 : 1;
      targetOffset.current = scrollY * speed * multiplier;
    };

    const animate = () => {
      currentOffset.current += (targetOffset.current - currentOffset.current) * easing;
      setOffset(currentOffset.current);
      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [speed, direction, easing]);

  return offset;
}

// Mouse-based parallax hook
export function useMouseParallax(options: MouseParallaxOptions = {}) {
  const { strength = 20, inverted = false, easing = 0.08 } = options;
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });
  const currentPosition = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const multiplier = inverted ? -1 : 1;

      targetPosition.current = {
        x: ((e.clientX - centerX) / centerX) * strength * multiplier,
        y: ((e.clientY - centerY) / centerY) * strength * multiplier,
      };
    };

    const animate = () => {
      currentPosition.current = {
        x: currentPosition.current.x + (targetPosition.current.x - currentPosition.current.x) * easing,
        y: currentPosition.current.y + (targetPosition.current.y - currentPosition.current.y) * easing,
      };
      setPosition({ ...currentPosition.current });
      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [strength, inverted, easing]);

  return position;
}

// Combined parallax with scroll progress
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = docHeight > 0 ? scrollY / docHeight : 0;
      setProgress(Math.min(1, Math.max(0, scrollProgress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return progress;
}

// Element-based parallax (for elements in view)
export function useElementParallax(ref: React.RefObject<HTMLElement | null>, options: ParallaxOptions = {}) {
  const { speed = 0.3, direction = "up" } = options;
  const [offset, setOffset] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "100px" }
    );

    observer.observe(element);

    const handleScroll = () => {
      if (!element) return;
      
      const rect = element.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const distance = elementCenter - viewportCenter;
      const multiplier = direction === "up" ? -1 : 1;
      
      setOffset(distance * speed * multiplier * 0.1);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [ref, speed, direction]);

  return { offset, isInView };
}
