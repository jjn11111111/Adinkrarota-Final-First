"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  RefreshCw,
  CircleDot,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STEPS = [
  { id: 0, label: "Situation" },
  { id: 1, label: "Polarity" },
  { id: 2, label: "Transits" },
  { id: 3, label: "Neutral node" },
] as const;

export interface SpinCycleFields {
  cycleTitle: string;
  situation: string;
  fulfillmentPole: string;
  anxietyPole: string;
  natalProfile: string;
  transitContext: string;
}

const emptyFields: SpinCycleFields = {
  cycleTitle: "",
  situation: "",
  fulfillmentPole: "",
  anxietyPole: "",
  natalProfile: "",
  transitContext: "",
};

function trimSnippet(text: string, max: number): string {
  const t = text.trim();
  if (!t) return "";
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trim()}…`;
}

export function buildSpinSynthesis(
  f: SpinCycleFields,
  opts?: { ephemerisBlock?: string },
): {
  headline: string;
  polarityBridge: string;
  transitLayer: string;
  neutralNode: string;
  practices: string[];
} {
  const title = f.cycleTitle.trim() || "This cycle";
  const situation = f.situation.trim();
  const fulfill = f.fulfillmentPole.trim();
  const anxiety = f.anxietyPole.trim();
  const natal = f.natalProfile.trim();
  const transits = f.transitContext.trim();

  const headline =
    situation.length > 0
      ? `${title}: ${trimSnippet(situation, 140)}`
      : `${title} — name the tension between what calls you forward and what unsettles you.`;

  let polarityBridge: string;
  if (fulfill && anxiety) {
    polarityBridge = `Your wheel spins between two truths: the pull toward ${trimSnippet(fulfill, 120)} and the weight of ${trimSnippet(anxiety, 120)}. Neither pole is “wrong”; they are the rim and the hub of the same rotation.`;
  } else if (fulfill || anxiety) {
    polarityBridge =
      "Sketch both poles explicitly—the bright pull and the heavy drag—so the wheel has a full turn. One-sided focus makes the spin feel like chaos instead of a cycle.";
  } else {
    polarityBridge =
      "Name the two poles: what this situation promises or activates in you, and what it threatens or depletes. That pair is your personal Wheel of Fortune: motion between gain and cost.";
  }

  let transitLayer: string;
  if (transits && natal) {
    transitLayer = `Against your baseline tone (${trimSnippet(natal, 100)}), the current weather reads as: ${trimSnippet(transits, 160)}. The useful question is where those layers agree, clash, or ask for a slower tempo—not which side “wins.”`;
  } else if (transits) {
    transitLayer = `Present transits and timing: ${trimSnippet(transits, 220)}. Treat this as moving sky over steady ground: notice pace, pressure, and where you need support, not just insight.`;
  } else if (natal) {
    transitLayer = `You’ve named your natal / numerological tone (${trimSnippet(natal, 120)}). Add a few words on what’s moving now (dates, seasons, major life events) so the neutral node can sit between chart and moment.`;
  } else {
    transitLayer =
      "Add both a natal snapshot (Sun, Moon, rising, life path, or how you typically handle change) and what’s astrologically or practically “in motion” now. The neutral node lives in the overlap.";
  }

  const ephemeris = opts?.ephemerisBlock?.trim();
  if (ephemeris) {
    transitLayer = `${transitLayer}\n\n[Ephemeris — tropical, geocentric; MIT Astronomy Engine]\n${ephemeris}`;
  }

  const neutralNode =
    fulfill && anxiety
      ? `Hold a third position: protect the fulfillment (${trimSnippet(fulfill, 80)}) while honoring the anxiety as a signal (${trimSnippet(anxiety, 80)}), not a verdict. The “child” of the question is the sustainable pace that lets the dream land without burning the body.`
      : `The neutral node is not numbness—it’s a workable rhythm: enough structure to feel safe, enough openness to stay true to the opportunity. Fill both poles above to tighten this into your specific spell of focus.`;

  const practices: string[] = [];
  if (fulfill && anxiety) {
    practices.push(
      `Weekly anchor: one small ritual that reinforces “${trimSnippet(fulfill, 60)}” without pretending “${trimSnippet(anxiety, 60)}” doesn’t exist.`,
    );
    practices.push(
      "Body first: sleep, food, and nervous-system care are the error-correction layer when the wheel speeds up.",
    );
    practices.push(
      "One boundary and one bridge: name what you won’t sacrifice yet, and one concrete step toward belonging in the new field.",
    );
  } else {
    practices.push("Write both poles in two sentences each; read them aloud as a pair.");
    practices.push("Pick one support (person, practice, or place) that stabilizes the anxiety pole without canceling the dream.");
    practices.push("Revisit this sheet after the next Moon phase or any major calendar shift you’re tracking.");
  }

  return { headline, polarityBridge, transitLayer, neutralNode, practices };
}

function toDatetimeLocalValue(d: Date): string {
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${mo}-${da}T${h}:${mi}`;
}

