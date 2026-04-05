import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { AUTH_UNAVAILABLE_MESSAGE } from "@/lib/auth-copy";
import {
  EMAIL_OTP_TYPES,
  finalizeAuthRedirectPath,
} from "@/lib/auth/post-auth-redirect";
import { createClient } from "@/lib/supabase/server";

function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/portal";
  return raw;
}

function absoluteUrl(origin: string, path: string): string {
  if (path.startsWith("http")) return path;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  const searchParams = requestUrl.searchParams;

  const oauthError = searchParams.get("error");
  const oauthDescription = searchParams.get("error_description");
  if (oauthError || oauthDescription) {
    const msg =
      oauthDescription?.replace(/\+/g, " ") ||
      oauthError ||
      "Authentication was denied.";
    return NextResponse.redirect(
      `${origin}/auth/error?reason=${encodeURIComponent(msg)}`,
    );
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.redirect(
      `${origin}/auth/error?reason=${encodeURIComponent(AUTH_UNAVAILABLE_MESSAGE)}`,
    );
  }

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const typeParam = searchParams.get("type");
  const next = safeNext(searchParams.get("next"));

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        `${origin}/auth/error?reason=${encodeURIComponent(error.message)}`,
      );
    }
    const path = finalizeAuthRedirectPath(next, data.session, null);
    if (!path) {
      return NextResponse.redirect(
        `${origin}/auth/error?reason=${encodeURIComponent(
          "Could not create a session from this link. Request a new email and try again.",
        )}`,
      );
    }
    return NextResponse.redirect(absoluteUrl(origin, path));
  }

  if (tokenHash && typeParam && EMAIL_OTP_TYPES.has(typeParam)) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: typeParam as EmailOtpType,
    });
    if (error) {
      return NextResponse.redirect(
        `${origin}/auth/error?reason=${encodeURIComponent(error.message)}`,
      );
    }
    const path = finalizeAuthRedirectPath(next, data.session, typeParam);
    if (!path) {
      return NextResponse.redirect(
        `${origin}/auth/error?reason=${encodeURIComponent(
          "Could not create a session from this link. Request a new email and try again.",
        )}`,
      );
    }
    return NextResponse.redirect(absoluteUrl(origin, path));
  }

  return NextResponse.redirect(
    `${origin}/auth/error?reason=${encodeURIComponent(
      "This sign-in link is incomplete or expired. Request a new confirmation or password reset email and open the latest link once.",
    )}`,
  );
}
