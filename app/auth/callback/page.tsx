"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AUTH_UNAVAILABLE_MESSAGE } from "@/lib/auth-copy";
import type { EmailOtpType } from "@supabase/supabase-js";
import {
  EMAIL_OTP_TYPES,
  finalizeAuthRedirectPath,
} from "@/lib/auth/post-auth-redirect";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();

  useEffect(() => {
    const run = async () => {
      const oauthError = searchParams.get("error");
      const oauthDescription = searchParams.get("error_description");
      if (oauthError || oauthDescription) {
        const msg =
          oauthDescription?.replace(/\+/g, " ") ||
          oauthError ||
          "Authentication was denied.";
        router.replace(`/auth/error?reason=${encodeURIComponent(msg)}`);
        return;
      }

      const code = searchParams.get("code");
      const tokenHash = searchParams.get("token_hash");
      const typeParam = searchParams.get("type");
      const next = searchParams.get("next") ?? "/portal";

      const supabase = createClient();
      if (!supabase) {
        router.replace(
          `/auth/error?reason=${encodeURIComponent(AUTH_UNAVAILABLE_MESSAGE)}`,
        );
        return;
      }

      if (code) {
        const { data: exchanged, error } =
          await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          router.replace(
            `/auth/error?reason=${encodeURIComponent(error.message)}`,
          );
          return;
        }

        const path = finalizeAuthRedirectPath(next, exchanged?.session, null);
        if (!path) {
          router.replace(
            `/auth/error?reason=${encodeURIComponent(
              "Could not create a session from this link. Request a new email and try again.",
            )}`,
          );
          return;
        }

        window.location.replace(
          path.startsWith("http")
            ? path
            : `${window.location.origin}${path.startsWith("/") ? path : `/${path}`}`,
        );
        return;
      }

      if (tokenHash && typeParam && EMAIL_OTP_TYPES.has(typeParam)) {
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: typeParam as EmailOtpType,
        });

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

        window.location.replace(
          path.startsWith("http")
            ? path
            : `${window.location.origin}${path.startsWith("/") ? path : `/${path}`}`,
        );
        return;
      }

      router.replace(
        `/auth/error?reason=${encodeURIComponent(
          "This sign-in link is incomplete or expired. Request a new confirmation or password reset email and open the latest link once.",
        )}`,
      );
    };

    void run().catch(() => {
      router.replace("/auth/error");
    });
  }, [router, searchKey]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground text-sm">Signing you in…</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Loading…</p>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
