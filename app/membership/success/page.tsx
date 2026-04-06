"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getCheckoutSession } from "@/app/actions/stripe";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, Star, ArrowRight } from "lucide-react";

function checkoutSessionIsSuccessful(session: {
  status?: string | null;
  mode?: string | null;
  payment_status?: string | null;
  subscription?: string | { id?: string } | null;
}): boolean {
  if (session.status !== "complete") return false;
  const ps = session.payment_status;
  if (ps === "paid" || ps === "no_payment_required") return true;
  // Subscription checkouts: Stripe may still show `unpaid` briefly right after redirect;
  // a present subscription on a complete session means checkout finished successfully.
  if (
    session.mode === "subscription" &&
    !!session.subscription
  ) {
    return true;
  }
  return false;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function verifyPayment() {
      if (!sessionId) {
        setStatus("error");
        setErrorDetail(null);
        return;
      }

      try {
        const maxAttempts = 6;
        const delayMs = 700;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          if (cancelled) return;

          const result = await getCheckoutSession(sessionId);

          if (result.error) {
            setErrorDetail(result.error);
            setStatus("error");
            return;
          }

          const session = result.session;
          if (session && checkoutSessionIsSuccessful(session)) {
            break;
          }

          if (attempt === maxAttempts - 1) {
            setErrorDetail(null);
            setStatus("error");
            return;
          }

          await new Promise((r) => setTimeout(r, delayMs));
        }

        if (cancelled) return;

        // The webhook will handle the profile update, but we can refresh here
        // Update user metadata for immediate UI update
        const supabase = createClient();
        if (!supabase) {
          setErrorDetail(null);
          setStatus("error");
          return;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          await supabase.auth.updateUser({
            data: {
              account_type: "member",
            },
          });
        }

        setStatus("success");
      } catch {
        setErrorDetail(null);
        setStatus("error");
      }
    }

    verifyPayment();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-primary mb-4">
            Verifying your membership...
          </div>
          <Sparkles className="w-8 h-8 text-primary animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (status === "error") {
    const signInHint =
      errorDetail === "Please sign in to continue" ||
      errorDetail === "Unauthorized";

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="p-8 rounded-2xl bg-card border border-destructive/30">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Something went wrong
            </h1>
            {signInHint ? (
              <p className="text-muted-foreground mb-6">
                Your payment may have gone through, but we could not match this
                page to your signed-in account. Sign in with the same account
                you used for checkout, then open this page again from your
                email receipt or try membership from the portal.
              </p>
            ) : (
              <p className="text-muted-foreground mb-6">
                We could not verify your payment yet. If you were charged,
                please contact support. You can also wait a moment and refresh
                this page.
              </p>
            )}
            <div className="flex flex-col gap-2">
              {signInHint && sessionId ? (
                <Button asChild>
                  <Link
                    href={`/auth/login?next=${encodeURIComponent(
                      `/membership/success?session_id=${sessionId}`,
                    )}`}
                  >
                    Sign in
                  </Link>
                </Button>
              ) : signInHint ? (
                <Button asChild>
                  <Link href="/auth/login">Sign in</Link>
                </Button>
              ) : null}
              <Button asChild variant={signInHint ? "outline" : "default"}>
                <Link href="/membership/checkout">Try Again</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center max-w-lg"
      >
        <div className="p-8 rounded-2xl bg-card border border-primary/30">
          {/* Success icon with animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 mb-6"
          >
            <CheckCircle className="w-12 h-12 text-primary" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-3xl font-bold text-gold-gradient mb-3">
              Thank You for Your Support
            </h1>

            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-5 h-5 text-primary" />
              <span className="text-foreground font-serif text-lg">
                Welcome to Monthly Membership
              </span>
              <Star className="w-5 h-5 text-primary" />
            </div>

            <p className="text-muted-foreground mb-6">
              Your commitment to this journey means everything. You now have 
              full access to the wisdom of the Adinkrarota deck. Your subscription 
              will renew monthly, and you can cancel anytime.
            </p>

            {/* What's Unlocked */}
            <div className="bg-secondary/30 rounded-xl p-5 mb-6 text-left">
              <h3 className="font-semibold text-foreground mb-3 text-sm text-center">
                What you have unlocked:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Daily readings (1 per day)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">AI-powered interpretations</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Reading history and journaling</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Custom spread builder</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Birth chart integration</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Cancel anytime</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full gap-2">
                <Link href="/portal">
                  Enter Your Portal
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full bg-transparent gap-2">
                <Link href="/reading">
                  <Sparkles className="w-4 h-4" />
                  Begin Your First Reading
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Decorative footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <div className="flex items-center justify-center gap-4 mb-2">
            <Sparkles className="w-4 h-4 text-primary/50" />
            <p className="text-sm text-muted-foreground font-serif italic">
              May the wisdom of the ancestors guide your path
            </p>
            <Sparkles className="w-4 h-4 text-primary/50" />
          </div>
          <p className="text-xs text-muted-foreground/60">
            A receipt has been sent to your email address
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function MembershipSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-pulse text-primary">Loading...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
