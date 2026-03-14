"use client";

import React from "react"

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Send,
  Sparkles,
  X,
  Maximize2,
  Minimize2,
  Settings,
  MessageCircle,
  BookOpen,
  Save,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { type AISettings, getAISettings, getModelById, getDefaultSettings, DEFAULT_MODEL_ID } from "@/lib/ai-settings";
import { AISettingsModal } from "./ai-settings-modal";
import type { CardType, DrawnCard } from "@/lib/card-data";
import { getGuidebookEntry } from "@/lib/guidebook-data";
import { getReadingContext } from "@/lib/ai-wisdom-prompt";

interface AIReadingChatProps {
  cards: DrawnCard[];
  positions: { name: string; description: string }[];
  spreadName: string;
  isVisible: boolean;
  onClose: () => void;
  autoInterpret?: boolean; // Automatically request interpretation when opened
  readingId?: string; // If provided, allows saving AI interpretation to database
}

export function AIReadingChat({
  cards,
  positions,
  spreadName,
  isVisible,
  onClose,
  autoInterpret = false,
  readingId,
}: AIReadingChatProps) {
  const [aiSettings, setAISettings] = useState<AISettings | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to save AI interpretation to database
  const saveInterpretation = async () => {
    if (!readingId || messages.length === 0) return;
    
    // Extract all assistant messages as the interpretation
    const interpretation = messages
      .filter(m => m.role === "assistant")
      .map(m => m.parts.filter(p => p.type === "text").map(p => (p as { type: "text"; text: string }).text).join(""))
      .join("\n\n---\n\n");
    
    if (!interpretation.trim()) return;
    
    setSaveStatus("saving");
    
    try {
      const response = await fetch("/api/readings/save-interpretation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readingId, interpretation }),
      });
      
      if (response.ok) {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("idle");
      }
    } catch {
      setSaveStatus("idle");
    }
  };

  // Load AI settings on mount
  useEffect(() => {
    setAISettings(getAISettings());
  }, []);

  // Build comprehensive reading context for the AI using the wisdom prompt helper
  const buildReadingContext = () => {
    if (cards.length === 0) return "";

    // Get guidebook entries for each card
    const guidebookEntries = cards.map(card => {
      const entry = getGuidebookEntry(card.id);
      return entry ? {
        lightAspect: entry.lightAspect,
        shadowAspect: entry.shadowAspect,
        fullDescription: entry.fullDescription,
        inReadings: entry.inReadings,
      } : null;
    });

    // Use the enhanced context builder from the wisdom prompt
    return getReadingContext(
      spreadName,
      cards.map(card => ({
        name: card.name,
        polarity: card.polarity,
        adinkraSymbol: card.adinkraSymbol,
        adinkraMeaning: card.adinkraMeaning,
        suit: card.suit,
        keywords: card.keywords,
        polarityKeywords: card.polarityKeywords,
        fusedInterpretation: card.fusedInterpretation,
        element: card.element,
        celestialBody: card.celestialBody,
        zodiacSign: card.zodiacSign,
        numerology: card.numerology,
        number: card.number,
      })),
      positions,
      guidebookEntries
    );
  };

  // Ref for current request body - prepareSendMessagesRequest needs latest values (avoids stale closure)
  const requestBodyRef = useRef({ modelId: DEFAULT_MODEL_ID, readingContext: "" });
  requestBodyRef.current = {
    modelId: aiSettings?.modelId || DEFAULT_MODEL_ID,
    readingContext: buildReadingContext(),
  };

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai-reading",
        prepareSendMessagesRequest: ({ body, ...opts }) => ({
          ...opts,
          body: { ...body, ...requestBodyRef.current },
        }),
      }),
    [] // Ref provides current values; transport never needs recreation
  );

  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-interpret when opened with autoInterpret flag and no messages yet
  const hasAutoInterpreted = useRef(false);
  useEffect(() => {
    if (
      autoInterpret &&
      isVisible &&
      aiSettings?.enabled &&
      cards.length > 0 &&
      messages.length === 0 &&
      status === "ready" &&
      !hasAutoInterpreted.current
    ) {
      hasAutoInterpreted.current = true;
      sendMessage({ 
        text: "Please provide a comprehensive interpretation of this reading. Draw from all sources of universal wisdom—Adinkra philosophy, Tarot tradition, astrological correspondences, numerological significance, and the collective wisdom of all spiritual traditions. Illuminate both the individual cards and their interconnected message."
      });
    }
  }, [autoInterpret, isVisible, aiSettings?.enabled, cards.length, messages.length, status, sendMessage]);

  // Reset auto-interpret flag when chat is closed
  useEffect(() => {
    if (!isVisible) {
      hasAutoInterpreted.current = false;
    }
  }, [isVisible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || status !== "ready" || !aiSettings?.enabled) return;
    sendMessage({ text: inputValue });
    setInputValue("");
  };

  const handleQuickPrompt = (prompt: string) => {
    if (status !== "ready" || !aiSettings?.enabled) return;
    sendMessage({ text: prompt });
  };

  const selectedModel = aiSettings ? getModelById(aiSettings.modelId) : null;

  if (!isVisible) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className={`fixed z-40 bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col ${
            isExpanded
              ? "inset-4 md:inset-8"
              : "bottom-4 right-4 w-[95vw] max-w-md h-[70vh] max-h-[600px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-card/80 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">AI Collaborator</h3>
                <p className="text-xs text-muted-foreground">
                  {aiSettings?.enabled && selectedModel ? `${selectedModel.name} — chat about your spread` : "Chat about your reading"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {/* Save button - only show when there are messages and a reading ID */}
              {readingId && messages.some(m => m.role === "assistant") && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={saveInterpretation}
                  disabled={saveStatus === "saving"}
                  className="h-8 w-8"
                  title="Save interpretation to reading"
                >
                  {saveStatus === "saved" ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : saveStatus === "saving" ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                    />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(true)}
                className="h-8 w-8"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8"
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          {!aiSettings?.enabled ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Enable AI Interpretations
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                Get personalized interpretations powered by advanced AI models.
                No API key required.
              </p>
              <Button onClick={() => setShowSettings(true)} className="gap-2">
                <Sparkles className="w-4 h-4" />
                Enable AI
              </Button>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Ask about your reading or use a prompt below
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleQuickPrompt(
                            "Please give me a comprehensive interpretation of this spread, weaving together the Tarot meanings and Adinkra wisdom."
                          )
                        }
                        className="text-xs"
                      >
                        <BookOpen className="w-3 h-3 mr-1" />
                        Full Interpretation
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleQuickPrompt(
                            "What is the overall message or theme of this reading?"
                          )
                        }
                        className="text-xs"
                      >
                        Overall Theme
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleQuickPrompt(
                            "What reflection questions should I sit with based on this reading?"
                          )
                        }
                        className="text-xs"
                      >
                        Reflection Prompts
                      </Button>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-xl ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        {message.parts.map((part, idx) =>
                          part.type === "text" ? (
                            <p
                              key={idx}
                              className="text-sm whitespace-pre-wrap leading-relaxed"
                            >
                              {part.text}
                            </p>
                          ) : null
                        )}
                      </div>
                    </div>
                  ))
                )}
                {status === "streaming" && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-xl">
                      <motion.div
                        className="flex gap-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-primary rounded-full"
                            animate={{ y: [0, -4, 0] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </motion.div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="p-4 border-t border-border bg-card/80 backdrop-blur"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about your reading..."
                    disabled={status !== "ready"}
                    className="flex-1 p-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                  <Button
                    type="submit"
                    disabled={!inputValue.trim() || status !== "ready"}
                    className="px-4"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Settings Modal */}
      <AISettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSettingsChange={(newSettings) => {
          setAISettings(newSettings);
          setMessages([]);
        }}
      />
    </>
  );
}