export function SpinCycle() {
  const [step, setStep] = useState(0);
  const [fields, setFields] = useState<SpinCycleFields>(emptyFields);
  const [copied, setCopied] = useState(false);
  const [ephemerisBlock, setEphemerisBlock] = useState("");
  const [transitEphemLocal, setTransitEphemLocal] = useState(() => toDatetimeLocalValue(new Date()));
  const [birthEphemLocal, setBirthEphemLocal] = useState("");
  const [ephemerisLoading, setEphemerisLoading] = useState(false);
  const [ephemerisError, setEphemerisError] = useState<string | null>(null);

  const synthesis = useMemo(
    () => buildSpinSynthesis(fields, { ephemerisBlock: ephemerisBlock || undefined }),
    [fields, ephemerisBlock],
  );

  const canAdvance =
    step === 0
      ? fields.situation.trim().length > 0
      : step === 1
        ? fields.fulfillmentPole.trim().length > 0 && fields.anxietyPole.trim().length > 0
        : true;

  const copySummary = async () => {
    const text = [
      `Spin Cycle — ${fields.cycleTitle.trim() || "Untitled"}`,
      "",
      "Situation:",
      fields.situation.trim(),
      "",
      "Fulfillment pole:",
      fields.fulfillmentPole.trim(),
      "",
      "Anxiety / cost pole:",
      fields.anxietyPole.trim(),
      "",
      "Natal / numerology notes:",
      fields.natalProfile.trim() || "(—)",
      "",
      "Transits / timing:",
      fields.transitContext.trim() || "(—)",
      "",
      "— Synthesis —",
      synthesis.headline,
      "",
      synthesis.polarityBridge,
      "",
      synthesis.transitLayer,
      "",
      synthesis.neutralNode,
      "",
      "Practice:",
      ...synthesis.practices.map((p) => `• ${p}`),
    ]
      .filter((s) => s !== "")
      .join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const reset = () => {
    setStep(0);
    setFields(emptyFields);
    setCopied(false);
    setEphemerisBlock("");
    setTransitEphemLocal(toDatetimeLocalValue(new Date()));
    setBirthEphemLocal("");
    setEphemerisError(null);
  };

  const fetchEphemeris = async () => {
    setEphemerisError(null);
    const transitDate = new Date(transitEphemLocal);
    if (Number.isNaN(transitDate.getTime())) {
      setEphemerisError("Transit date/time is not valid.");
      return;
    }
    const transitIso = transitDate.toISOString();
    let birthIso: string | undefined;
    if (birthEphemLocal.trim()) {
      const b = new Date(birthEphemLocal);
      if (Number.isNaN(b.getTime())) {
        setEphemerisError("Birth date/time is not valid.");
        return;
      }
      birthIso = b.toISOString();
    }
    setEphemerisLoading(true);
    try {
      const res = await fetch("/api/spin-cycle-ephemeris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transitIso, birthIso }),
      });
      const data = (await res.json()) as { combinedText?: string; error?: string };
      if (!res.ok) {
        setEphemerisError(data.error || "Could not compute positions.");
        return;
      }
      if (typeof data.combinedText === "string") {
        setEphemerisBlock(data.combinedText);
      }
    } catch {
      setEphemerisError("Network error — try again.");
    } finally {
      setEphemerisLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 pb-16">
      <header className="text-center mb-10 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 text-primary mb-3"
        >
          <RefreshCw className="w-5 h-5" aria-hidden />
          <span className="text-sm font-serif tracking-widest uppercase">Wheel X · Spin Cycle</span>
        </motion.div>
        <h1 className="text-4xl font-bold text-gold-gradient mb-4">Spin Cycle</h1>
        <p className="text-muted-foreground font-serif leading-relaxed max-w-2xl mx-auto">
          Clarify a situation, focus, or problem you want to explore. Map the two poles of your
          intention—like the Wheel of Fortune—then layer in natal tone and current transits to find a
          neutral, workable center you can actually use.
        </p>
      </header>

      {/* Step tabs */}
      <nav className="flex flex-wrap justify-center gap-2 mb-10" aria-label="Spin Cycle steps">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStep(i)}
            className={`px-3 py-1.5 rounded-full text-xs font-serif border transition-colors ${
              step === i
                ? "bg-primary/15 border-primary text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {i + 1}. {s.label}
          </button>
        ))}
      </nav>

      <div className="rounded-xl mystical-border bg-card/50 backdrop-blur-sm p-6 md:p-8">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="situation"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="cycle-title" className="font-serif">
                  Name this cycle
                </Label>
                <Input
                  id="cycle-title"
                  placeholder='e.g. "Dream job abroad — Cancer season pivot"'
                  value={fields.cycleTitle}
                  onChange={(e) => setFields((p) => ({ ...p, cycleTitle: e.target.value }))}
                  className="mt-2 font-serif"
                />
              </div>
              <div>
                <Label htmlFor="situation" className="font-serif">
                  Situation, focus, or problem
                </Label>
                <Textarea
                  id="situation"
                  placeholder="State it plainly: what is happening, what you want, and what scares or overwhelms you."
                  value={fields.situation}
                  onChange={(e) => setFields((p) => ({ ...p, situation: e.target.value }))}
                  className="mt-2 min-h-32 font-serif"
                />
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="polarity"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="space-y-6"
            >
              <p className="text-sm text-muted-foreground font-serif">
                The wheel turns between two poles. Honor both—this is how intention becomes a spell
                of focus instead of a fight with yourself.
              </p>
              <div>
                <Label htmlFor="fulfill" className="font-serif">
                  Fulfillment pole (what excites, expands, or calls you)
                </Label>
                <Textarea
                  id="fulfill"
                  placeholder="e.g. Finally stepping into the role I trained for; sense of destiny; growth."
                  value={fields.fulfillmentPole}
                  onChange={(e) => setFields((p) => ({ ...p, fulfillmentPole: e.target.value }))}
                  className="mt-2 min-h-24 font-serif"
                />
              </div>
              <div>
                <Label htmlFor="anxiety" className="font-serif">
                  Cost / anxiety pole (what drains, destabilizes, or fears you)
                </Label>
                <Textarea
                  id="anxiety"
                  placeholder="e.g. New continent, no familiar roots; fear of isolation; health and sleep slipping."
                  value={fields.anxietyPole}
                  onChange={(e) => setFields((p) => ({ ...p, anxietyPole: e.target.value }))}
                  className="mt-2 min-h-24 font-serif"
                />
              </div>
              <div>
                <Label htmlFor="natal" className="font-serif">
                  Natal & numerology tone (optional but powerful)
                </Label>
                <Textarea
                  id="natal"
                  placeholder="Sun, Moon, rising, key aspects, life path—whatever defines your default wiring under stress and joy."
                  value={fields.natalProfile}
                  onChange={(e) => setFields((p) => ({ ...p, natalProfile: e.target.value }))}
                  className="mt-2 min-h-28 font-serif"
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="transits"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="space-y-6"
            >
              <p className="text-sm text-muted-foreground font-serif">
                What is moving in the sky or in your life timeline right now? Rough dates, houses you
                watch, or outer-planet passes—all of it helps compare “weather” to “terrain.”
              </p>
              <div>
                <Label htmlFor="transits" className="font-serif">
                  Transits, timing, and life motion
                </Label>
                <Textarea
                  id="transits"
                  placeholder="e.g. Jupiter crossing MC; Saturn on IC; relocation window Q2; eclipses in family houses…"
                  value={fields.transitContext}
                  onChange={(e) => setFields((p) => ({ ...p, transitContext: e.target.value }))}
                  className="mt-2 min-h-40 font-serif"
                />
              </div>

              <div className="rounded-lg border border-border bg-card/40 p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground font-serif mb-1">
                    Free sky snapshot (this app)
                  </h3>
                  <p className="text-xs text-muted-foreground font-serif leading-relaxed">
                    Tropical geocentric longitudes via the open-source{" "}
                    <span className="text-foreground/90">astronomy-engine</span> (MIT) on your
                    Vercel function — no paid astrology API. Optional birth moment adds a second
                    table for comparison. Not for precision house work; fine for synoptic Spin
                    Cycle notes.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ephem-transit" className="font-serif text-xs">
                      Transit date &amp; time
                    </Label>
                    <Input
                      id="ephem-transit"
                      type="datetime-local"
                      value={transitEphemLocal}
                      onChange={(e) => setTransitEphemLocal(e.target.value)}
                      className="mt-1.5 font-serif"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ephem-birth" className="font-serif text-xs">
                      Birth moment (optional, local)
                    </Label>
                    <Input
                      id="ephem-birth"
                      type="datetime-local"
                      value={birthEphemLocal}
                      onChange={(e) => setBirthEphemLocal(e.target.value)}
                      className="mt-1.5 font-serif"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="font-serif gap-2"
                    disabled={ephemerisLoading}
                    onClick={() => void fetchEphemeris()}
                  >
                    {ephemerisLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                    ) : null}
                    {ephemerisLoading ? "Computing…" : "Add ephemeris to synthesis"}
                  </Button>
                  {ephemerisBlock ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="font-serif text-muted-foreground"
                      onClick={() => setEphemerisBlock("")}
                    >
                      Clear snapshot
                    </Button>
                  ) : null}
                </div>
                {ephemerisError ? (
                  <p className="text-sm text-destructive font-serif">{ephemerisError}</p>
                ) : null}
                {ephemerisBlock ? (
                  <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap max-h-48 overflow-y-auto rounded-md bg-background/60 p-3 border border-border">
                    {ephemerisBlock}
                  </pre>
                ) : null}
              </div>

              {fields.natalProfile.trim().length === 0 && (
                <p className="text-xs text-muted-foreground font-serif">
                  Tip: add natal or numerology notes on the Polarity step so the neutral node can
                  balance baseline with what’s moving now.
                </p>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="synthesis"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="space-y-6"
            >
              <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <CircleDot className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-serif font-semibold text-foreground mb-1">Bare-bones read</h2>
                  <p className="text-sm text-muted-foreground font-serif leading-relaxed">
                    This is a structural mirror from your own words. If you used the free ephemeris
                    snapshot, tropical longitudes are appended for context — still not a full
                    chart. Use it all as a focus anchor for journaling, ritual, or a reading spread.
                  </p>
                </div>
              </div>

              <section className="space-y-4 font-serif text-sm leading-relaxed">
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-primary mb-1">Headline</h3>
                  <p className="text-foreground">{synthesis.headline}</p>
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-primary mb-1">Polarity</h3>
                  <p className="text-muted-foreground">{synthesis.polarityBridge}</p>
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-primary mb-1">
                    Transits vs. natal
                  </h3>
                  <p className="text-muted-foreground">{synthesis.transitLayer}</p>
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-primary mb-1">Neutral node</h3>
                  <p className="text-foreground">{synthesis.neutralNode}</p>
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-primary mb-1">Practice</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {synthesis.practices.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              </section>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="button" variant="outline" onClick={copySummary} className="gap-2 font-serif">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied" : "Copy summary"}
                </Button>
                <Button type="button" variant="ghost" onClick={reset} className="font-serif text-muted-foreground">
                  Start over
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {step < 3 && (
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              className="font-serif gap-2"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              type="button"
              className="font-serif gap-2 bg-primary text-primary-foreground"
              disabled={!canAdvance}
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
