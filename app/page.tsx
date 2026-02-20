"use client";

// ADINKRAROTA - Tarot + Adinkra Portal
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { CardGallery } from "@/components/card-gallery";
import { CardReading } from "@/components/card-reading";
import { Guidebook } from "@/components/guidebook";
import { SpreadBuilder, type CustomSpread } from "@/components/spread-builder";
import { ParallaxStarfield, CosmicOrbs, RevealOnScroll, ParallaxSection } from "@/components/parallax-layers";

type View = "home" | "gallery" | "reading" | "guidebook" | "spread-builder";

const STORAGE_KEY = "adinkrarota-custom-spreads";

// Map URL paths to views
const PATH_TO_VIEW: Record<string, View> = {
  "/": "home",
  "/gallery": "gallery",
  "/reading": "reading",
  "/guidebook": "guidebook",
  "/spread-builder": "spread-builder",
};

export default function AdinkrarotaApp() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<View>("home");
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Custom spread state
  const [customSpreads, setCustomSpreads] = useState<CustomSpread[]>([]);
  const [activeSpread, setActiveSpread] = useState<CustomSpread | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync view with URL on mount and when URL changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const updateViewFromPath = () => {
      const path = window.location.pathname;
      const viewFromPath = PATH_TO_VIEW[path] || "home";
      setCurrentView(viewFromPath);
    };
    
    // Initial sync
    updateViewFromPath();
    
    // Listen for browser back/forward navigation
    window.addEventListener("popstate", updateViewFromPath);
    
    return () => {
      window.removeEventListener("popstate", updateViewFromPath);
    };
  }, []);

  // Load spreads from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCustomSpreads(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load custom spreads:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save spreads to localStorage when they change (client-side only)
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customSpreads));
    } catch (e) {
      console.error("Failed to save custom spreads:", e);
    }
  }, [customSpreads, isLoaded]);

  const handleSaveSpread = (spread: CustomSpread) => {
    setCustomSpreads((prev) => {
      const existing = prev.findIndex((s) => s.id === spread.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = spread;
        return updated;
      }
      return [...prev, spread];
    });
  };

  const handleDeleteSpread = (id: string) => {
    setCustomSpreads((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUseSpread = (spread: CustomSpread) => {
    setActiveSpread(spread);
  };

  const handleBackToBuilder = () => {
    setActiveSpread(null);
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
    setActiveSpread(null); // Reset active spread when navigating
    
    // Update URL to match view (without page reload)
    const path = view === "home" ? "/" : `/${view}`;
    if (typeof window !== "undefined" && window.location.pathname !== path) {
      router.push(path, { scroll: false });
    }
    
    // Scroll to top when navigating (client-side only)
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen cosmic-bg">
      {/* Parallax starfield background with depth layers */}
      <ParallaxStarfield />
      
      {/* Floating cosmic orbs with mouse parallax */}
      <CosmicOrbs />

      {/* Navigation */}
      <Navigation currentView={currentView} onNavigate={handleNavigate} />

      {/* Main content */}
      <main ref={contentRef} className="relative z-10 pt-16">
        <AnimatePresence mode="wait">
          {currentView === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <HeroSection
                onExplore={() => handleNavigate("gallery")}
                onReading={() => handleNavigate("reading")}
              />

              {/* Feature highlights with parallax reveal */}
              <section className="py-20 px-6 relative">
                <div className="max-w-6xl mx-auto">
                  <RevealOnScroll>
                    <h2 className="text-3xl font-bold text-center text-gold-gradient mb-12">
                      The Fusion
                    </h2>
                  </RevealOnScroll>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <RevealOnScroll delay={0}>
                      <ParallaxSection speed={0.1}>
                        <FeatureCard
                          title="78 Cards"
                          description="Complete Major and Minor Arcana, each paired with an Adinkra symbol from Akan tradition."
                          symbol="A"
                        />
                      </ParallaxSection>
                    </RevealOnScroll>
                    <RevealOnScroll delay={0.1}>
                      <ParallaxSection speed={0.15}>
                        <FeatureCard
                          title="Layered Wisdom"
                          description="Every card weaves Tarot archetype meanings with Adinkra philosophical concepts."
                          symbol="N"
                        />
                      </ParallaxSection>
                    </RevealOnScroll>
                    <RevealOnScroll delay={0.2}>
                      <ParallaxSection speed={0.2}>
                        <FeatureCard
                          title="Divine Readings"
                          description="Multiple spread options from single card guidance to the full Celtic Cross."
                          symbol="S"
                        />
                      </ParallaxSection>
                    </RevealOnScroll>
                    <RevealOnScroll delay={0.3}>
                      <ParallaxSection speed={0.25}>
                        <FeatureCard
                          title="Create Your Spread"
                          description="Design custom spreads with up to 10 positions for personalized readings."
                          symbol="+"
                        />
                      </ParallaxSection>
                    </RevealOnScroll>
                  </div>
                </div>
              </section>

              {/* About section with parallax */}
              <section className="py-20 px-6 bg-secondary/30 relative overflow-hidden">
                {/* Parallax background elements */}
                <motion.div 
                  className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
                  style={{ y: -50 }}
                  animate={{ y: [-50, -30, -50], x: [0, 20, 0] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                  className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl"
                  animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />
                
                <div className="max-w-4xl mx-auto text-center relative z-10">
                  <RevealOnScroll>
                    <h2 className="text-3xl font-bold text-gold-gradient mb-6">
                      The Mathematics
                    </h2>
                  </RevealOnScroll>
                  <RevealOnScroll delay={0.1}>
                    <ParallaxSection speed={0.08}>
                      <p className="text-muted-foreground font-serif leading-relaxed mb-6">
                        In 2010, physicist Dr. Sylvester James Gates Jr. discovered something remarkable: 
                        the mathematical equations of supersymmetry contain embedded <span className="text-primary font-semibold">error-correcting codes</span>—the 
                        same codes used in computer science to ensure data integrity.
                      </p>
                    </ParallaxSection>
                  </RevealOnScroll>
                  <RevealOnScroll delay={0.2}>
                    <ParallaxSection speed={0.12}>
                      <p className="text-muted-foreground font-serif leading-relaxed mb-6">
                        These mathematical structures are called <span className="text-primary font-semibold">{'"'}Adinkra{'"'}</span> in physics 
                        because of their resemblance to the traditional Akan symbols. This convergence suggests 
                        that ancestral African wisdom may have been encoding truths about reality{"'"}s fundamental 
                        structure—truths that modern physics is only now recognizing.
                      </p>
                    </ParallaxSection>
                  </RevealOnScroll>
                  <RevealOnScroll delay={0.3}>
                    <ParallaxSection speed={0.15}>
                      <div className="p-6 rounded-xl bg-card/50 border border-primary/30 mb-6 backdrop-blur-sm">
                        <p className="text-foreground font-serif leading-relaxed italic">
                          {'"'}By pairing Tarot archetypes with Adinkra symbols, Adinkrarota creates a 
                          <span className="text-primary font-semibold"> redundant wisdom system</span>—like 
                          error-correcting codes, the combined message is more robust and clear than either 
                          system alone.{'"'}
                        </p>
                      </div>
                    </ParallaxSection>
                  </RevealOnScroll>
                  <RevealOnScroll delay={0.4}>
                    <p className="text-muted-foreground font-serif leading-relaxed">
                      This is not metaphor. This is the convergence of ancestral wisdom, geometry, 
                      and mathematical truth—three streams of knowledge flowing into one powerful tool for 
                      guidance and self-discovery.
                    </p>
                  </RevealOnScroll>
                </div>
              </section>
            </motion.div>
          )}

          {currentView === "gallery" && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="pt-8">
                <div className="text-center mb-8 px-6">
                  <h1 className="text-4xl font-bold text-gold-gradient mb-4">
                    The Deck
                  </h1>
                  <p className="text-muted-foreground font-serif max-w-2xl mx-auto">
                    Explore all 78 cards of Adinkrarota. Click any card to examine it 
                    in immersive 360-degree detail.
                  </p>
                </div>
                <CardGallery />
              </div>
            </motion.div>
          )}

          {currentView === "reading" && (
            <motion.div
              key="reading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="pt-8">
                <CardReading />
              </div>
            </motion.div>
          )}

          {currentView === "guidebook" && (
            <motion.div
              key="guidebook"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="pt-8">
                <Guidebook />
              </div>
            </motion.div>
          )}

          {currentView === "spread-builder" && (
            <motion.div
              key="spread-builder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="pt-8 px-6">
                {activeSpread ? (
                  <CardReading
                    customSpread={activeSpread}
                    onBackToBuilder={handleBackToBuilder}
                  />
                ) : (
                  <SpreadBuilder
                    existingSpreads={customSpreads}
                    onSave={handleSaveSpread}
                    onDeleteSpread={handleDeleteSpread}
                    onUseSpread={handleUseSpread}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-border bg-background/50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground font-serif">
            ADINKRAROTA — Where ancestral wisdom, geometry, and mathematical truth converge
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2 font-serif">
            Honoring the Akan people of Ghana and Cote d{"'"}Ivoire, whose Adinkra symbols encode the universe{"'"}s error-correcting wisdom
          </p>
        </div>
      </footer>
    </div>
  );
}

// Feature card component with 3D hover effect
function FeatureCard({
  title,
  description,
  symbol,
}: {
  title: string;
  description: string;
  symbol: string;
}) {
  return (
    <motion.div
      whileHover={{ 
        y: -8,
        rotateX: 5,
        rotateY: 5,
        transition: { duration: 0.3 }
      }}
      className="p-8 rounded-xl mystical-border bg-card/50 backdrop-blur-sm text-center perspective-1000 preserve-3d h-full"
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.div 
        className="w-16 h-16 mx-auto mb-6 rounded-full border border-primary/30 flex items-center justify-center"
        whileHover={{ 
          scale: 1.1,
          boxShadow: "0 0 30px rgba(233, 30, 140, 0.4)",
        }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-2xl font-serif text-gold-gradient">{symbol}</span>
      </motion.div>
      <h3 className="text-xl font-semibold text-primary mb-3">{title}</h3>
      <p className="text-muted-foreground font-serif text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
