# V0 Copy-Paste Code Reference

## 📋 Instructions for V0

Copy and paste these code blocks into V0 when needed. Each section is ready to use.

---

## 1. Main App Component (app/page.tsx)

**Use this when:** V0 suggests changes to the main page or routing structure.

```typescript
"use client";

// ADINKRAROTA - Tarot + Adinkra Portal
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
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
              {/* ... rest of home view content ... */}
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
        </div>
      </footer>
    </div>
  );
}
```

---

## 2. Route Handler Pattern (app/[view]/page.tsx)

**Use this for:** spread-builder, guidebook, reading, gallery route pages.

```typescript
// Re-export the main app - it will handle routing based on URL
export { default } from "../page";
```

**Files to create/update:**
- `app/spread-builder/page.tsx`
- `app/guidebook/page.tsx`
- `app/reading/page.tsx`
- `app/gallery/page.tsx`

---

# 3. AI Reading Route (app/api/ai-reading/route.ts)

**Use this when:** V0 modifies AI routes or suggests model changes.

```typescript
import { convertToModelMessages, streamText, UIMessage } from "ai";
i#mport { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { xai } from "@ai-sdk/xai";
import { UNIVERSAL_WISDOM_SYSTEM_PROMPT, SPREAD_BUILDER_ASSISTANT_PROMPT } from "@/lib/ai-wisdom-prompt";

export const maxDuration = 60;

// Default model for Vercel AI Gateway (zero config)
const DEFAULT_MODEL = anthropic("claude-sonnet-4-20250514");

// Model mapping for Vercel AI Gateway format
const MODEL_MAP: Record<string, any> = {
  // OpenAI
  "openai/gpt-4o": openai("gpt-4o"),
  "openai/gpt-4o-mini": openai("gpt-4o-mini"),
  "openai/gpt-4-turbo": openai("gpt-4-turbo"),
  // Anthropic
  "anthropic/claude-sonnet-4-5": anthropic("claude-sonnet-4-20250514"),
  "anthropic/claude-3-5-sonnet-20241022": anthropic("claude-3-5-sonnet-20241022"),
  "anthropic/claude-3-haiku-20240307": anthropic("claude-3-haiku-20240307"),
  // Groq (via gateway)
  "groq/llama-3.3-70b-versatile": groq("llama-3.3-70b-versatile"),
  "groq/mixtral-8x7b-32768": groq("mixtral-8x7b-32768"),
  // xAI (via gateway)
  "xai/grok-2-1212": xai("grok-2-1212"),
  "xai/grok-beta": xai("grok-beta"),
};

export async function POST(req: Request) {
  try {
    const {
      messages,
      modelId,
      readingContext,
    }: {
      messages: UIMessage[];
      modelId?: string;
      readingContext?: string;
    } = await req.json();

    // Use Vercel AI Gateway - resolve model ID or use default
    const model = modelId ? (MODEL_MAP[modelId] || modelId) : DEFAULT_MODEL;

    // Determine which system prompt to use based on context
    const isSpreadBuilder = readingContext?.includes("SPREAD_BUILDER_MODE");
    let systemMessage = isSpreadBuilder 
      ? SPREAD_BUILDER_ASSISTANT_PROMPT 
      : UNIVERSAL_WISDOM_SYSTEM_PROMPT;
    
    if (readingContext) {
      systemMessage += `\n\n${readingContext}`;
    }

    const result = streamText({
      model,
      system: systemMessage,
      messages: await convertToModelMessages(messages),
      maxOutputTokens: 2500,
      temperature: 0.8,
      abortSignal: req.signal,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI Reading Error:", error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process request",
      },
      { status: 500 }
    );
  }
}
```

---

## 4. Daily Wisdom Route (app/api/daily-wisdom/route.ts)

**Use this when:** V0 modifies the daily wisdom API route.

```typescript
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { drawCardsWithPolarity } from "@/lib/card-data";
import { getGuidebookEntry } from "@/lib/guidebook-data";

export const maxDuration = 30;

const DAILY_WISDOM_PROMPT = `You are a wisdom keeper for the Adinkrarota Tarot system—a fusion of West African Adinkra symbolism and traditional Tarot archetypes.

Generate a brief, inspiring daily wisdom message based on the card drawn. The message should:
1. Be 2-3 sentences maximum
2. Weave the Adinkra symbol meaning with the Tarot wisdom
3. Be uplifting and actionable for the day ahead
4. Avoid being preachy or overly mystical
5. Feel personal and grounded

Do NOT include any greeting, signature, or card name in your response. Just the wisdom message itself.`;

export async function POST(req: Request) {
  try {
    // Draw a single card for the day
    const [drawnCard] = drawCardsWithPolarity(1);
    const guidebook = getGuidebookEntry(drawnCard.id);
    
    const cardContext = `
