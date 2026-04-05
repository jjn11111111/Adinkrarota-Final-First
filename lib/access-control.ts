import { createClient } from "@/lib/supabase/client";
import { 
  type PremiumFeature, 
  GUEST_FEATURES, 
  MEMBER_FEATURES,
  GUEST_YEARLY_READINGS 
} from "@/lib/products";

export type AccountType = "guest" | "member" | "member_pending" | null;

export interface UserAccess {
  isAuthenticated: boolean;
  accountType: AccountType;
  features: PremiumFeature[];
  readingsRemaining: number | "unlimited";
  canDoReading: boolean;
  profile: {
    email?: string;
    birthName?: string;
    birthDate?: string;
    birthTime?: string;
    birthPlace?: string;
    gender?: string;
  } | null;
}

export async function getUserAccess(): Promise<UserAccess> {
  const supabase = createClient();
  if (!supabase) {
    return {
      isAuthenticated: false,
      accountType: null,
      features: [],
      readingsRemaining: 0,
      canDoReading: false,
      profile: null,
    };
  }
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      isAuthenticated: false,
      accountType: null,
      features: [],
      readingsRemaining: 0,
      canDoReading: false,
      profile: null,
    };
  }

  // Get profile for additional data - prefer profile over user_metadata since webhook updates profile directly
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const accountType: AccountType = (profile?.account_type as AccountType) 
    || (user.user_metadata?.account_type as AccountType) 
    || "guest";

  // Determine features based on account type
  const features = accountType === "member" ? MEMBER_FEATURES : GUEST_FEATURES;

  // Calculate readings remaining
  let readingsRemaining: number | "unlimited" = "unlimited";
  let canDoReading = true;

  if (accountType === "guest") {
    // Get yearly reading count for guests
    const startOfYear = new Date();
    startOfYear.setMonth(0, 1);
    startOfYear.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("readings")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfYear.toISOString());

    const usedReadings = count || 0;
    readingsRemaining = Math.max(0, GUEST_YEARLY_READINGS - usedReadings);
    canDoReading = readingsRemaining > 0;
  } else if (accountType === "member") {
    // Members get one reading per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("readings")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString());

    const todaysReadings = count || 0;
    canDoReading = todaysReadings < 1;
    readingsRemaining = canDoReading ? 1 : 0;
  }

  return {
    isAuthenticated: true,
    accountType,
    features,
    readingsRemaining,
    canDoReading,
    profile: {
      email: user.email,
      birthName: profile?.birth_name || user.user_metadata?.birth_name,
      birthDate: profile?.birth_date || user.user_metadata?.birth_date,
      birthTime: profile?.birth_time || user.user_metadata?.birth_time,
      birthPlace: profile?.birth_place || user.user_metadata?.birth_place,
      gender: profile?.gender || user.user_metadata?.gender,
    },
  };
}

export function hasFeature(access: UserAccess, feature: PremiumFeature): boolean {
  return access.features.includes(feature);
}

export function canAccessSpread(access: UserAccess, spreadType: string): boolean {
  // All users can access single and three card
  if (spreadType === "single" || spreadType === "three") {
    return true;
  }
  
  // Celtic cross and custom require extended_spreads feature
  return hasFeature(access, "extended_spreads");
}

export function canUseAIOracle(access: UserAccess): boolean {
  return hasFeature(access, "ai_oracle");
}

export function canSaveReadings(access: UserAccess): boolean {
  return hasFeature(access, "reading_journal");
}

export function canCreateCustomSpreads(access: UserAccess): boolean {
  return hasFeature(access, "custom_spreads");
}

export function canUseAstrology(access: UserAccess): boolean {
  return hasFeature(access, "astro_integration");
}
