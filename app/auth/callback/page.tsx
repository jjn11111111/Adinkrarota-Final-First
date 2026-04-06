"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { EmailOtpType } from "@supabase/supabase-js";
import { AUTH_UNAVAILABLE_MESSAGE } from "@/lib/auth-copy";
import {
  EMAIL_OTP_TYPES,
  finalizeAuthRedirectPath,
} from "@/lib/auth/post-auth-redirect";
import { createAuthCallbackClient } from "@/lib/supabase/client";

function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/portal";
  return raw;
}

function absoluteUrl(origin: string, path: string): string {
  if (path.startsWith("http")) return path;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(label)), ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const [hint, setHint] = useState("Signing you in…");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const origin = window.location.origin;

    const oauthError = params.get("error");
    const oauthDescription = params.get("error_description");
    if (oauthError || oauthDescription) {
      const msg =
        oauthDescription?.replace(/\+/g, " ") ||
        oauthError ||
        "Authentication was denied.";
      router.replace(`/auth/error?reason=${encodeURIComponent(msg)}`);
      return;
    }

    const supabase = createAuthCallbackClient();
    if (!supabase) {
      router.replace(
        `/auth/error?reason=${encodeURIComponent(AUTH_UNAVAILABLE_MESSAGE)}`,
      );
      return;
    }

    const code = params.get("code");
    const tokenHash = params.get("token_hash");
    const typeParam = params.get("type");
    const next = safeNext(params.get("next"));

    const authTimeoutMs = 25_000;

    (async () => {
      try {
        if (code) {
          setHint("Completing sign-in…");
          const { data, error } = await withTimeout(
            supabase.auth.exchangeCodeForSession(code),
            authTimeoutMs,
            "Sign-in is taking too long. Check your connection and try again.",
          );
          if (error) {
            router.replace(
              `/auth/error?reason=${encodeURIComponent(error.message)}`,
            );
            return;
          }
          const path = finalizeAuthRedirectPath(next, data.session, null);
          if (!path) {
            router.replace(
              `/auth/error?reason=${encodeURIComponent(
                "Could not create a session from this link. Request a new email and try again.",
              )}`,
            );
            return;
          }
          window.location.replace(absoluteUrl(origin, path));
          return;
        }

        if (tokenHash && typeParam && EMAIL_OTP_TYPES.has(typeParam)) {
          setHint("Verifying your link…");
          const { data, error } = await withTimeout(
            supabase.auth.verifyOtp({
              token_hash: tokenHash,
              type: typeParam as EmailOtpType,
            }),
            authTimeoutMs,
            "Verification is taking too long. Check your connection and try again.",
          );
          if (error) {
            router.replace(
              `/auth/error?reason=${encodeURIComponent(error.message)}`,
            );
            return;
          }
          const path = finalizeAuthRedirectPath(next, data.session, typeParam);
          if (!path) {
            router.replace(
              `/auth/error?reason=${encodeURIComponent(
                "Could not create a session from this link. Request a new email and try again.",
              )}`,
            );
            return;
          }
          window.location.replace(absoluteUrl(origin, path));
          return;
        }

        router.replace(
          `/auth/error?reason=${encodeURIComponent(
            "This sign-in link is incomplete or expired. Request a new confirmation or password reset email and open the latest link once.",
          )}`,
        );
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "Something went wrong during sign-in.";
        router.replace(`/auth/error?reason=${encodeURIComponent(msg)}`);
      }
    })();
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <p className="text-muted-foreground text-sm">{hint}</p>
    </div>
  );
}
