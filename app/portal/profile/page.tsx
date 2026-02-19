"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Star,
  Shield,
  Save,
  Pencil,
} from "lucide-react";

interface ProfileData {
  id: string;
  email: string;
  account_type: string;
  birth_name: string | null;
  birth_date: string | null;
  birth_time: string | null;
  birth_place: string | null;
  birth_country: string | null;
  gender: string | null;
  membership_purchased_at: string | null;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  // Guard against unconfigured Supabase
  useEffect(() => { if (!supabase) router.push("/auth/login"); }, [supabase, router]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    birth_name: "",
    birth_date: "",
    birth_time: "",
    birth_place: "",
    birth_country: "",
    gender: "",
  });

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error loading profile:", error);
      } else if (data) {
        setProfile(data);
        setForm({
          birth_name: data.birth_name || "",
          birth_date: data.birth_date || "",
          birth_time: data.birth_time || "",
          birth_place: data.birth_place || "",
          birth_country: data.birth_country || "",
          gender: data.gender || "",
        });
      }
      setLoading(false);
    }
    loadProfile();
  }, [router, supabase]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        birth_name: form.birth_name || null,
        birth_date: form.birth_date || null,
        birth_time: form.birth_time || null,
        birth_place: form.birth_place || null,
        birth_country: form.birth_country || null,
        gender: form.gender || null,
      })
      .eq("id", profile.id);

    if (!error) {
      setProfile({
        ...profile,
        birth_name: form.birth_name || null,
        birth_date: form.birth_date || null,
        birth_time: form.birth_time || null,
        birth_place: form.birth_place || null,
        birth_country: form.birth_country || null,
        gender: form.gender || null,
      });
      setEditing(false);
    } else {
      console.error("Error saving profile:", error);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary font-serif">
          Loading your profile...
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const isMember = profile.account_type === "member";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/portal">
              <ArrowLeft className="w-4 h-4" />
              Portal
            </Link>
          </Button>
          <h1 className="text-lg font-bold text-gold-gradient">
            Birth Chart Profile
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-card border border-border"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-foreground font-semibold">{profile.email}</p>
              <div className="flex items-center gap-2 mt-1">
                {isMember ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs">
                    <Star className="w-3 h-3" />
                    Lifetime Member
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs">
                    <Shield className="w-3 h-3" />
                    Guest
                  </span>
                )}
                {profile.membership_purchased_at && (
                  <span className="text-xs text-muted-foreground">
                    since{" "}
                    {new Date(profile.membership_purchased_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {!isMember && (
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Upgrade for daily readings and all features
              </p>
              <Button asChild size="sm" className="gap-2">
                <Link href="/membership/checkout">
                  <Star className="w-4 h-4" />
                  Upgrade - $9.99
                </Link>
              </Button>
            </div>
          )}
        </motion.div>

        {/* Birth Chart Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-card border border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              Birth Chart Information
            </h2>
            {!editing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
                className="gap-2 bg-transparent"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditing(false);
                    setForm({
                      birth_name: profile.birth_name || "",
                      birth_date: profile.birth_date || "",
                      birth_time: profile.birth_time || "",
                      birth_place: profile.birth_place || "",
                      birth_country: profile.birth_country || "",
                      gender: profile.gender || "",
                    });
                  }}
                  className="bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-6 font-serif">
            Your birth information enhances AI readings with astrological context.
            This data is encrypted and never shared.
          </p>

          <div className="grid gap-6">
            {/* Birth Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <User className="w-4 h-4 text-muted-foreground" />
                Birth Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={form.birth_name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, birth_name: e.target.value }))
                  }
                  placeholder="Full name at birth"
                  className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              ) : (
                <p className="text-foreground p-3 rounded-lg bg-muted/30">
                  {profile.birth_name || (
                    <span className="text-muted-foreground italic">Not provided</span>
                  )}
                </p>
              )}
            </div>

            {/* Birth Date & Time */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  Birth Date
                </label>
                {editing ? (
                  <input
                    type="date"
                    value={form.birth_date}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, birth_date: e.target.value }))
                    }
                    className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                ) : (
                  <p className="text-foreground p-3 rounded-lg bg-muted/30">
                    {profile.birth_date ? (
                      new Date(profile.birth_date + "T00:00:00").toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )
                    ) : (
                      <span className="text-muted-foreground italic">Not provided</span>
                    )}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Birth Time
                </label>
                {editing ? (
                  <input
                    type="time"
                    value={form.birth_time}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, birth_time: e.target.value }))
                    }
                    className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                ) : (
                  <p className="text-foreground p-3 rounded-lg bg-muted/30">
                    {profile.birth_time || (
                      <span className="text-muted-foreground italic">Not provided</span>
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Birth Place & Country */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Birth Place (City)
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={form.birth_place}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, birth_place: e.target.value }))
                    }
                    placeholder="City of birth"
                    className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                ) : (
                  <p className="text-foreground p-3 rounded-lg bg-muted/30">
                    {profile.birth_place || (
                      <span className="text-muted-foreground italic">Not provided</span>
                    )}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  Birth Country
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={form.birth_country}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, birth_country: e.target.value }))
                    }
                    placeholder="Country of birth"
                    className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                ) : (
                  <p className="text-foreground p-3 rounded-lg bg-muted/30">
                    {profile.birth_country || (
                      <span className="text-muted-foreground italic">Not provided</span>
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Gender
              </label>
              {editing ? (
                <select
                  value={form.gender}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, gender: e.target.value }))
                  }
                  className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p className="text-foreground p-3 rounded-lg bg-muted/30 capitalize">
                  {profile.gender || (
                    <span className="text-muted-foreground italic normal-case">
                      Not provided
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Data Protection Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-secondary/50 border border-border flex items-start gap-3"
        >
          <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">
              Your birth data is protected with encryption and never shared.
              You can edit or delete this information at any time.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
