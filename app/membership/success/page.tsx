"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getCheckoutSession } from "@/app/actions/stripe";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, Star, ArrowRight } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    async function verifyPayment() {
      if (!sessionId) {
        setStatus("error");
        return;
      }

      const result = await getCheckoutSession(sessionId);

      if (result.error || result.session?.payment_status !== "paid") {
        setStatus("error");
        return;
      }

      // Update user to full member
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Update user metadata
        await supabase.auth.updateUser({
          data: {
            account_type: "member",
            membership_date: new Date().toISOString(),
          },
        });

        // Update profile
        await supabase.from("profiles").update({
          account_type: "member",
          membership_date: new Date().toISOString(),
        }).eq("id", user.id);
      }

      setStatus("success");
    }

    verifyPayment();
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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="p-8 rounded-2xl bg-card border border-destructive/30">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Something went wrong
            </h1>
            <p className="text-muted-foreground mb-6">
              We could not verify your payment. If you were charged, please
              contact support.
            </p>
            <Button asChild>
              <Link href="/membership/checkout">Try Again</Link>
            </Button>
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
        className="relative z-10 text-center max-w-md"
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
            <h1 className="text-3xl font-bold text-gold-gradient mb-2">
              Welcome, Member
            </h1>

            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground font-serif">
                Your journey has truly begun
              </span>
              <Star className="w-5 h-5 text-primary" />
            </div>

            <p className="text-muted-foreground mb-8">
              You now have lifetime access to the full wisdom of the Adinkrarota
              Oracle. May it serve you well on your path.
            </p>

            <div className="space-y-3">
              <Button asChild className="w-full gap-2">
                <Link href="/reading">
                  Begin Your First Reading
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/portal">
                  Visit Your Portal
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          <Sparkles className="w-4 h-4 text-primary/50" />
          <p className="text-sm text-muted-foreground font-serif italic">
            The Oracle recognizes your commitment
          </p>
          <Sparkles className="w-4 h-4 text-primary/50" />
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
