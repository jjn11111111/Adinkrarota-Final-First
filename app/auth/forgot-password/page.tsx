"use client";

import React, { useState } from "react";
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

function RateLimitHint() {
  return (
    <p className="mt-2 text-xs text-muted-foreground font-normal normal-case leading-snug border-t border-destructive/20 pt-2">
      This is a normal cooldown so one address can&apos;t be spammed. Wait until
      the timer ends, then click once. While testing, you can lower{" "}
      <strong>Authentication → Emails</strong> → minimum seconds between emails to
      the same user.
    </p>
  );
}

function RecoveryEmailHint({ redirectTo }: { redirectTo: string }) {
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
    <div className="mt-2 text-xs text-muted-foreground font-normal normal-case leading-snug border-t border-destructive/20 pt-2 space-y-2">
      <p className="text-foreground/95 font-medium">
        Custom SMTP (Resend, SendGrid, etc.) — check this first
      </p>
      <p>
        Auth logs often show{" "}
        <code className="text-foreground/90">535 Authentication credentials invalid</code>
        : wrong SMTP password (e.g. paste a fresh Resend API key as the
        password; user <code className="text-foreground/90">resend</code>), or a
        &quot;From&quot; address your provider does not allow. Fix under{" "}
        <strong>Authentication → Emails</strong> (SMTP), save, then try again.
      </p>
      <p className="text-foreground/95 font-medium pt-2">
        Redirect URLs (if SMTP is already working)
      </p>
      <p>
        Authentication → URL Configuration → <strong>Redirect URLs</strong> —
        allow the callback for this tab:
      </p>
      <code className="block w-full p-2 rounded-md bg-muted text-foreground text-[11px] break-all border border-border">
        {redirectTo}
      </code>
      {onVercel && (
        <>
          <p>
            <strong>Vercel preview</strong> hostnames change each deploy. Add
            (copy exactly — <code className="text-foreground/90">*</code> then{" "}
            <code className="text-foreground/90">-.</code> then{" "}
            <code className="text-foreground/90">vercel.app/**</code>):
          </p>
          <code className="block w-full p-2 rounded-md bg-muted text-foreground text-[11px] break-all border border-border tracking-wide">
            https://*-.vercel.app/**
          </code>
          <p>
            Or use Forgot password on your stable <strong>production</strong>{" "}
            URL only.
          </p>
        </>
      )}
      <p>
        Keep <strong>Site URL</strong> as your main production origin; put
        preview origins in <strong>Redirect URLs</strong> only.
        {origin ? (
          <>
            {" "}
            Example preview origin:{" "}
            <code className="text-foreground/90">{origin}</code>.
          </>
        ) : null}
      </p>
      <p>
        If the callback URL here does not match the address bar, fix or remove{" "}
        <code className="text-foreground/90">NEXT_PUBLIC_BASE_URL</code> in
        Vercel and redeploy.
      </p>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [lastRedirectTo, setLastRedirectTo] = useState<string | null>(null);

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

    // Must match Redirect URLs (wildcard https://*-.vercel.app/** covers ?next=...).
    // next= forces update-password when JWT amr omits recovery (common); amr still used as fallback.
    const base = getBaseUrl().replace(/\/$/, "");
    const redirectTo = `${base}/auth/callback?next=${encodeURIComponent("/auth/update-password")}`;
    setLastRedirectTo(redirectTo);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo }
    );

    setLoading(false);

    if (resetError) {
      let msg = resetError.message;
      if (isAuthError(resetError)) {
        const bits = [resetError.status, resetError.code].filter(Boolean);
        if (bits.length) {
          msg = `${msg} (${bits.join(" · ")})`;
        }
      }
      setError(msg);
      return;
    }

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
                  onChange={(e) => setEmail(e.target.value)}
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
                  {/security purposes|only request this after|request this after \d+/i.test(
                    error,
                  ) && <RateLimitHint />}
                  {/error sending recovery email/i.test(error) &&
                    lastRedirectTo && <RecoveryEmailHint redirectTo={lastRedirectTo} />}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending…" : "Send reset link"}
              </Button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
