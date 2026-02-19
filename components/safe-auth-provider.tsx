"use client";

import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from "react";
import type { User, SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

export type AccountType = "guest" | "member";

export interface UserProfile {
  id: string;
  email: string;
  accountType: AccountType;
  readingsThisYear: number;
  readingsToday: number;
  lastReadingDate: string | null;
  birthName?: string;
  birthDate?: string;
  birthPlace?: string;
  birthTime?: string;
  gender?: string;
  membershipPurchasedAt?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isConfigured: boolean;
  canPerformReading: boolean;
  remainingReadings: number | "unlimited";
  readingMessage: string;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  recordReading: (spreadType: string, spreadName: string, cardsData: unknown) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let _cachedClient: SupabaseClient | null = null;

function getSafeClient(): SupabaseClient | null {
  if (_cachedClient) return _cachedClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  _cachedClient = createBrowserClient(url, key);
  return _cachedClient;
}

export function SafeAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useMemo(() => getSafeClient(), []);
  const configured = !!supabase;

  const fetchProfile = async (userId: string, userEmail?: string) => {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        return {
          id: userId,
          email: userEmail || "",
          accountType: "guest" as AccountType,
          readingsThisYear: 0,
          readingsToday: 0,
          lastReadingDate: null,
        };
      }

      const currentYear = new Date().getFullYear();
      const startOfYear = `${currentYear}-01-01T00:00:00.000Z`;
      const { count: yearlyCount } = await supabase
        .from("readings")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", startOfYear);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: dailyCount } = await supabase
        .from("readings")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", today.toISOString());

      return {
        id: data.id,
        email: data.email || "",
        accountType: data.account_type as AccountType,
        readingsThisYear: yearlyCount || 0,
        readingsToday: dailyCount || 0,
        lastReadingDate: data.last_reading_date,
        birthName: data.birth_name,
        birthDate: data.birth_date,
        birthPlace: data.birth_place,
        birthTime: data.birth_time,
        gender: data.gender,
        membershipPurchasedAt: data.membership_purchased_at,
      };
    } catch {
      return {
        id: userId,
        email: userEmail || "",
        accountType: "guest" as AccountType,
        readingsThisYear: 0,
        readingsToday: 0,
        lastReadingDate: null,
      };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const p = await fetchProfile(user.id, user.email || undefined);
      if (p) setProfile(p);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      if (!supabase) { setIsLoading(false); return; }
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u);
      if (u) {
        const p = await fetchProfile(u.id, u.email || undefined);
        setProfile(p);
      }
      setIsLoading(false);
    };
    init();

    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          const p = await fetchProfile(session.user.id, session.user.email || undefined);
          setProfile(p);
        } else {
          setProfile(null);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const recordReading = async (
    spreadType: string,
    spreadName: string,
    cardsData: unknown
  ): Promise<boolean> => {
    if (!user || !profile || !supabase) return false;
    const currentYear = new Date().getFullYear();

    if (profile.accountType === "guest" && profile.readingsThisYear >= 7) return false;
    if (profile.accountType === "member" && profile.readingsToday >= 1) return false;

    const { error: readingError } = await supabase.from("readings").insert({
      user_id: user.id,
      spread_type: spreadType,
      spread_name: spreadName,
      cards: cardsData,
    });
    if (readingError) return false;

    await supabase
      .from("profiles")
      .update({
        readings_this_year: profile.readingsThisYear + 1,
        last_reading_date: new Date().toISOString().split("T")[0],
        year_started: currentYear,
      })
      .eq("id", user.id);

    await refreshProfile();
    return true;
  };

  const calcPerms = () => {
    if (!profile) {
      return {
        canPerformReading: false,
        remainingReadings: 0 as number | "unlimited",
        readingMessage: "Please sign in to perform readings",
      };
    }
    if (profile.accountType === "guest") {
      const r = Math.max(0, 7 - profile.readingsThisYear);
      return {
        canPerformReading: r > 0,
        remainingReadings: r,
        readingMessage: r > 0
          ? `${r} reading${r !== 1 ? "s" : ""} remaining this year`
          : "You have used all 7 guest readings this year. Upgrade to Member for daily readings.",
      };
    }
    const canRead = profile.readingsToday < 1;
    return {
      canPerformReading: canRead,
      remainingReadings: canRead ? 1 : 0,
      readingMessage: canRead
        ? "1 daily reading available"
        : "You have used your daily reading. Return tomorrow for more guidance.",
    };
  };

  const { canPerformReading, remainingReadings, readingMessage } = calcPerms();

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAuthenticated: !!user,
        isConfigured: configured,
        canPerformReading,
        remainingReadings,
        readingMessage,
        refreshProfile,
        signOut,
        recordReading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error("useAuth must be used within a SafeAuthProvider");
  return ctx;
}
