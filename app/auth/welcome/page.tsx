"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Star, 
  BookOpen, 
  ArrowRight, 
  Shield,
  Calendar,
  Heart,
  CheckCircle
} from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/auth/login");
        return;
      }
      
      const name = user.user_metadata?.birth_name || user.email?.split("@")[0] || "Seeker";
      setUserName(name);
      setIsMember(user.user_metadata?.account_type === "member");
    }
    loadUser();
  }, [router]);

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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-6"
        >
          <Image
            src="/images/portal-logo.png"
            alt="Adinkrarota"
            width={100}
            height={100}
            className="opacity-80"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-2xl bg-card border border-primary/20 text-center"
        >
          {/* Welcome header */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6"
          >
            <CheckCircle className="w-10 h-10 text-primary" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-3xl font-bold text-gold-gradient mb-2">
              Welcome, {userName}
            </h1>
            <p className="text-lg text-foreground font-serif mb-2">
              Your email has been verified
            </p>
            <p className="text-muted-foreground mb-8">
              You are now part of the Adinkrarota community. 
              We are honored to guide you on this journey of self-discovery.
            </p>
          </motion.div>

          {/* What you can do */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid md:grid-cols-3 gap-4 mb-8"
          >
            <div className="p-4 rounded-xl bg-secondary/30 border border-border">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground text-sm mb-1">Get Readings</h3>
              <p className="text-xs text-muted-foreground">
                {isMember ? "1 reading per day, forever" : "7 free readings per year"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/30 border border-border">
              <BookOpen className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground text-sm mb-1">Study the Deck</h3>
              <p className="text-xs text-muted-foreground">
                78 cards blending Tarot and Adinkra
              </p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/30 border border-border">
              <Heart className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground text-sm mb-1">AI Wisdom</h3>
              <p className="text-xs text-muted-foreground">
                Personalized interpretations
              </p>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <Button asChild className="w-full gap-2" size="lg">
              <Link href="/portal">
                Enter Your Portal
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            <div className="flex gap-3">
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/reading">
                  <Sparkles className="w-4 h-4 mr-2" />
                  First Reading
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/guidebook">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Guidebook
                </Link>
              </Button>
            </div>

            {!isMember && (
              <div className="pt-4 border-t border-border mt-4">
                <p className="text-sm text-muted-foreground mb-3">
                  Want unlimited access? Upgrade to Lifetime Membership
                </p>
                <Button asChild variant="secondary" className="w-full gap-2">
                  <Link href="/membership/checkout">
                    <Star className="w-4 h-4" />
                    Become a Member - $9.99 one-time
                  </Link>
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-3">
            <Shield className="w-4 h-4 text-primary/50" />
            <p className="text-xs text-muted-foreground">
              Your data is protected. We never sell or share your information.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground/60">
            <Sparkles className="w-3 h-3" />
            <span className="text-xs font-serif italic">
              Where ancestral wisdom meets modern insight
            </span>
            <Sparkles className="w-3 h-3" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
