"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
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

          <p className="text-muted-foreground mb-6">
            Something went wrong during authentication. This may happen if your
            verification link has expired or was already used.
          </p>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/auth/login">
                Return to Login
              </Link>
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
    </div>
  );
}
