"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { AUTH_UNAVAILABLE_MESSAGE } from "@/lib/auth-copy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Mail, Star, Sparkles, BookOpen, Shield, Heart } from "lucide-react";

function RegisterSuccessContent() {
  const searchParams = useSearchParams();
  const isMembership = searchParams.get("membership") === "true";
  const emailFromUrl = searchParams.get("email") ?? "";
  const [email, setEmail] = useState(emailFromUrl);
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [resendError, setResendError] = useState<string | null>(null);

  const handleResendConfirmation = async () => {
    const emailToUse = email.trim();
    if (!emailToUse) {
      setResendError("Please enter your email address");
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setResendError(AUTH_UNAVAILABLE_MESSAGE);
      return;
    }

    setResendStatus("sending");
    setResendError(null);

    const { getBaseUrl } = await import("@/lib/site-config");
    const redirectUrl = `${getBaseUrl()}/auth/callback`;

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: emailToUse,
      options: { emailRedirectTo: redirectUrl },
    });

    if (error) {
      setResendError(error.message);
      setResendStatus("error");
    } else {
      setResendStatus("sent");
    }
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <div className="w-28 h-28 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-14 h-14 text-primary" />
          </div>
        </motion.div>

        <div className="p-8 rounded-2xl bg-card border border-primary/20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6 mx-auto"
          >
            <CheckCircle className="w-10 h-10 text-green-500" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-gold-gradient mb-3">
              Thank You for Joining
            </h1>

            <p className="text-lg text-foreground font-serif mb-2">
              Welcome to the Adinkrarota community
            </p>

            <div className="flex items-center justify-center gap-2 mb-6">
              <Mail className="w-5 h-5 text-primary" />
              <p className="text-muted-foreground">
                A confirmation email is on its way
              </p>
            </div>
          </motion.div>

          {/* What to expect */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-secondary/30 rounded-xl p-5 mb-6"
          >
            <h3 className="font-serif text-foreground mb-4 text-base text-center">
              What happens next
            </h3>
            <ol className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">1</span>
                <span className="pt-0.5">Check your email inbox (and spam folder) for the confirmation link</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">2</span>
                <span className="pt-0.5">Click the link to verify your account</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">3</span>
                <span className="pt-0.5">
                  {isMembership
                    ? "Complete your membership payment to unlock full access"
                    : "Sign in and begin your journey with the Adinkrarota deck"}
                </span>
              </li>
            </ol>
          </motion.div>

          {isMembership ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 rounded-xl bg-primary/10 border border-primary/30 mb-6"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Membership Awaits</span>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                After verifying your email, you will complete your $2.22/month subscription 
                for full access to all premium features. Cancel anytime.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 rounded-xl bg-secondary/50 border border-border mb-6"
            >
              <h4 className="font-serif text-foreground text-sm mb-3 text-center">
                As a guest, you will have access to
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>7 free readings per year</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Full guidebook access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Your data protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>AI interpretations</span>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <Button asChild className="w-full">
              <Link href="/auth/login">
                Return to Sign In
              </Link>
            </Button>

            {/* Resend confirmation - for users who didn't receive the email */}
            <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border">
              <p className="text-sm text-muted-foreground mb-3">
                Did not receive the confirmation email?
              </p>
              <div className="flex flex-col gap-2">
                <Label htmlFor="resend-email" className="text-xs">Your email</Label>
                <Input
                  id="resend-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResendConfirmation}
                  disabled={resendStatus === "sending"}
                  className="w-full"
                >
                  {resendStatus === "sending" ? "Sending..." : resendStatus === "sent" ? "Email sent! Check your inbox" : "Resend confirmation email"}
                </Button>
                {resendError && <p className="text-xs text-destructive">{resendError}</p>}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Check your spam or promotions folder</p>
            </div>
          </motion.div>
        </div>

        {/* Decorative footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <Sparkles className="w-4 h-4 text-primary/50" />
            <span className="text-sm font-serif italic">Where Tarot wisdom meets Adinkra symbolism</span>
            <Sparkles className="w-4 h-4 text-primary/50" />
          </div>
          <p className="text-xs text-muted-foreground/60">
            We are honored to have you join our community
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function RegisterSuccessPage() {
  return (
    <Suspense fallback={null}>
      <RegisterSuccessContent />
    </Suspense>
  );
}
