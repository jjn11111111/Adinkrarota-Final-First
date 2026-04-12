"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check, AlertCircle, Trash2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AI_MODELS,
  DEFAULT_MODEL_ID,
  type AISettings,
  getAISettings,
  saveAISettings,
  clearAISettings,
  getModelById,
  getDefaultSettings,
} from "@/lib/ai-settings";

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange?: (settings: AISettings | null) => void;
}

export function AISettingsModal({
  isOpen,
  onClose,
  onSettingsChange,
}: AISettingsModalProps) {
  const [settings, setSettings] = useState<AISettings>(getDefaultSettings());
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [testError, setTestError] = useState<string>("");

  // Load settings on mount
  useEffect(() => {
    const stored = getAISettings();
    if (stored) {
      setSettings(stored);
    }
  }, []);

  const selectedModel = getModelById(settings.modelId);

  const handleSave = () => {
    const newSettings = { ...settings, enabled: true };
    saveAISettings(newSettings);
    onSettingsChange?.(newSettings);
    onClose();
  };

  const handleDisable = () => {
    clearAISettings();
    setSettings(getDefaultSettings());
    onSettingsChange?.(null);
    onClose();
  };

  const testConnection = async () => {
    setTestStatus("testing");
    setTestError("");

    try {
      const response = await fetch("/api/ai-reading", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ id: "test", role: "user", parts: [{ type: "text", text: "Say hello in one word." }] }],
          modelId: settings.modelId,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Connection failed");
      }

      // Consume the stream so the connection completes
      await response.text();
      setTestStatus("success");
    } catch (error) {
      setTestError(error instanceof Error ? error.message : "Connection failed");
      setTestStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card/95 border border-primary/20 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl backdrop-blur-md font-reading ring-1 ring-primary/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">AI Settings</h2>
                <p className="text-sm text-muted-foreground">Choose model & test connection — used by AI Collaborator in readings</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* How to use - reduce confusion */}
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="text-sm font-semibold text-foreground mb-2">How to use AI</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Go to <strong className="text-foreground">Reading</strong></li>
                <li>Choose a spread and draw your cards</li>
                <li>Tap <strong className="text-foreground">AI Insight</strong> in the toolbar above your cards</li>
                <li>The AI Collaborator chat opens — ask for interpretations there</li>
              </ol>
              <p className="text-xs text-muted-foreground mt-2">This screen only sets your preferred model. The actual chat is inside the Reading view.</p>
            </div>

            {/* AI not working? */}
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                AI not working?
              </h4>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                <li>
                  <strong className="text-foreground">Groq API key:</strong> Add{" "}
                  <code className="bg-muted px-1 rounded">GROQ_API_KEY</code> in Vercel → Project → Settings → Environment Variables (Production + Preview if needed).
                </li>
                <li>
                  Create a key at{" "}
                  <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-primary underline">console.groq.com/keys</a>
                  — redeploy after saving.
                </li>
                <li>
                  <strong className="text-foreground">Local:</strong> Put <code className="bg-muted px-1 rounded">GROQ_API_KEY=...</code> in <code className="bg-muted px-1 rounded">.env.local</code>.
                </li>
                <li>Click <strong className="text-foreground">Test Connection</strong> below to confirm.</li>
                <li>
                  <strong className="text-foreground">Browser “Not secure” / warnings:</strong> Always open the site with{" "}
                  <code className="bg-muted px-1 rounded">https://</code> (use the URL from your Vercel deployment). Clear the site’s data in Chrome if an old HTTP bookmark triggers warnings.
                </li>
              </ol>
            </div>

            {/* Model Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Choose AI Model</label>
              <div className="space-y-2">
                {AI_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSettings((prev) => ({ ...prev, modelId: model.id }))}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      settings.modelId === model.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-background hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{model.name}</span>
                      {settings.modelId === model.id && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{model.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Test Connection */}
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={testConnection}
                disabled={testStatus === "testing"}
                className="w-full bg-transparent"
              >
                {testStatus === "testing" ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full mr-2"
                    />
                    Testing Connection...
                  </>
                ) : testStatus === "success" ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    Connection Successful
                  </>
                ) : (
                  "Test Connection"
                )}
              </Button>
              {testStatus === "error" && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
                  <p className="text-sm text-destructive">{testError}</p>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="text-sm font-medium text-foreground mb-2">What the AI Collaborator does:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>- Provides personalized interpretations of your card readings</li>
                <li>- Weaves Tarot wisdom with Adinkra symbolism</li>
                <li>- Answers follow-up questions about your spread</li>
                <li>- Offers reflection prompts for deeper insight</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border gap-3">
            {getAISettings()?.enabled && (
              <Button variant="ghost" onClick={handleDisable} className="text-destructive gap-2">
                <Trash2 className="w-4 h-4" />
                Disable AI
              </Button>
            )}
            <div className="flex gap-3 ml-auto">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={testStatus === "testing"}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Enable AI
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
