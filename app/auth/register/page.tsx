"use client";

import React from "react"

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
  Shield,
  Star,
  Check,
  Info,
} from "lucide-react";
import { DATA_PLEDGE, GUEST_YEARLY_READINGS, MEMBER_FEATURES } from "@/lib/products";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMembership, setIsMembership] = useState(searchParams.get("membership") === "true");
  
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Member-only fields
  const [birthName, setBirthName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [gender, setGender] = useState("");
  
  const [acceptedPledge, setAcceptedPledge] = useState(false);
  const [showPledge, setShowPledge] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMembership(searchParams.get("membership") === "true");
  }, [searchParams]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    if (!acceptedPledge) {
      setError("Please accept the Data Protection Pledge");
      setLoading(false);
      return;
    }

    if (isMembership && (!birthName || !birthDate || !birthPlace || !gender)) {
      setError("Please complete all required member fields");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    // Use NEXT_PUBLIC_BASE_URL for the redirect, fallback to window origin
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    const redirectUrl = `${baseUrl}/auth/callback`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          account_type: isMembership ? "member_pending" : "guest",
          birth_name: isMembership ? birthName : null,
          birth_date: isMembership ? birthDate : null,
          birth_time: isMembership ? birthTime : null,
          birth_place: isMembership ? birthPlace : null,
          gender: isMembership ? gender : null,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Check if user already exists (identities will be empty array)
    if (data?.user?.identities?.length === 0) {
      setError("An account with this email already exists. Please sign in instead.");
      setLoading(false);
      return;
    }

    // Redirect based on account type
    if (isMembership) {
      router.push("/auth/register-success?membership=true");
    } else {
      router.push("/auth/register-success");
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
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
          <h1 className="text-3xl font-bold text-gold-gradient mb-2">
            {isMembership ? "Become a Member" : "Register as Guest"}
          </h1>
          <p className="text-muted-foreground font-serif">
            {isMembership
              ? "Unlock the full wisdom of the Oracle"
              : "Begin your journey with 7 readings per year"}
          </p>
        </div>

        {/* Toggle between Guest and Member */}
        <div className="flex gap-2 mb-6">
          <Button
            type="button"
            variant={!isMembership ? "default" : "outline"}
            onClick={() => setIsMembership(false)}
            className="flex-1 gap-2"
          >
            <Shield className="w-4 h-4" />
            Guest
          </Button>
          <Button
            type="button"
            variant={isMembership ? "default" : "outline"}
            onClick={() => setIsMembership(true)}
            className="flex-1 gap-2"
          >
            <Star className="w-4 h-4" />
            Member - $9.99
          </Button>
        </div>

        {/* Benefits comparison */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`p-4 rounded-xl border ${!isMembership ? "bg-primary/5 border-primary/30" : "bg-card border-border"}`}>
            <h3 className="font-semibold text-sm mb-2">Guest Access</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li className="flex items-center gap-1">
                <Check className="w-3 h-3 text-primary" />
                {GUEST_YEARLY_READINGS} readings per year
              </li>
              <li className="flex items-center gap-1">
                <Check className="w-3 h-3 text-primary" />
                Single & Three Card spreads
              </li>
              <li className="flex items-center gap-1">
                <Check className="w-3 h-3 text-primary" />
                Full Guidebook access
              </li>
              <li className="flex items-center gap-1">
                <Check className="w-3 h-3 text-primary" />
                Deck exploration
              </li>
            </ul>
          </div>
          <div className={`p-4 rounded-xl border ${isMembership ? "bg-primary/5 border-primary/30" : "bg-card border-border"}`}>
            <h3 className="font-semibold text-sm mb-2">Lifetime Member</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li className="flex items-center gap-1">
                <Check className="w-3 h-3 text-primary" />
                Daily readings forever
              </li>
              <li className="flex items-center gap-1">
                <Check className="w-3 h-3 text-primary" />
                All spreads including Celtic Cross
              </li>
              <li className="flex items-center gap-1">
                <Check className="w-3 h-3 text-primary" />
                AI Oracle interpretations
              </li>
              <li className="flex items-center gap-1">
                <Check className="w-3 h-3 text-primary" />
                Reading journal & history
              </li>
              <li className="flex items-center gap-1">
                <Check className="w-3 h-3 text-primary" />
                Birth chart integration
              </li>
            </ul>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
            {/* Email - required for all */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
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

            {/* Password fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
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
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm *</Label>
                <Input
                  id="confirm"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-background"
                />
              </div>
            </div>

            {/* Member-only fields */}
            <AnimatePresence>
              {isMembership && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <Info className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        Birth information enables astrological features
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="birthName">Birth Certificate Name *</Label>
                        <Input
                          id="birthName"
                          type="text"
                          placeholder="Name as it appears on birth certificate"
                          value={birthName}
                          onChange={(e) => setBirthName(e.target.value)}
                          className="bg-background"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="birthDate">Date of Birth *</Label>
                          <Input
                            id="birthDate"
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="birthTime">Time of Birth (optional)</Label>
                          <Input
                            id="birthTime"
                            type="time"
                            value={birthTime}
                            onChange={(e) => setBirthTime(e.target.value)}
                            className="bg-background"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="birthPlace">Place of Birth *</Label>
                        <Input
                          id="birthPlace"
                          type="text"
                          placeholder="City, Country"
                          value={birthPlace}
                          onChange={(e) => setBirthPlace(e.target.value)}
                          className="bg-background"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender *</Label>
                        <Select value={gender} onValueChange={setGender}>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="non-binary">Non-binary</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Data Protection Pledge */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="pledge"
                  checked={acceptedPledge}
                  onCheckedChange={(checked) => setAcceptedPledge(checked as boolean)}
                />
                <div className="space-y-1">
                  <Label htmlFor="pledge" className="text-sm cursor-pointer">
                    I accept the Data Protection Pledge *
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowPledge(!showPledge)}
                    className="text-xs text-primary hover:underline"
                  >
                    {showPledge ? "Hide pledge" : "Read the pledge"}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {showPledge && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 rounded-lg bg-secondary/50 border border-border text-xs text-muted-foreground whitespace-pre-wrap font-mono overflow-hidden"
                  >
                    {DATA_PLEDGE}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating your account..." : isMembership ? "Continue to Payment" : "Create Guest Account"}
            </Button>
          </div>
        </form>

        {/* Login link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
