import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/portal";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Check if user needs to complete membership payment
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user?.user_metadata?.account_type === "member_pending") {
        // Redirect to membership payment
        return NextResponse.redirect(`${origin}/membership/checkout`);
      }
      
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth error - redirect to error page
  return NextResponse.redirect(`${origin}/auth/error`);
}
