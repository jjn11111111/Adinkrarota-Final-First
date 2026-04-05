"use client";

import React from "react"

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Eye, EyeOff, Sparkles, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleResendConfirmation = () => {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setError(AUTH_UNAVAILABLE_MESSAGE);
      return;
    }

    setResendStatus("sending");

    // Defer to next tick so UI can paint "Sending..." before async work (fixes INP)
    const redirectUrl = `${getBaseUrl()}/auth/callback`;
    supabase.auth
      .resend({
        type: "signup",
        email,
        options: { emailRedirectTo: redirectUrl },
      })
      .then(({ error }) => {
        if (error) {
          setError(error.message);
          setResendStatus("idle");
        } else {
          setResendStatus("sent");
          setError(null);
        }
      });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    if (!supabase) {
      setError(AUTH_UNAVAILABLE_MESSAGE);
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/portal");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Background pattern */}
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
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gold-gradient mb-2">Welcome Back</h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                {error}
                {error === AUTH_UNAVAILABLE_MESSAGE && (
                  <p className="mt-2 text-xs text-muted-foreground font-normal normal-case leading-snug border-t border-destructive/20 pt-2">
                    {AUTH_UNAVAILABLE_DEPLOYER_HINT}
                  </p>
                )}
                {error.includes("Email not confirmed") && (
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={resendStatus === "sending"}
                    className="block mt-2 text-primary hover:underline"
                  >
                    {resendStatus === "sending" ? "Sending..." : "Resend confirmation email"}
                  </button>
                )}
              </div>
            )}

            {resendStatus === "sent" && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-600 text-sm">
                Confirmation email sent! Please check your inbox.
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </form>

        {/* Resend confirmation for users who haven't received email */}
        <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border">
          <p className="text-xs text-muted-foreground mb-2">
            Did not receive confirmation email?
          </p>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={handleResendConfirmation}
            disabled={resendStatus === "sending" || !email}
            className="w-full"
          >
            {resendStatus === "sending" ? "Sending..." : resendStatus === "sent" ? "Email Sent!" : "Resend Confirmation Email"}
          </Button>
        </div>

        {/* Register links */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            New seeker?{" "}
            <Link href="/auth/register" className="text-primary hover:underline">
              Register as Guest
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            Ready for full access?{" "}
            <Link href="/auth/register?membership=true" className="text-primary hover:underline font-semibold">
              Become a Member
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
