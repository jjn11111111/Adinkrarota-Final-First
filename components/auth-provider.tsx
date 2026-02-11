"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export type AccountType = "guest" | "member";

export interface UserProfile {
  id: string;
  email: string;
  accountType: AccountType;
  readingsThisYear: number;
  lastReadingDate: string | null;
  yearStarted: number | null;
  birthName?: string;
  birthDate?: string;
  birthPlace?: string;
  birthCountry?: string;
  birthTime?: string;
  gender?: string;
  membershipPurchasedAt?: string;
  stripeCustomerId?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  canPerformReading: boolean;
  remainingReadings: number;
  readingMessage: string;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  recordReading: (spreadType: string, spreadName: string, cardsData: unknown, question?: string) => Promise<string | false>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchProfile = useCallback(async (userId: string, userEmail?: string): Promise<UserProfile> => {
    try {
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
          accountType: "guest",
          readingsThisYear: 0,
          lastReadingDate: null,
          yearStarted: null,
        };
      }

      // Reset yearly count if new year
      const currentYear = new Date().getFullYear();
      const readingsThisYear = data.year_started === currentYear
        ? (data.readings_this_year || 0)
        : 0;

      return {
        id: data.id,
        email: data.email || "",
        accountType: (data.account_type as AccountType) || "guest",
        readingsThisYear,
        lastReadingDate: data.last_reading_date,
        yearStarted: data.year_started,
        birthName: data.birth_name || undefined,
        birthDate: data.birth_date || undefined,
        birthPlace: data.birth_place || undefined,
        birthCountry: data.birth_country || undefined,
        birthTime: data.birth_time || undefined,
        gender: data.gender || undefined,
        membershipPurchasedAt: data.membership_purchased_at || undefined,
        stripeCustomerId: data.stripe_customer_id || undefined,
      };
    } catch (err) {
      console.error("Error fetching profile:", err);
      return {
        id: userId,
        email: userEmail || "",
        accountType: "guest",
        readingsThisYear: 0,
        lastReadingDate: null,
        yearStarted: null,
      };
    }
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      const newProfile = await fetchProfile(user.id, user.email || undefined);
      setProfile(newProfile);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      if (currentUser) {
        const userProfile = await fetchProfile(currentUser.id, currentUser.email || undefined);
        setProfile(userProfile);
      }

      setIsLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // Record a reading and return the reading ID on success, or false on failure
  const recordReading = async (
    spreadType: string,
    spreadName: string,
    cardsData: unknown,
    question?: string
  ): Promise<string | false> => {
    if (!user || !profile) return false;

    const today = new Date().toISOString().split("T")[0];
    const currentYear = new Date().getFullYear();

    // Check if allowed
    if (profile.accountType === "guest") {
      if (profile.readingsThisYear >= 7) {
        return false;
      }
    } else {
      // Member - check daily limit (1 per day)
      const lastDate = profile.lastReadingDate?.split("T")[0];
      if (lastDate === today) {
        return false;
      }
    }

    // Record the reading in the readings table (column is "cards", not "cards_data")
    const { data: readingData, error: readingError } = await supabase.from("readings").insert({
      user_id: user.id,
      spread_type: spreadType,
      spread_name: spreadName,
      cards: cardsData,
      question: question || null,
    }).select("id").single();

    if (readingError) {
      console.error("Error recording reading:", readingError);
      return false;
    }

    // Update profile counters using actual DB columns
    const newReadingsThisYear = profile.yearStarted === currentYear
      ? profile.readingsThisYear + 1
      : 1;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        readings_this_year: newReadingsThisYear,
        last_reading_date: today,
        year_started: currentYear,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating profile:", updateError);
    }

    // Refresh profile to get updated counts
    await refreshProfile();
    return readingData?.id || false;
  };

  // Calculate reading permissions based on actual DB schema
  const calculateReadingPermissions = () => {
    if (!profile) {
      return {
        canPerformReading: false,
        remainingReadings: 0,
        readingMessage: "Please sign in to perform readings",
      };
    }

    const currentYear = new Date().getFullYear();
    const today = new Date().toISOString().split("T")[0];

    if (profile.accountType === "guest") {
      // Guests: 7 readings per year
      const yearlyCount = profile.yearStarted === currentYear
        ? profile.readingsThisYear
        : 0;
      const remaining = Math.max(0, 7 - yearlyCount);
      return {
        canPerformReading: remaining > 0,
        remainingReadings: remaining,
        readingMessage: remaining > 0
          ? `${remaining} reading${remaining !== 1 ? "s" : ""} remaining this year`
          : "You have used all 7 guest readings this year. Upgrade to Member for daily readings.",
      };
    }

    // Member: 1 reading per day
    const lastDate = profile.lastReadingDate?.split("T")[0];
    const canRead = lastDate !== today;
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
