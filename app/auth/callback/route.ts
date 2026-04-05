import { getPublicSupabaseConfig } from "@/lib/supabase/env";
import { accessTokenHasAmrMethod } from "@/lib/supabase/access-token-amr";
import { createServerClient } from "@supabase/ssr";
import type { EmailOtpType, Session, SupabaseClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

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

function createSupabaseCallbackClient(
  request: NextRequest,
  response: NextResponse,
) {
  const cfg = getPublicSupabaseConfig();
  if (!cfg) {
    return null;
  }
  return createServerClient(cfg.url, cfg.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });
}

async function finalizeAuthRedirectPath(
  supabase: SupabaseClient,
  next: string,
  session: Session | null | undefined,
  otpTypeHint: string | null,
): Promise<string | null> {
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

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

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const origin = url.origin;
  const oauthError = url.searchParams.get("error");
  const oauthDescription = url.searchParams.get("error_description");
  if (oauthError || oauthDescription) {
    const msg =
      oauthDescription?.replace(/\+/g, " ") ||
      oauthError ||
      "Authentication was denied.";
    return errorRedirect(origin, msg);
  }

  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const typeParam = url.searchParams.get("type");
  const next = url.searchParams.get("next") ?? "/portal";

  const redirectResponse = NextResponse.redirect(`${origin}/`, 302);
  const supabase = createSupabaseCallbackClient(request, redirectResponse);

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

    const path = await finalizeAuthRedirectPath(
      supabase,
      next,
      exchanged?.session,
      null,
    );
    if (!path) {
      return errorRedirect(
        origin,
        "Could not create a session from this link. Request a new email and try again.",
      );
    }

    redirectResponse.headers.set("Location", `${origin}${path}`);
    return redirectResponse;
  }

  if (tokenHash && typeParam && EMAIL_OTP_TYPES.has(typeParam)) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: typeParam as EmailOtpType,
    });

    if (error) {
      return errorRedirect(origin, error.message);
    }

    const path = await finalizeAuthRedirectPath(
      supabase,
      next,
      data.session,
      typeParam,
    );
    if (!path) {
      return errorRedirect(
        origin,
        "Could not create a session from this link. Request a new email and try again.",
      );
    }

    redirectResponse.headers.set("Location", `${origin}${path}`);
    return redirectResponse;
  }

  return errorRedirect(
    origin,
    "This sign-in link is incomplete or expired. Request a new confirmation or password reset email and open the latest link once.",
  );
}
