"use server";

import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type PasswordResetEmailResult =
  | { ok: true }
  | { ok: false; error: string };

/** Internal: client treats this as “skip fallback, show Supabase error only”. */
export const PASSWORD_RESET_RESEND_NOT_CONFIGURED = "not_configured";

function validateRecoveryRedirectTo(redirectTo: string): boolean {
  try {
    const u = new URL(redirectTo);
    if (!u.pathname.includes("/auth/callback")) return false;
    if (u.protocol === "https:") return true;
    if (
      u.protocol === "http:" &&
      (u.hostname === "localhost" || u.hostname === "127.0.0.1")
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

async function sendResendHtml(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) throw new Error("RESEND_API_KEY is not set");
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!from) throw new Error("RESEND_FROM_EMAIL is not set");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Resend HTTP ${res.status}`);
  }
}

/**
 * When Supabase custom SMTP fails (500), optionally send the same recovery link via Resend.
 * Requires SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, RESEND_FROM_EMAIL.
 */
export async function sendPasswordResetEmailViaResend(
  email: string,
  redirectTo: string,
): Promise<PasswordResetEmailResult> {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@")) {
    return { ok: false, error: "Enter a valid email address." };
  }

  if (!validateRecoveryRedirectTo(redirectTo)) {
    return { ok: false, error: "Invalid recovery redirect URL." };
  }

  const resendKey = process.env.RESEND_API_KEY?.trim();
  const resendFrom = process.env.RESEND_FROM_EMAIL?.trim();
  if (!resendKey || !resendFrom) {
    return { ok: false, error: PASSWORD_RESET_RESEND_NOT_CONFIGURED };
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return { ok: false, error: PASSWORD_RESET_RESEND_NOT_CONFIGURED };
  }

  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email: normalized,
    options: { redirectTo },
  });

  if (error) {
    const em = (error.message || "").toLowerCase();
    if (
      em.includes("user not found") ||
      em.includes("not registered") ||
      em.includes("no user")
    ) {
      return { ok: true };
    }
    return { ok: false, error: error.message };
  }

  const link = data?.properties?.action_link;
  if (!link || typeof link !== "string") {
    return { ok: false, error: "Could not create reset link." };
  }

  try {
    await sendResendHtml(
      normalized,
      "Reset your ADINKRAROTA password",
      `<p>We received a request to reset your password.</p>
<p><a href="${link.replace(/&/g, "&amp;").replace(/"/g, "&quot;")}">Choose a new password</a></p>
<p>If you did not request this, you can ignore this email.</p>`,
    );
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Failed to send email.",
    };
  }
}
