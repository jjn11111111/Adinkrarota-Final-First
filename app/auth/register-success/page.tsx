"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Star, Sparkles } from "lucide-react";

function RegisterSuccessContent() {
  const searchParams = useSearchParams();
  const isMembership = searchParams.get("membership") === "true";

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
        className="w-full max-w-md relative z-10 text-center"
      >
        <div className="p-8 rounded-2xl bg-card border border-border">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            Check Your Email
          </h1>

          <div className="flex items-center justify-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-primary" />
            <p className="text-muted-foreground">
              We sent you a confirmation link
            </p>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Click the link in your email to verify your account and{" "}
            {isMembership
              ? "continue to complete your membership."
              : "begin your journey with the Oracle."}
          </p>

          {isMembership && (
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Membership Pending</span>
              </div>
              <p className="text-xs text-muted-foreground">
                After verifying your email, you will be directed to complete your
                $9.99 lifetime membership payment.
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/auth/login">
                Return to Login
              </Link>
            </Button>

            <p className="text-xs text-muted-foreground">
              Did not receive the email? Check your spam folder or{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                try again
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative element */}
        <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-serif italic">The Oracle awaits your return</span>
          <Sparkles className="w-4 h-4" />
        </div>
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
