"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { syncMembershipFromStripe } from "@/app/actions/membership-sync";

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

/** Renders portal immediately after session exists; DB profile loads in background. */
function optimisticProfileFromUser(u: User): UserProfile {
  const meta = u.user_metadata?.account_type;
  const accountType: AccountType = meta === "member" ? "member" : "guest";
  return {
    id: u.id,
    email: u.email || "",
    accountType,
    readingsThisYear: 0,
    lastReadingDate: null,
    yearStarted: null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  /** One automatic Stripe→profile check per page session for guests (avoids duplicate calls). */
  const guestMembershipSyncDone = useRef(false);

  const onPkceCallback =
    pathname === "/auth/callback" ||
    (typeof pathname === "string" && pathname.startsWith("/auth/callback/"));

  const supabase =
    isSupabaseConfigured() && !onPkceCallback ? createClient() : null;

  const fetchProfile = useCallback(async (currentUser: User): Promise<UserProfile> => {
    const userId = currentUser.id;
    const userEmail = currentUser.email || "";

    const resolveAccountType = (
      rowType: string | null | undefined,
    ): AccountType => {
      if (rowType === "member") return "member";
      if (currentUser.user_metadata?.account_type === "member") {
        return "member";
      }
      return "guest";
    };

    if (!supabase) {
      return {
        id: userId,
        email: userEmail,
        accountType: resolveAccountType(null),
        readingsThisYear: 0,
        lastReadingDate: null,
        yearStarted: null,
      };
    }

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
          email: userEmail,
          accountType: resolveAccountType(null),
          readingsThisYear: 0,
          lastReadingDate: null,
          yearStarted: null,
        };
      }

      const currentYear = new Date().getFullYear();
      const readingsThisYear = data.year_started === currentYear
        ? (data.readings_this_year || 0)
        : 0;

      return {
        id: data.id,
        email: data.email || "",
        accountType: resolveAccountType(data.account_type),
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
        email: userEmail,
        accountType: resolveAccountType(null),
        readingsThisYear: 0,
        lastReadingDate: null,
        yearStarted: null,
      };
    }
  }, [supabase]);

  const tryStripeMembershipSync = useCallback(
    async (currentUser: User, userProfile: UserProfile) => {
      if (userProfile.accountType === "member") return;
      if (
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/auth/callback")
      ) {
        return;
      }
      if (guestMembershipSyncDone.current) return;
      guestMembershipSyncDone.current = true;

      try {
        const result = await syncMembershipFromStripe();
        if (result.ok && result.status === "updated_member") {
          setProfile(await fetchProfile(currentUser));
        }
      } catch {
        /* admin/Stripe unavailable */
      }
    },
    [fetchProfile],
  );

  const refreshProfile = useCallback(async () => {
    if (user) {
      const newProfile = await fetchProfile(user);
      setProfile(newProfile);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    const skipSyncUserFetch =
      typeof window !== "undefined" &&
      window.location.pathname.startsWith("/auth/callback");

    const initAuth = async () => {
      if (skipSyncUserFetch) {
        // Avoid racing PKCE exchange on /auth/callback (getUser + exchange can stall).
        setIsLoading(false);
      } else {
        setIsLoading(true);

        let currentUser: User | null = null;
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          currentUser = user;
          setUser(currentUser);

          if (currentUser) {
            setProfile(optimisticProfileFromUser(currentUser));
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
        } finally {
          setIsLoading(false);
        }

        if (currentUser) {
          void (async () => {
            const userProfile = await fetchProfile(currentUser!);
            setProfile(userProfile);
            void tryStripeMembershipSync(currentUser!, userProfile);
          })();
        }
      }
    };

    void initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        setProfile(optimisticProfileFromUser(session.user));
        void (async () => {
          const userProfile = await fetchProfile(session.user);
          setProfile(userProfile);
          void tryStripeMembershipSync(session.user, userProfile);
        })();
      } else {
        guestMembershipSyncDone.current = false;
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    guestMembershipSyncDone.current = false;
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
  };

  const recordReading = async (
    spreadType: string,
    spreadName: string,
    cardsData: unknown,
    question?: string
  ): Promise<string | false> => {
    if (!user || !profile || !supabase) return false;

    const today = new Date().toISOString().split("T")[0];
    const currentYear = new Date().getFullYear();

    if (profile.accountType === "guest") {
      if (profile.readingsThisYear >= 7) {
        return false;
      }
    } else {
      const lastDate = profile.lastReadingDate?.split("T")[0];
      if (lastDate === today) {
        return false;
      }
    }

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

    await refreshProfile();
    return readingData?.id || false;
  };

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
