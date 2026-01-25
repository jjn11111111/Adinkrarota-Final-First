"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Plus,
  Trash2,
  Save,
  Play,
  GripVertical,
  Sparkles,
  X,
  Edit3,
  Layout,
  Grid3X3,
  Bot,
  Send,
  Wand2,
  Download,
  Upload,
  Share2,
  CheckCircle,
  Clock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getAISettings, type AISettings, DEFAULT_MODEL_ID } from "@/lib/ai-settings";

export interface CustomSpreadPosition {
  id: string;
  name: string;
  description: string;
}

export interface CustomSpread {
  id: string;
  name: string;
  description: string;
  positions: CustomSpreadPosition[];
  createdAt: number;
  // Creator attribution fields
  creator?: {
    name: string;
    contact?: string; // Optional email or social handle
    location?: string;
  };
  isFeatured?: boolean; // Whether this is a featured/approved spread
  submissionStatus?: "draft" | "submitted" | "approved" | "rejected";
}

interface SpreadBuilderProps {
  onSave: (spread: CustomSpread) => void;
  onUseSpread: (spread: CustomSpread) => void;
  existingSpreads: CustomSpread[];
  onDeleteSpread: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

// Download spread as JSON file
const downloadSpread = (spread: CustomSpread) => {
  const exportData = {
    ...spread,
    exportedAt: new Date().toISOString(),
    format: "adinkrarota-spread-v1",
  };
  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${spread.name.replace(/\s+/g, "-").toLowerCase()}-spread.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const defaultPositionNames = [
  "Present Situation",
  "Challenge",
  "Past Influences",
  "Future Potential",
  "Above (Goals)",
  "Below (Foundation)",
  "Advice",
  "External Influences",
  "Hopes & Fears",
  "Final Outcome",
];

export function SpreadBuilder({
  onSave,
  onUseSpread,
  existingSpreads,
  onDeleteSpread,
}: SpreadBuilderProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [spreadName, setSpreadName] = useState("");
  const [spreadDescription, setSpreadDescription] = useState("");
  const [positions, setPositions] = useState<CustomSpreadPosition[]>([]);
  const [editingSpread, setEditingSpread] = useState<CustomSpread | null>(null);
  
  // AI Assistance state
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiSettings, setAiSettings] = useState<AISettings | null>(null);
  const [aiInput, setAiInput] = useState("");
  const [showAiPanel, setShowAiPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Submission state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submittingSpread, setSubmittingSpread] = useState<CustomSpread | null>(null);
  const [creatorName, setCreatorName] = useState("");
  const [creatorContact, setCreatorContact] = useState("");
  const [creatorLocation, setCreatorLocation] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Load AI settings
  useEffect(() => {
    const settings = getAISettings();
    setAiSettings(settings);
  }, []);

  // AI Chat for spread suggestions
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai-reading",
      body: {
        modelId: aiSettings?.modelId || DEFAULT_MODEL_ID,
        readingContext: "SPREAD_BUILDER_MODE\n\nYou are helping the user create a custom tarot spread. Suggest position names, descriptions, and thematic coherence. Keep suggestions concise and meaningful.",
      },
    }),
  });

  // Scroll AI messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addPosition = useCallback(() => {
    if (positions.length >= 10) return;

    const newPosition: CustomSpreadPosition = {
      id: generateId(),
      name: defaultPositionNames[positions.length] || `Position ${positions.length + 1}`,
      description: "",
    };
    setPositions([...positions, newPosition]);
  }, [positions]);

  const removePosition = useCallback((id: string) => {
    setPositions(positions.filter((p) => p.id !== id));
  }, [positions]);

  const updatePosition = useCallback(
    (id: string, field: "name" | "description", value: string) => {
      setPositions(
        positions.map((p) => (p.id === id ? { ...p, [field]: value } : p))
      );
    },
    [positions]
  );

  const handleSave = () => {
    if (!spreadName.trim() || positions.length === 0) return;

    const spread: CustomSpread = {
      id: editingSpread?.id || generateId(),
      name: spreadName.trim(),
      description: spreadDescription.trim(),
      positions: positions.map((p, i) => ({
        ...p,
        name: p.name || `Position ${i + 1}`,
      })),
      createdAt: editingSpread?.createdAt || Date.now(),
    };

    onSave(spread);
    resetForm();
  };

  const resetForm = () => {
    setIsCreating(false);
    setEditingSpread(null);
    setSpreadName("");
    setSpreadDescription("");
    setPositions([]);
  };

  const startEditing = (spread: CustomSpread) => {
    setEditingSpread(spread);
    setSpreadName(spread.name);
    setSpreadDescription(spread.description);
    setPositions([...spread.positions]);
    setIsCreating(true);
  };

  const startCreating = () => {
    setIsCreating(true);
    // Add one default position to start
    addPosition();
  };

  // Open submission modal for a spread
  const openSubmitModal = (spread: CustomSpread) => {
    setSubmittingSpread(spread);
    setShowSubmitModal(true);
    setSubmissionSuccess(false);
    // Pre-fill if creator info exists
    if (spread.creator) {
      setCreatorName(spread.creator.name || "");
      setCreatorContact(spread.creator.contact || "");
      setCreatorLocation(spread.creator.location || "");
    }
  };

  // Handle submission for review
  const handleSubmitForReview = () => {
    if (!submittingSpread || !creatorName.trim()) return;

    // Create submission package
    const submission = {
      spread: {
        ...submittingSpread,
        creator: {
          name: creatorName.trim(),
          contact: creatorContact.trim() || undefined,
          location: creatorLocation.trim() || undefined,
        },
        submissionStatus: "submitted" as const,
      },
      submissionNotes: submissionNotes.trim(),
      submittedAt: new Date().toISOString(),
    };

    // Download submission package for manual review process
    const blob = new Blob([JSON.stringify(submission, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `submission-${submittingSpread.name.replace(/\s+/g, "-").toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Update the spread with creator info
    const updatedSpread = {
      ...submittingSpread,
      creator: {
        name: creatorName.trim(),
        contact: creatorContact.trim() || undefined,
        location: creatorLocation.trim() || undefined,
      },
      submissionStatus: "submitted" as const,
    };
    onSave(updatedSpread);

    setSubmissionSuccess(true);
  };

  const closeSubmitModal = () => {
    setShowSubmitModal(false);
    setSubmittingSpread(null);
    setCreatorName("");
    setCreatorContact("");
    setCreatorLocation("");
    setSubmissionNotes("");
    setSubmissionSuccess(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {!isCreating ? (
          <motion.div
            key="spread-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gold-gradient mb-2">
                Custom Spreads
              </h2>
              <p className="text-muted-foreground font-serif">
                Design your own tarot spreads with up to 10 positions
              </p>
            </div>

            {/* Create New Button */}
            <motion.button
              onClick={startCreating}
              className="w-full p-6 border-2 border-dashed border-primary/30 rounded-xl hover:border-primary/60 hover:bg-primary/5 transition-all group"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Plus className="w-7 h-7 text-primary" />
                </div>
                <span className="text-lg font-medium text-foreground">
                  Create New Spread
                </span>
                <span className="text-sm text-muted-foreground">
                  Design a custom layout for your readings
                </span>
              </div>
            </motion.button>

            {/* Existing Spreads */}
            {existingSpreads.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Layout className="w-5 h-5 text-primary" />
                  Your Spreads
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {existingSpreads.map((spread) => (
                    <motion.div
                      key={spread.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-foreground flex items-center gap-2">
                            {spread.name}
                            {spread.submissionStatus === "submitted" && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Submitted
                              </span>
                            )}
                            {spread.submissionStatus === "approved" && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-700 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Featured
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {spread.positions.length} positions
                            {spread.creator && (
                              <span className="ml-2">
                                by {spread.creator.name}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadSpread(spread)}
                            className="h-8 w-8 p-0"
                            title="Download Spread"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(spread)}
                            className="h-8 w-8 p-0"
                            title="Edit Spread"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteSpread(spread.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            title="Delete Spread"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {spread.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {spread.description}
                        </p>
                      )}

                      {/* Position preview */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {spread.positions.map((pos, i) => (
                          <span
                            key={pos.id}
                            className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                          >
                            {i + 1}. {pos.name}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => onUseSpread(spread)}
                          className="flex-1 gap-2"
                          size="sm"
                        >
                          <Play className="w-4 h-4" />
                          Use
                        </Button>
                        {spread.submissionStatus !== "submitted" && spread.submissionStatus !== "approved" && (
                          <Button
                            onClick={() => openSubmitModal(spread)}
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            title="Submit for featuring on Adinkrarota"
                          >
                            <Share2 className="w-4 h-4" />
                            Submit
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {existingSpreads.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Grid3X3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-serif">
                  No custom spreads yet. Create your first one!
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="spread-editor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Editor Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                {editingSpread ? "Edit Spread" : "Create New Spread"}
              </h2>
              <div className="flex items-center gap-4">
                {/* AI Assistance Toggle */}
                {aiSettings?.enabled && (
                  <div className="flex items-center gap-2">
                    <Switch
                      id="ai-assist"
                      checked={aiEnabled}
                      onCheckedChange={(checked) => {
                        setAiEnabled(checked);
                        if (checked) setShowAiPanel(true);
                      }}
                    />
                    <Label htmlFor="ai-assist" className="text-sm cursor-pointer flex items-center gap-1">
                      <Bot className="w-4 h-4" />
                      AI Assist
                    </Label>
                  </div>
                )}
                <Button variant="ghost" onClick={resetForm} className="gap-2">
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </div>

            {/* AI Assistance Panel */}
            <AnimatePresence>
              {aiEnabled && showAiPanel && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <span className="font-medium text-foreground">AI Spread Assistant</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAiPanel(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* AI Messages */}
                    <div className="max-h-48 overflow-y-auto space-y-2 text-sm">
                      {messages.length === 0 ? (
                        <p className="text-muted-foreground italic">
                          Ask for help designing your spread, or use the quick prompts below.
                        </p>
                      ) : (
                        messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`p-2 rounded-lg ${
                              msg.role === "user"
                                ? "bg-primary/20 ml-8"
                                : "bg-card mr-8"
                            }`}
                          >
                            {msg.parts.map((part, idx) =>
                              part.type === "text" ? (
                                <p key={idx} className="whitespace-pre-wrap">{part.text}</p>
                              ) : null
                            )}
                          </div>
                        ))
                      )}
                      {status === "streaming" && (
                        <div className="flex gap-1 p-2">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-primary rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                            />
                          ))}
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Prompts */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => sendMessage({ text: `Suggest a ${positions.length || 3}-card spread for exploring a relationship question. Give me position names and brief descriptions.` })}
                        disabled={status !== "ready"}
                        className="text-xs"
                      >
                        <Wand2 className="w-3 h-3 mr-1" />
                        Relationship Spread
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => sendMessage({ text: `Suggest a ${positions.length || 3}-card spread for career/work decisions. Give me position names and brief descriptions.` })}
                        disabled={status !== "ready"}
                        className="text-xs"
                      >
                        <Wand2 className="w-3 h-3 mr-1" />
                        Career Spread
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => sendMessage({ text: `Suggest a ${positions.length || 5}-card spread for personal growth and self-discovery. Give me position names and brief descriptions.` })}
                        disabled={status !== "ready"}
                        className="text-xs"
                      >
                        <Wand2 className="w-3 h-3 mr-1" />
                        Growth Spread
                      </Button>
                    </div>

                    {/* AI Input */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (aiInput.trim() && status === "ready") {
                          sendMessage({ text: aiInput });
                          setAiInput("");
                        }
                      }}
                      className="flex gap-2"
                    >
                      <Input
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        placeholder="Ask for spread ideas..."
                        disabled={status !== "ready"}
                        className="flex-1"
                      />
                      <Button type="submit" disabled={!aiInput.trim() || status !== "ready"} size="sm">
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Spread Details */}
            <div className="space-y-4 p-6 rounded-xl border border-border bg-card">
              <div className="space-y-2">
                <Label htmlFor="spread-name">Spread Name</Label>
                <Input
                  id="spread-name"
                  placeholder="e.g., My Relationship Spread"
                  value={spreadName}
                  onChange={(e) => setSpreadName(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="spread-description">
                  Description (optional)
                </Label>
                <Textarea
                  id="spread-description"
                  placeholder="What is this spread used for?"
                  value={spreadDescription}
                  onChange={(e) => setSpreadDescription(e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            {/* Positions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Card Positions ({positions.length}/10)
                </h3>
                <Button
                  onClick={addPosition}
                  disabled={positions.length >= 10}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Position
                </Button>
              </div>

              {positions.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                  <Sparkles className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground mb-4">
                    Add positions to define your spread layout
                  </p>
                  <Button onClick={addPosition} variant="outline" className="gap-2 bg-transparent">
                    <Plus className="w-4 h-4" />
                    Add First Position
                  </Button>
                </div>
              ) : (
                <Reorder.Group
                  axis="y"
                  values={positions}
                  onReorder={setPositions}
                  className="space-y-3"
                >
                  {positions.map((position, index) => (
                    <Reorder.Item
                      key={position.id}
                      value={position}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <motion.div
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
                      >
                        {/* Drag Handle & Number */}
                        <div className="flex items-center gap-2 pt-2">
                          <GripVertical className="w-5 h-5 text-muted-foreground" />
                          <span className="w-7 h-7 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                        </div>

                        {/* Position Fields */}
                        <div className="flex-1 space-y-3">
                          <Input
                            placeholder="Position name (e.g., Present)"
                            value={position.name}
                            onChange={(e) =>
                              updatePosition(position.id, "name", e.target.value)
                            }
                            className="font-medium"
                          />
                          <Textarea
                            placeholder="What does this position represent?"
                            value={position.description}
                            onChange={(e) =>
                              updatePosition(
                                position.id,
                                "description",
                                e.target.value
                              )
                            }
                            rows={2}
                            className="text-sm"
                          />
                        </div>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePosition(position.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              )}

              {positions.length > 0 && positions.length < 10 && (
                <Button
                  onClick={addPosition}
                  variant="ghost"
                  className="w-full border-2 border-dashed border-border hover:border-primary/30 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Position
                </Button>
              )}
            </div>

            {/* Preview */}
            {positions.length > 0 && (
              <div className="p-6 rounded-xl border border-border bg-secondary/30">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  Layout Preview
                </h3>
                <div
                  className={`grid gap-3 ${
                    positions.length === 1
                      ? "grid-cols-1 max-w-[120px]"
                      : positions.length <= 3
                      ? "grid-cols-3"
                      : positions.length <= 6
                      ? "grid-cols-3"
                      : "grid-cols-4"
                  }`}
                >
                  {positions.map((pos, i) => (
                    <div
                      key={pos.id}
                      className="aspect-[2/3] rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center p-2 text-center"
                    >
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mb-1">
                        {i + 1}
                      </span>
                      <span className="text-xs text-muted-foreground truncate w-full">
                        {pos.name || `Pos ${i + 1}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={!spreadName.trim() || positions.length === 0}
                className="flex-1 gap-2"
                size="lg"
              >
                <Save className="w-5 h-5" />
                {editingSpread ? "Save Changes" : "Save Spread"}
              </Button>
              {!editingSpread && positions.length > 0 && spreadName.trim() && (
                <Button
                  onClick={() => {
                    const spread: CustomSpread = {
                      id: generateId(),
                      name: spreadName.trim(),
                      description: spreadDescription.trim(),
                      positions,
                      createdAt: Date.now(),
                    };
                    onSave(spread);
                    onUseSpread(spread);
                  }}
                  variant="outline"
                  className="gap-2"
                  size="lg"
                >
                  <Play className="w-5 h-5" />
                  Save & Use
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submission Modal */}
      <AnimatePresence>
        {showSubmitModal && submittingSpread && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeSubmitModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-border bg-primary/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Share2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Submit for Featuring</h2>
                      <p className="text-sm text-muted-foreground">Share your spread with the community</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={closeSubmitModal}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {!submissionSuccess ? (
                  <>
                    {/* Spread Preview */}
                    <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                      <h3 className="font-semibold text-foreground mb-1">{submittingSpread.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {submittingSpread.positions.length} positions
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {submittingSpread.positions.map((pos, i) => (
                          <span
                            key={pos.id}
                            className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                          >
                            {i + 1}. {pos.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Creator Information */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <User className="w-4 h-4 text-primary" />
                        Creator Attribution
                      </div>
                      
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="creator-name">Your Name *</Label>
                          <Input
                            id="creator-name"
                            placeholder="How you'd like to be credited"
                            value={creatorName}
                            onChange={(e) => setCreatorName(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="creator-contact">Contact (optional)</Label>
                          <Input
                            id="creator-contact"
                            placeholder="Email, website, or social handle"
                            value={creatorContact}
                            onChange={(e) => setCreatorContact(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            For attribution purposes only - will be displayed if your spread is featured
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="creator-location">Location (optional)</Label>
                          <Input
                            id="creator-location"
                            placeholder="City, Country"
                            value={creatorLocation}
                            onChange={(e) => setCreatorLocation(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="submission-notes">Notes for Reviewers (optional)</Label>
                          <Textarea
                            id="submission-notes"
                            placeholder="Tell us about your spread - its inspiration, intended use, or any special instructions..."
                            value={submissionNotes}
                            onChange={(e) => setSubmissionNotes(e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submission Guidelines */}
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-sm">
                      <h4 className="font-semibold text-amber-800 mb-2">Submission Guidelines</h4>
                      <ul className="space-y-1 text-amber-900/80 text-xs">
                        <li>- Spreads are reviewed for quality and alignment with Adinkrarota values</li>
                        <li>- If approved, your spread will appear in the Featured Spreads section</li>
                        <li>- Full attribution will be displayed with your spread</li>
                        <li>- You retain creative ownership of your spread design</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Submission Package Created</h3>
                    <p className="text-muted-foreground mb-4">
                      Your submission file has been downloaded. Please email it to:
                    </p>
                    <p className="text-primary font-semibold mb-4">
                      spreads@adinkrarota.com
                    </p>
                    <p className="text-sm text-muted-foreground">
                      We will review your spread and notify you if it is selected for featuring.
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-border bg-secondary/30">
                {!submissionSuccess ? (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={closeSubmitModal}
                      className="flex-1 bg-transparent"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmitForReview}
                      disabled={!creatorName.trim()}
                      className="flex-1 gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Create Submission
                    </Button>
                  </div>
                ) : (
                  <Button onClick={closeSubmitModal} className="w-full">
                    Done
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
