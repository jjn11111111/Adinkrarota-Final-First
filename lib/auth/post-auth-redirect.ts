import type { Session } from "@supabase/supabase-js";
import { accessTokenHasAmrMethod } from "@/lib/supabase/access-token-amr";

export const EMAIL_OTP_TYPES: Set<string> = new Set([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
]);

export function finalizeAuthRedirectPath(
  next: string,
  session: Session | null | undefined,
  otpTypeHint: string | null,
): string | null {
  if (!session?.access_token) {
    return null;
  }

  const accessToken = session.access_token;
  const isRecoverySession =
    otpTypeHint === "recovery" ||
    accessTokenHasAmrMethod(accessToken, "recovery");

  const isPasswordRecovery =
    isRecoverySession ||
    next === "/auth/update-password" ||
    next.startsWith("/auth/update-password");

  if (isPasswordRecovery) {
    return "/auth/update-password";
  }

  const user = session.user;

  if (user?.user_metadata?.account_type === "member_pending") {
    return "/membership/checkout";
  }

  const createdAt = user?.created_at ? new Date(user.created_at) : null;
  const now = new Date();
  const isNewUser =
    createdAt && now.getTime() - createdAt.getTime() < 5 * 60 * 1000;

  if (isNewUser) {
    return "/auth/welcome";
  }

  return next;
}
