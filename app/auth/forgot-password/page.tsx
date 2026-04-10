"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { createImplicitRecoveryClient } from "@/lib/supabase/recovery-email-client";
import { getBaseUrl } from "@/lib/site-config";
import {
  AUTH_UNAVAILABLE_DEPLOYER_HINT,
  AUTH_UNAVAILABLE_MESSAGE,
} from "@/lib/auth-copy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isAuthError } from "@supabase/supabase-js";
import { Sparkles, ArrowLeft } from "lucide-react";

/** Supabase returns e.g. "…after 11 seconds" or code over_email_send_rate_limit. */
function parseRateLimitCooldownSeconds(message: string): number | null {
  const m = message.match(/after\s+(\d+)\s*seconds?/i);
  if (m) {
    const n = parseInt(m[1], 10);
    if (!Number.isNaN(n)) return Math.min(Math.max(1, n), 3600);
  }
  if (
    /over_email_send_rate_limit|over_sms_send_rate_limit|429/i.test(message)
  ) {
    return 60;
  }
  return null;
}

function RateLimitHint() {
  return (
    <p className="mt-2 text-xs text-muted-foreground font-normal normal-case leading-snug border-t border-destructive/20 pt-2">
      Same-address email cooldown from Supabase (anti-spam). Use the countdown on the
      button, then tap once. To shorten waits while testing: Supabase Dashboard →{" "}
      <strong>Authentication → Emails</strong> → rate limits for the same user.
    </p>
  );
}

function looksLikeRecoverySendFailure(message: string): boolean {
  return /error sending recovery email|unexpected_failure|\b500\b/i.test(
    message,
  );
}