Card: ${drawnCard.name}
Polarity: ${drawnCard.polarity === "reversed" ? "Shadow (Reversed)" : "Light (Upright)"}
Adinkra Symbol: ${drawnCard.adinkraSymbol}
Adinkra Meaning: ${drawnCard.adinkraMeaning}
Keywords: ${drawnCard.polarityKeywords.join(", ")}
Fused Interpretation: ${drawnCard.fusedInterpretation}
${guidebook?.fullDescription ? `Full Description: ${guidebook.fullDescription}` : ""}
`;

    const result = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: DAILY_WISDOM_PROMPT,
      prompt: cardContext,
      maxOutputTokens: 200,
      temperature: 0.9,
      abortSignal: req.signal,
    });

    return Response.json({
      card: {
        id: drawnCard.id,
        name: drawnCard.name,
        image: drawnCard.image,
        polarity: drawnCard.polarity,
        adinkraSymbol: drawnCard.adinkraSymbol,
        polarityKeywords: drawnCard.polarityKeywords,
      },
      wisdom: result.text,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Daily Wisdom Error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to generate wisdom" },
      { status: 500 }
    );
  }
}
```

---

## 5. localStorage Safety Pattern

**Use this whenever:** Any component needs to access localStorage.

```typescript
// Pattern for loading from localStorage
useEffect(() => {
  if (typeof window === "undefined") return;
  
  try {
    const stored = localStorage.getItem("your-key");
    if (stored) {
      // Parse and use stored data
      const data = JSON.parse(stored);
      // ... use data
    }
  } catch (e) {
    console.error("Failed to load from localStorage:", e);
  }
}, []);

// Pattern for saving to localStorage
useEffect(() => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem("your-key", JSON.stringify(yourData));
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
  }
}, [yourData]);
```

---## 6. Window Object Safety Pattern

**Use this whenever:** Accessing window, document, or other browser APIs.

```typescript
// Always check before accessing window
if (typeof window !== "undefined") {
  window.scrollTo({ top: 0, behavior: "smooth" });
  // or
  window.history.pushState({}, "", "/path");
  // or
 

 const value = window.localStorage.getItem("key");
}
```

---

## 7. URL Synchronization Pattern

**Use this when:** Adding new views or modifying navigation.

```typescript
// Add to PATH_TO_VIEW mapping
const PATH_TO_VIEW: Record<string, View> = {
  "/": "home",
  "/gallery": "gallery",
  "/reading": "reading",
  "/guidebook": "guidebook",
  "/spread-builder": "spread-builder",
  // Add new routes here
};

// URL sync useEffect (already in main app)
useEffect(() => {
  if (typeof window === "undefined") return;
  
  const updateViewFromPath = () => {
    const path = window.location.pathname;
    const viewFromPath = PATH_TO_VIEW[path] || "home";
    setCurrentView(viewFromPath);
  };
  
  updateViewFromPath();
  window.addEventListener("popstate", updateViewFromPath);
  return () => window.removeEventListener("popstate", updateViewFromPath);
}, []);
```

---

## 8. Navigation Handler Pattern

**Use this when:** Modifying navigation logic.

```typescript
const handleNavigate = (view: View) => {
  setCurrentView(view);
  setActiveSpread(null); // Reset any sub-states
  
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
```

---

## 📝 V0 Prompt Template

When pasting code into V0, use this format:

```
I need to maintain a unified SPA architecture. Here's the current implementation:

[PASTE CODE FROM SECTION 1 - Main App Component]

The route pages (spread-builder, guidebook, reading, gallery) should use this pattern:

[PASTE CODE FROM SECTION 2 - Route Handler Pattern]

For AI routes, use this pattern:

[PASTE CODE FROM SECTION 3 - AI Reading Route]

Always check typeof window before accessing localStorage or window object:

[PASTE CODE FROM SECTION 5 - localStorage Safety Pattern]

Please maintain these patterns when making changes.
```

---

## 🎯 Quick Reference

| Pattern | Section | When to Use |
|---------|---------|-------------|
| Main App | 1 | V0 modifies routing or main page |
| Route Handlers | 2 | Creating/modifying route pages |
| AI Routes | 3-4 | Modifying AI functionality |
| localStorage | 5 | Any component using localStorage |
| Window Safety | 6 | Accessing browser APIs |
| URL Sync | 7 | Adding new views |
| Navigation | 8 | Modifying navigation logic |

---

## ⚠️ Important Notes

1. **Always preserve the unified SPA architecture** - Don't let V0 split views into separate route pages
2. **Always check `typeof window`** before accessing browser APIs
3. **Always import AI providers explicitly** - Don't use model strings directly
4. **Route pages must re-export main app** - Keep the simple pattern
5. **URL sync is critical** - Maintain the PATH_TO_VIEW mapping and popstate listener

---

**Last Updated:** After Option A implementation
**Status:** ✅ Ready for V0 use
