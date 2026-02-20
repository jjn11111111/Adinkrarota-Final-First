export interface Product {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  features: string[];
}

// Adinkrarota Economy Offerings
export const PRODUCTS: Product[] = [
  {
    id: "monthly-membership",
    name: "Monthly Membership",
    description: "Access to the Adinkrarota Oracle - a monthly subscription",
    priceInCents: 222, // $2.22/month
    features: [
      "Daily single card readings (unlimited)",
      "Access to all extended spreads (Celtic Cross, 5+ cards)",
      "AI Oracle Universal Wisdom interpretations",
      "Reading journal with full history",
      "Custom spread creation and saving",
      "Astrological birth chart integration",
      "Synastry readings with others",
      "Priority access to new features",
      "Your data protected with strictest security",
    ],
  },
];

// Premium feature flags
export type PremiumFeature = 
  | "extended_spreads"      // Celtic Cross and 5+ card spreads
  | "ai_oracle"             // AI interpretation
  | "reading_journal"       // Save and review readings
  | "custom_spreads"        // Create custom spreads
  | "astro_integration"     // Birth chart features
  | "synastry"              // Relationship readings
  | "unlimited_daily";      // Daily reading (vs 7/year for guests)

// Features available to each tier
export const GUEST_FEATURES: PremiumFeature[] = [];

export const MEMBER_FEATURES: PremiumFeature[] = [
  "extended_spreads",
  "ai_oracle", 
  "reading_journal",
  "custom_spreads",
  "astro_integration",
  "synastry",
  "unlimited_daily",
];

// Reading limits
export const GUEST_YEARLY_READINGS = 7;
export const MEMBER_DAILY_READINGS = 1; // Per day, unlimited over time

// Data protection pledge
export const DATA_PLEDGE = `
ADINKRAROTA DATA PROTECTION PLEDGE

Your information is protected. We pledge:

1. Your personal data will NEVER be sold, traded, or shared with third parties.

2. Your birth information and readings are encrypted and protected with 
   industry-leading security measures.

3. We will NEVER share your data except:
   - When you explicitly request it
   - When required by law (and we will notify you unless legally prohibited)

4. You may request complete deletion of your data at any time.

5. We do not use your data for advertising or profiling.

6. Your readings belong to you - they are private records of your journey.

This is not merely policy. This is our covenant with you.
`;