function RecoveryEmailTroubleshooting({ redirectTo }: { redirectTo: string }) {
  let origin = "";
  let onVercel = false;
  try {
    const u = new URL(redirectTo);
    origin = u.origin;
    onVercel = u.hostname.endsWith(".vercel.app");
  } catch {
    origin = "";
  }

  return (
    <>
      <p className="mt-2 text-xs text-muted-foreground font-normal normal-case leading-snug border-t border-destructive/20 pt-2">
        Supabase could not send the reset email (server-side). In almost all
        cases the dashboard shows why: open{" "}
        <strong className="text-foreground/90">Logs</strong> → filter{" "}
        <strong className="text-foreground/90">Auth</strong> (or{" "}
        <strong className="text-foreground/90">Edge</strong> / API) and read
        the latest error — often <code className="text-foreground/85">535</code>{" "}
        (SMTP) or a blocked &quot;From&quot; address.
      </p>
      <details className="mt-2 rounded-lg border border-destructive/25 bg-destructive/5 open:pb-2">
        <summary className="cursor-pointer list-none px-2 py-2 text-xs font-medium text-foreground/90 [&::-webkit-details-marker]:hidden">
          <span className="underline-offset-2 hover:underline">
            Show SMTP &amp; redirect URL steps
          </span>
        </summary>
        <div className="space-y-2 px-2 pb-2 text-xs text-muted-foreground font-normal normal-case leading-snug border-t border-destructive/15 pt-2">
          <p className="text-foreground/90 font-medium">Gmail (common fix for 535)</p>
          <p>
            Dashboard → <strong>Authentication</strong> → <strong>Emails</strong> →
            Custom SMTP. Host <code className="text-foreground/85">smtp.gmail.com</code>
            , port <code className="text-foreground/85">587</code>. Username and sender
            = the same Gmail address. Password = Google{" "}
            <strong>App password</strong> (not your normal Gmail password). See{" "}
            <code className="text-foreground/85">SUPABASE_EMAIL_SETUP.md</code>.
          </p>
          <p className="text-foreground/90 font-medium pt-1">Other SMTP providers</p>
          <p>
            SendGrid, Amazon SES, or Resend as <strong>SMTP</strong> in the same
            Supabase screen — use that provider&apos;s host, port, and credentials.
          </p>
          <p className="text-foreground/90 font-medium pt-1">Redirect URLs</p>
          <p>Only needed if logs mention an invalid redirect. Add this line:</p>
          <code className="block w-full p-2 rounded-md bg-muted text-foreground text-[11px] break-all border border-border">
            {redirectTo}
          </code>
          {onVercel && (
            <p>
              For previews, you can add{" "}
              <code className="text-foreground/85">https://*.vercel.app/**</code>
            </p>
          )}
          <p>
            Keep your real site as <strong>Site URL</strong>. Preview hosts only
            belong under Redirect URLs.
            {origin ? (
              <>
                {" "}
                This tab:{" "}
                <code className="text-foreground/85 break-all">{origin}</code>.
              </>
            ) : null}
          </p>
        </div>
      </details>
    </>
  );
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [lastRedirectTo, setLastRedirectTo] = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [cooldownLeft, setCooldownLeft] = useState(0);

  useEffect(() => {
    if (cooldownUntil == null) {
      queueMicrotask(() => {
        setCooldownLeft(0);
      });
      return;
    }
    const tick = () => {
      const left = Math.ceil((cooldownUntil - Date.now()) / 1000);
      if (left <= 0) {
        setCooldownUntil(null);
        setCooldownLeft(0);
        return;
      }
      setCooldownLeft(left);
    };
    queueMicrotask(tick);
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, [cooldownUntil]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLastRedirectTo(null);
    setLoading(true);

    const supabase = createImplicitRecoveryClient() ?? createClient();
    if (!supabase) {
      setError(AUTH_UNAVAILABLE_MESSAGE);
      setLoading(false);
      return;
    }

    // Must match Redirect URLs (e.g. https://*.vercel.app/** for previews).
    // next= forces update-password when JWT amr omits recovery (common); amr still used as fallback.
    const base = getBaseUrl().replace(/\/$/, "");
    const redirectTo = `${base}/auth/callback?next=${encodeURIComponent("/auth/update-password")}`;
    setLastRedirectTo(redirectTo);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo }
    );

    if (resetError) {
      let msg = resetError.message;
      if (isAuthError(resetError)) {
        const bits = [resetError.status, resetError.code].filter(Boolean);
        if (bits.length) {
          msg = `${msg} (${bits.join(" · ")})`;
        }
      }

      setLoading(false);
      setError(msg);
      const wait = parseRateLimitCooldownSeconds(msg);
      if (wait != null) {
        setCooldownUntil(Date.now() + wait * 1000);
      }
      return;
    }

    setLoading(false);
    setCooldownUntil(null);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/images/adinkra-pattern.png')`,
            backgroundSize: "400px",
            backgroundRepeat: "repeat",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gold-gradient mb-2">
            Reset password
          </h1>
          <p className="text-sm text-muted-foreground">
            We&apos;ll email you a link to choose a new password.
          </p>
        </div>

        {sent ? (
          <div className="p-6 rounded-2xl bg-card border border-border space-y-4 text-center">
            <p className="text-foreground text-sm">
              If an account exists for{" "}
              <span className="font-medium text-primary">{email}</span>, check
              your inbox (and spam) for the reset link.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/login">Return to Sign In</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setCooldownUntil(null);
                  }}
                  required
                  className="bg-background"
                  autoComplete="email"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                  {error}
                  {error === AUTH_UNAVAILABLE_MESSAGE && (
                    <p className="mt-2 text-xs text-muted-foreground font-normal normal-case leading-snug border-t border-destructive/20 pt-2">
                      {AUTH_UNAVAILABLE_DEPLOYER_HINT}
                    </p>
                  )}
                  {(/security purposes|only request this after|request this after \d+|over_email_send_rate_limit|429/i.test(
                    error,
                  )) && <RateLimitHint />}
                  {lastRedirectTo && looksLikeRecoverySendFailure(error) && (
                    <RecoveryEmailTroubleshooting redirectTo={lastRedirectTo} />
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading || cooldownLeft > 0}
              >
                {loading
                  ? "Sending…"
                  : cooldownLeft > 0
                    ? `Wait ${cooldownLeft}s to send again`
                    : "Send reset link"}
              </Button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
