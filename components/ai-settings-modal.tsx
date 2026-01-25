"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Sparkles, Check, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AI_PROVIDERS,
  type AISettings,
  getAISettings,
  saveAISettings,
  clearAISettings,
  getProviderById,
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
  const [settings, setSettings] = useState<AISettings>({
    enabled: false,
    providerId: "groq",
    modelId: "groq/llama-3.3-70b-versatile",
    apiKey: "",
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [testError, setTestError] = useState<string>("");

  // Load settings on mount
  useEffect(() => {
    const stored = getAISettings();
    if (stored) {
      setSettings(stored);
    }
  }, []);

  const selectedProvider = getProviderById(settings.providerId);

  const handleProviderChange = (providerId: string) => {
    const provider = getProviderById(providerId);
    if (provider && provider.models.length > 0) {
      setSettings((prev) => ({
        ...prev,
        providerId,
        modelId: provider.models[0].id,
      }));
    }
    setTestStatus("idle");
  };

  const handleSave = () => {
    const newSettings = { ...settings, enabled: true };
    saveAISettings(newSettings);
    onSettingsChange?.(newSettings);
    onClose();
  };

  const handleDisable = () => {
    clearAISettings();
    setSettings({
      enabled: false,
      providerId: "groq",
      modelId: "groq/llama-3.3-70b-versatile",
      apiKey: "",
    });
    onSettingsChange?.(null);
    onClose();
  };

  const testConnection = async () => {
    if (selectedProvider?.requiresApiKey && !settings.apiKey) {
      setTestError("Please enter an API key");
      setTestStatus("error");
      return;
    }

    setTestStatus("testing");
    setTestError("");

    try {
      const response = await fetch("/api/ai-reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ id: "test", role: "user", parts: [{ type: "text", text: "Say hello in one word." }] }],
          providerId: settings.providerId,
          modelId: settings.modelId,
          apiKey: settings.apiKey || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Connection failed");
      }

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
          className="bg-card border border-border rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">AI Collaborator</h2>
                <p className="text-sm text-muted-foreground">Connect your AI subscription</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Provider Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">AI Provider</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AI_PROVIDERS.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => handleProviderChange(provider.id)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      settings.providerId === provider.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-foreground hover:border-primary/50"
                    }`}
                  >
                    {provider.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Selection */}
            {selectedProvider && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Model</label>
                <select
                  value={settings.modelId}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, modelId: e.target.value }))
                  }
                  className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {selectedProvider.models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* API Key Input - only show if provider requires it */}
            {selectedProvider?.requiresApiKey ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">API Key</label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={settings.apiKey}
                    onChange={(e) => {
                      setSettings((prev) => ({ ...prev, apiKey: e.target.value }));
                      setTestStatus("idle");
                    }}
                    placeholder={`Enter your ${selectedProvider?.name || "AI"} API key`}
                    className="w-full p-3 pr-12 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your API key is stored locally and never sent to our servers.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">No API key required</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedProvider?.name} is available for free. Just select a model and start using AI insights.
                </p>
              </div>
            )}

            {/* Test Connection */}
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={testConnection}
                disabled={(selectedProvider?.requiresApiKey && !settings.apiKey) || testStatus === "testing"}
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
                Disconnect
              </Button>
            )}
            <div className="flex gap-3 ml-auto">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={(selectedProvider?.requiresApiKey && !settings.apiKey) || testStatus === "testing"}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Save & Enable
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
