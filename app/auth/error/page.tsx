"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";

function suggestHostMismatchHint(reason: string | null): boolean {
  if (!reason) return false;
  const r = reason.toLowerCase();
  return (
    r.includes("code verifier") ||
    r.includes("pkce") ||
    r.includes("signal is aborted") ||
    r.includes("interrupted") ||
    r.includes("lock") && r.includes("timed out")
  );
}

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const hostHint = suggestHostMismatchHint(reason);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-md"
    >
      <div className="p-8 rounded-2xl bg-card border border-destructive/30">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/20 mb-6">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-4">
          Authentication Error
        </h1>

        <p className="text-muted-foreground mb-4">
          Something went wrong during authentication. This often happens if the
          link expired, was already used, or was opened on a different device or
          browser than where you started sign-in.
        </p>

        {reason && (
          <p className="text-sm text-foreground/90 mb-4 p-3 rounded-lg bg-muted/50 border border-border text-left break-words">
            {reason}
          </p>
        )}

        {hostHint ? (
          <div className="text-left text-sm text-muted-foreground mb-6 p-3 rounded-lg border border-border bg-secondary/20 space-y-2">
            <p className="font-medium text-foreground/90">Vercel / multiple URLs</p>
            <p>
              Password reset uses a one-time browser cookie. It only exists on the
              <strong className="text-foreground font-medium"> exact site </strong>
              where you clicked &quot;Forgot password&quot; (check the address bar),
              and only in the <strong className="text-foreground font-medium">same browser</strong> you used then.
            </p>
            <p>
              Production (<code className="text-xs bg-muted px-1 rounded">…vercel.app</code> without a long deploy hash)
              and preview URLs (<code className="text-xs bg-muted px-1 rounded">…-xxxxx.vercel.app</code>) do{" "}
              <strong className="text-foreground font-medium">not</strong> share that cookie. Request a new reset from the
              URL you will use when you open the email, and avoid opening the link inside another app&apos;s in-app browser if you started in Chrome or Safari.
            </p>
          </div>
        ) : null}

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/auth/login">Return to Login</Link>
          </Button>

          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href="/auth/forgot-password">Forgot password — send new link</Link>
          </Button>

          <Button asChild variant="outline" className="w-full gap-2 bg-transparent">
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Suspense
        fallback={
          <div className="text-center max-w-md text-muted-foreground text-sm">
            Loading…
          </div>
        }
      >
        <AuthErrorContent />
      </Suspense>
    </div>
  );
}
