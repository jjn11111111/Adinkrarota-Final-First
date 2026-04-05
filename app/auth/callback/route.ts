import { createClient } from "@/lib/supabase/server";
import { accessTokenHasAmrMethod } from "@/lib/supabase/access-token-amr";
import type { EmailOtpType, Session } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const EMAIL_OTP_TYPES: Set<string> = new Set([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
]);

function errorRedirect(origin: string, message: string) {
  const qs = new URLSearchParams({
    reason: message.slice(0, 400),
  });
  return NextResponse.redirect(`${origin}/auth/error?${qs}`);
}

async function redirectAfterSession(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
  origin: string,
  next: string,
  session: Session | null | undefined,
  otpTypeHint: string | null,
) {
  if (!session?.access_token) {
    return errorRedirect(
      origin,
      "Could not create a session from this link. Request a new email and try again.",
    );
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
    return NextResponse.redirect(`${origin}/auth/update-password`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.user_metadata?.account_type === "member_pending") {
    return NextResponse.redirect(`${origin}/membership/checkout`);
  }

  const createdAt = user?.created_at ? new Date(user.created_at) : null;
  const now = new Date();
  const isNewUser =
    createdAt && now.getTime() - createdAt.getTime() < 5 * 60 * 1000;

  if (isNewUser) {
    return NextResponse.redirect(`${origin}/auth/welcome`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const oauthError = searchParams.get("error");
  const oauthDescription = searchParams.get("error_description");
  if (oauthError || oauthDescription) {
    const msg =
      oauthDescription?.replace(/\+/g, " ") ||
      oauthError ||
      "Authentication was denied.";
    return errorRedirect(origin, msg);
  }

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const typeParam = searchParams.get("type");
  const next = searchParams.get("next") ?? "/portal";

  const supabase = await createClient();
  if (!supabase) {
    return errorRedirect(
      origin,
      "Sign-in is not configured on this deployment (missing Supabase environment variables).",
    );
  }

  if (code) {
    const { data: exchanged, error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return errorRedirect(origin, error.message);
    }

    return redirectAfterSession(
      supabase,
      origin,
      next,
      exchanged?.session,
      null,
    );
  }

  if (tokenHash && typeParam && EMAIL_OTP_TYPES.has(typeParam)) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: typeParam as EmailOtpType,
    });

    if (error) {
      return errorRedirect(origin, error.message);
    }

    return redirectAfterSession(
      supabase,
      origin,
      next,
      data.session,
      typeParam,
    );
  }

  return errorRedirect(
    origin,
    "This sign-in link is incomplete or expired. Request a new confirmation or password reset email and open the latest link once.",
  );
}
