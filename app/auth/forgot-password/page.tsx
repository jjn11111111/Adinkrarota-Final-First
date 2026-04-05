"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { getBaseUrl } from "@/lib/site-config";
import {
  AUTH_UNAVAILABLE_DEPLOYER_HINT,
  AUTH_UNAVAILABLE_MESSAGE,
} from "@/lib/auth-copy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowLeft } from "lucide-react";

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

    const supabase = createClient();
    if (!supabase) {
      setError(AUTH_UNAVAILABLE_MESSAGE);
      setLoading(false);
      return;
    }

    // Must match an entry in Supabase → Auth → URL Configuration → Redirect URLs.
    // Query strings are easy to misconfigure; recovery is detected in /auth/callback via JWT amr.
    const redirectTo = `${getBaseUrl().replace(/\/$/, "")}/auth/callback`;
    setLastRedirectTo(redirectTo);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo }
    );

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
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
                  {/recovery email/i.test(error) && lastRedirectTo && (
                    <div className="mt-2 text-xs text-muted-foreground font-normal normal-case leading-snug border-t border-destructive/20 pt-2 space-y-2">
                      <p>
                        In Supabase → Authentication → URL Configuration, add this
                        exact URL under <strong>Redirect URLs</strong> (or use a
                        wildcard like <code className="text-foreground/90">https://your-domain.com/**</code>
                        ):
                      </p>
                      <code className="block w-full p-2 rounded-md bg-muted text-foreground text-[11px] break-all border border-border">
                        {lastRedirectTo}
                      </code>
                      <p>
                        Set <strong>Site URL</strong> to your app origin (no path), e.g.{" "}
                        <code className="text-foreground/90">
                          {(() => {
                            try {
                              return new URL(lastRedirectTo).origin;
                            } catch {
                              return "https://your-production-domain";
                            }
                          })()}
                        </code>
                        .
                      </p>
                      <p>
                        If the first URL is not the site you are using, fix or remove{" "}
                        <code className="text-foreground/90">NEXT_PUBLIC_BASE_URL</code>{" "}
                        in Vercel (then redeploy). If URLs are correct, check custom SMTP
                        under Authentication → Emails.
                      </p>
                    </div>
                  )}
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
