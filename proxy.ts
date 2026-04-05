import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/** Next.js 16 — session refresh + auth redirects (replaces deprecated root middleware.ts). */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
