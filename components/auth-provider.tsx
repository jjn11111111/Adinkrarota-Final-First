"use client";

import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const configured = isSupabaseConfigured();
  const supabase = useMemo(() => configured ? createClient() : null, [configured]);

  const fetchProfile = async (userId: string, userEmail?: string) => {
    if (!supabase) return null;
    try {
      // Fetch profile data
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
        return {
          id: userId,
          email: userEmail || "",
          accountType: "guest" as AccountType,
          readingsThisYear: 0,
          readingsToday: 0,
          lastReadingDate: null,
        };
      }

      // Calculate readings this year from the readings table (accurate count)
      const currentYear = new Date().getFullYear();
      const startOfYear = `${currentYear}-01-01T00:00:00.000Z`;
      const { count: yearlyCount } = await supabase
        .from("readings")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", startOfYear);

      const readingsThisYear = yearlyCount || 0;

      // Calculate readings today from the readings table
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: dailyCount } = await supabase
        .from("readings")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", today.toISOString());

      const readingsToday = dailyCount || 0;

      return {
        id: data.id,
        email: data.email || "",
        accountType: data.account_type as AccountType,
        readingsThisYear,
        readingsToday,
        lastReadingDate: data.last_reading_date,
        birthName: data.birth_name,
        birthDate: data.birth_date,
        birthPlace: data.birth_place,
        birthTime: data.birth_time,
        gender: data.gender,
        membershipPurchasedAt: data.membership_purchased_at,
      };
    } catch (err) {
      console.error("Error fetching profile:", err);
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
      const newProfile = await fetchProfile(user.id, user.email || undefined);
      if (newProfile) {
        setProfile(newProfile);
      }
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      if (!supabase) {
        setIsLoading(false);
        return;
      }
      
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      if (currentUser) {
        const userProfile = await fetchProfile(currentUser.id, currentUser.email || undefined);
        setProfile(userProfile);
      }

      setIsLoading(false);
    };

    initAuth();

    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const userProfile = await fetchProfile(session.user.id, session.user.email || undefined);
          setProfile(userProfile);
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

    // Check if allowed
    if (profile.accountType === "guest") {
      if (profile.readingsThisYear >= 7) {
        return false;
      }
    } else {
      if (profile.readingsToday >= 1) {
        return false;
      }
    }

    // Record the reading - column is "cards" not "cards_data"
    const { error: readingError } = await supabase.from("readings").insert({
      user_id: user.id,
      spread_type: spreadType,
      spread_name: spreadName,
      cards: cardsData,
    });

    if (readingError) {
      console.error("Error recording reading:", readingError);
      return false;
    }

    // Update profile counters using correct column names
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        readings_this_year: profile.readingsThisYear + 1,
        last_reading_date: new Date().toISOString().split("T")[0],
        year_started: currentYear,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating profile:", updateError);
    }

    // Refresh profile to get accurate counts from DB
    await refreshProfile();
    return true;
  };

  // Calculate reading permissions
  const calculateReadingPermissions = () => {
    if (!profile) {
      return {
        canPerformReading: false,
        remainingReadings: 0 as number | "unlimited",
        readingMessage: "Please sign in to perform readings",
      };
    }

    if (profile.accountType === "guest") {
      const remaining = Math.max(0, 7 - profile.readingsThisYear);
      return {
        canPerformReading: remaining > 0,
        remainingReadings: remaining,
        readingMessage: remaining > 0
          ? `${remaining} reading${remaining !== 1 ? "s" : ""} remaining this year`
          : "You have used all 7 guest readings this year. Upgrade to Member for daily readings.",
      };
    }

    // Member
    const canRead = profile.readingsToday < 1;
    return {
      canPerformReading: canRead,
      remainingReadings: canRead ? 1 : 0,
      readingMessage: canRead
        ? "1 daily reading available"
        : "You have used your daily reading. Return tomorrow for more guidance.",
    };
  };

  const { canPerformReading, remainingReadings, readingMessage } = calculateReadingPermissions();

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
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
