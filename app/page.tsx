"use client";

// ADINKRAROTA - Tarot + Adinkra Portal
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Starfield } from "@/components/starfield";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { CardGallery } from "@/components/card-gallery";
import { CardReading } from "@/components/card-reading";
import { Guidebook } from "@/components/guidebook";
import { SpreadBuilder, type CustomSpread } from "@/components/spread-builder";

type View = "home" | "gallery" | "reading" | "guidebook" | "spread-builder";

const STORAGE_KEY = "adinkrarota-custom-spreads";

export default function AdinkrarotaApp() {
  const [currentView, setCurrentView] = useState<View>("home");
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Custom spread state
  const [customSpreads, setCustomSpreads] = useState<CustomSpread[]>([]);
  const [activeSpread, setActiveSpread] = useState<CustomSpread | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load spreads from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCustomSpreads(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load custom spreads:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save spreads to localStorage when they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customSpreads));
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
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen cosmic-bg">
      {/* Animated starfield background */}
      <Starfield />

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

              {/* Feature highlights */}
              <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-3xl font-bold text-center text-gold-gradient mb-12">
                    The Fusion
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FeatureCard
                      title="78 Cards"
                      description="Complete Major and Minor Arcana, each paired with an Adinkra symbol from Akan tradition."
                      symbol="A"
                    />
                    <FeatureCard
                      title="Layered Wisdom"
                      description="Every card weaves Tarot archetype meanings with Adinkra philosophical concepts."
                      symbol="N"
                    />
                    <FeatureCard
                      title="Divine Readings"
                      description="Multiple spread options from single card guidance to the full Celtic Cross."
                      symbol="S"
                    />
                    <FeatureCard
                      title="Create Your Spread"
                      description="Design custom spreads with up to 10 positions for personalized readings."
                      symbol="+"
                    />
                  </div>
                </div>
              </section>

              {/* About section */}
              <section className="py-20 px-6 bg-secondary/30">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl font-bold text-gold-gradient mb-6">
                    The Mathematics
                  </h2>
                  <p className="text-muted-foreground font-serif leading-relaxed mb-6">
                    In 2010, physicist Dr. Sylvester James Gates Jr. discovered something remarkable: 
                    the mathematical equations of supersymmetry contain embedded <span className="text-primary font-semibold">error-correcting codes</span>—the 
                    same codes used in computer science to ensure data integrity.
                  </p>
                  <p className="text-muted-foreground font-serif leading-relaxed mb-6">
                    These mathematical structures are called <span className="text-primary font-semibold">{'"'}Adinkra{'"'}</span> in physics 
                    because of their resemblance to the traditional Akan symbols. This convergence suggests 
                    that ancestral African wisdom may have been encoding truths about reality{"'"}s fundamental 
                    structure—truths that modern physics is only now recognizing.
                  </p>
                  <div className="p-6 rounded-xl bg-card/50 border border-primary/30 mb-6">
                    <p className="text-foreground font-serif leading-relaxed italic">
                      {'"'}By pairing Tarot archetypes with Adinkra symbols, Adinkrarota creates a 
                      <span className="text-primary font-semibold"> redundant wisdom system</span>—like 
                      error-correcting codes, the combined message is more robust and clear than either 
                      system alone.{'"'}
                    </p>
                  </div>
                  <p className="text-muted-foreground font-serif leading-relaxed">
                    This is not metaphor. This is the convergence of ancestral wisdom, geometry, 
                    and mathematical truth—three streams of knowledge flowing into one powerful tool for 
                    guidance and self-discovery.
                  </p>
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

// Feature card component
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
      whileHover={{ y: -4 }}
      className="p-8 rounded-xl mystical-border bg-card/50 backdrop-blur-sm text-center"
    >
      <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-primary/30 flex items-center justify-center">
        <span className="text-2xl font-serif text-gold-gradient">{symbol}</span>
      </div>
      <h3 className="text-xl font-semibold text-primary mb-3">{title}</h3>
      <p className="text-muted-foreground font-serif text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
