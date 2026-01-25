"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export type AccountType = "guest" | "member";

export interface UserProfile {
  id: string;
  email: string;
  accountType: AccountType;
  readingsThisYear: number;
  readingsToday: number;
  lastReadingDate: string | null;
  displayName?: string;
  birthName?: string;
  birthDate?: string;
  birthPlace?: string;
  birthTime?: string;
  gender?: string;
  memberSince?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
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
  const supabase = createClient();

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    // Calculate readings today
    const today = new Date().toISOString().split("T")[0];
    const lastReadingDate = data.last_reading_date?.split("T")[0];
    const readingsToday = lastReadingDate === today ? data.readings_today : 0;

    // Calculate readings this year
    const currentYear = new Date().getFullYear();
    const yearResetDate = data.year_reset_date?.split("-")[0];
    const readingsThisYear = yearResetDate === String(currentYear) ? data.readings_this_year : 0;

    return {
      id: data.id,
      email: data.email || "",
      accountType: data.account_type as AccountType,
      readingsThisYear,
      readingsToday,
      lastReadingDate: data.last_reading_date,
      displayName: data.display_name,
      birthName: data.birth_name,
      birthDate: data.birth_date,
      birthPlace: data.birth_place,
      birthTime: data.birth_time,
      gender: data.gender,
      memberSince: data.member_since,
    };
  };

  const refreshProfile = async () => {
    if (user) {
      const newProfile = await fetchProfile(user.id);
      if (newProfile) {
        setProfile(newProfile);
      }
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      if (currentUser) {
        const userProfile = await fetchProfile(currentUser.id);
        setProfile(userProfile);
      }

      setIsLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const recordReading = async (
    spreadType: string,
    spreadName: string,
    cardsData: unknown
  ): Promise<boolean> => {
    if (!user || !profile) return false;

    const today = new Date().toISOString().split("T")[0];
    const currentYear = new Date().getFullYear();

    // Check if allowed
    if (profile.accountType === "guest") {
      if (profile.readingsThisYear >= 7) {
        return false; // Exceeded yearly limit
      }
    } else {
      // Member - check daily limit
      if (profile.readingsToday >= 1) {
        return false; // Already did reading today
      }
    }

    // Record the reading
    const { error: readingError } = await supabase.from("readings").insert({
      user_id: user.id,
      spread_type: spreadType,
      spread_name: spreadName,
      cards_data: cardsData,
    });

    if (readingError) {
      console.error("Error recording reading:", readingError);
      return false;
    }

    // Update profile counters
    const lastReadingDate = profile.lastReadingDate?.split("T")[0];
    const yearResetDate = profile.lastReadingDate?.split("-")[0];

    const newReadingsToday = lastReadingDate === today ? profile.readingsToday + 1 : 1;
    const newReadingsThisYear = yearResetDate === String(currentYear) 
      ? profile.readingsThisYear + 1 
      : 1;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        readings_today: newReadingsToday,
        readings_this_year: newReadingsThisYear,
        last_reading_date: new Date().toISOString(),
        year_reset_date: `${currentYear}-01-01`,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating profile:", updateError);
    }

    // Refresh profile
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
