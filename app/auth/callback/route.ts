import { createClient } from "@/lib/supabase/server";
import { accessTokenHasAmrMethod } from "@/lib/supabase/access-token-amr";
import { NextResponse } from "next/server";

function errorRedirect(origin: string, message: string) {
  const qs = new URLSearchParams({
    reason: message.slice(0, 400),
  });
  return NextResponse.redirect(`${origin}/auth/error?${qs}`);
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
  const next = searchParams.get("next") ?? "/portal";

  if (code) {
    const supabase = await createClient();
    if (!supabase) {
      return errorRedirect(
        origin,
        "Sign-in is not configured on this deployment (missing Supabase environment variables)."
      );
    }
    const { data: exchanged, error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return errorRedirect(origin, error.message);
    }

    const accessToken = exchanged?.session?.access_token;
    const isRecoverySession =
      !!accessToken && accessTokenHasAmrMethod(accessToken, "recovery");

    const isPasswordRecovery =
      isRecoverySession ||
      next === "/auth/update-password" ||
      next.startsWith("/auth/update-password");

    if (isPasswordRecovery) {
      return NextResponse.redirect(`${origin}/auth/update-password`);
    }

    const { data: { user } } = await supabase.auth.getUser();

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

  return errorRedirect(
    origin,
    "This sign-in link is incomplete or expired. Request a new confirmation or password reset email and open the latest link once."
  );
}
