"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { EmailOtpType } from "@supabase/supabase-js";
import { AUTH_UNAVAILABLE_MESSAGE } from "@/lib/auth-copy";
import {
  EMAIL_OTP_TYPES,
  finalizeAuthRedirectPath,
} from "@/lib/auth/post-auth-redirect";
import { parseAuthRedirectParams } from "@/lib/auth/parse-auth-redirect-params";
import {
  createAuthCallbackClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

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

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Fetch aborted (Strict Mode remount, navigation) — safe to retry. */
function isAbortLike(err: unknown): boolean {
  if (err == null) return false;
  if (typeof err === "object" && "name" in err) {
    const n = String((err as { name: string }).name);
    if (n === "AbortError") return true;
  }
  const msg =
    err instanceof Error
      ? err.message
      : typeof err === "object" &&
          err !== null &&
          "message" in err &&
          typeof (err as { message: unknown }).message === "string"
        ? (err as { message: string }).message
        : String(err);
  return /aborted|AbortError/i.test(msg);
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const [hint, setHint] = useState("Signing you in…");

  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;

    const toError = (msg: string) => {
      if (cancelled) return;
      router.replace(`/auth/error?reason=${encodeURIComponent(msg)}`);
    };

    const origin = window.location.origin;
    const p = parseAuthRedirectParams(window.location.href);

    const oauthError = p.error;
    const oauthDescription = p.error_description;
    if (oauthError || oauthDescription) {
      const msg =
        oauthDescription?.replace(/\+/g, " ") ||
        oauthError ||
        "Authentication was denied.";
      toError(msg);
      return;
    }

    if (!isSupabaseConfigured()) {
      toError(AUTH_UNAVAILABLE_MESSAGE);
      return;
    }

    const code = p.code ?? null;
    const tokenHash = p.token_hash ?? null;
    const typeParam = p.type ?? null;
    const next = safeNext(p.next ?? null);

    const authTimeoutMs = 25_000;
    const maxAttempts = 3;

    async function runExchangeCode(supabaseOnce: NonNullable<
      ReturnType<typeof createAuthCallbackClient>
    >): Promise<void> {
      let lastThrow: unknown;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        if (cancelled) return;
        if (attempt > 0) await sleep(450);
        try {
          const { data, error } = await withTimeout(
            supabaseOnce.auth.exchangeCodeForSession(code!),
            authTimeoutMs,
            "Sign-in is taking too long. Check your connection and try again.",
          );
          if (error) {
            if (isAbortLike(error) && attempt < maxAttempts - 1) continue;
            toError(error.message);
            return;
          }
          const path = finalizeAuthRedirectPath(next, data.session, null);
          if (!path) {
            toError(
              "Could not create a session from this link. Request a new email and try again.",
            );
            return;
          }
          if (cancelled) return;
          window.location.replace(absoluteUrl(origin, path));
          return;
        } catch (e) {
          lastThrow = e;
          if (isAbortLike(e) && attempt < maxAttempts - 1) continue;
          throw e;
        }
      }
      throw lastThrow;
    }

    async function runVerifyOtp(supabaseOnce: NonNullable<
      ReturnType<typeof createAuthCallbackClient>
    >): Promise<void> {
      let lastThrow: unknown;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        if (cancelled) return;
        if (attempt > 0) await sleep(450);
        try {
          const { data, error } = await withTimeout(
            supabaseOnce.auth.verifyOtp({
              token_hash: tokenHash!,
              type: typeParam as EmailOtpType,
            }),
            authTimeoutMs,
            "Verification is taking too long. Check your connection and try again.",
          );
          if (error) {
            if (isAbortLike(error) && attempt < maxAttempts - 1) continue;
            toError(error.message);
            return;
          }
          const path = finalizeAuthRedirectPath(next, data.session, typeParam);
          if (!path) {
            toError(
              "Could not create a session from this link. Request a new email and try again.",
            );
            return;
          }
          if (cancelled) return;
          window.location.replace(absoluteUrl(origin, path));
          return;
        } catch (e) {
          lastThrow = e;
          if (isAbortLike(e) && attempt < maxAttempts - 1) continue;
          throw e;
        }
      }
      throw lastThrow;
    }

    async function runImplicitHashSession(
      supabaseOnce: NonNullable<
        ReturnType<typeof createAuthCallbackClient>
      >,
      raw: Record<string, string>,
    ): Promise<void> {
      const access_token = raw.access_token!;
      const refresh_token = raw.refresh_token!;

      setHint("Completing sign-in…");
      const { data, error } = await withTimeout(
        supabaseOnce.auth.setSession({
          access_token,
          refresh_token,
        }),
        authTimeoutMs,
        "Sign-in is taking too long. Check your connection and try again.",
      );
      if (error) {
        toError(error.message);
        return;
      }
      const otpHint: string | null =
        raw.type === "recovery"
          ? "recovery"
          : raw.type && EMAIL_OTP_TYPES.has(raw.type)
            ? raw.type
            : null;
      const path = finalizeAuthRedirectPath(next, data.session, otpHint);
      if (!path) {
        toError(
          "Could not create a session from this link. Request a new email and try again.",
        );
        return;
      }
      if (cancelled) return;
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
      window.location.replace(absoluteUrl(origin, path));
    }

    (async () => {
      const supabaseOnce = createAuthCallbackClient();
      if (!supabaseOnce) {
        toError(AUTH_UNAVAILABLE_MESSAGE);
        return;
      }

      try {
        if (code) {
          setHint("Completing sign-in…");
          await runExchangeCode(supabaseOnce);
          return;
        }

        if (tokenHash && typeParam && EMAIL_OTP_TYPES.has(typeParam)) {
          setHint("Verifying your link…");
          await runVerifyOtp(supabaseOnce);
          return;
        }

        if (p.access_token && p.refresh_token) {
          await runImplicitHashSession(supabaseOnce, p);
          return;
        }

        toError(
          "This sign-in link is incomplete or expired. Request a new confirmation or password reset email and open the latest link once.",
        );
      } catch (e) {
        if (cancelled) return;
        if (isAbortLike(e)) {
          toError(
            "The sign-in request was interrupted. Please close this tab and open the link from your email again (use the same browser where you started).",
          );
          return;
        }
        const msg =
          e instanceof Error ? e.message : "Something went wrong during sign-in.";
        toError(msg);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <p className="text-muted-foreground text-sm">{hint}</p>
    </div>
  );
}
