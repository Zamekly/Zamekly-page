import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Protects all /dashboard/* routes.
 *
 * In production: swap the placeholder cookie check for a real Supabase SSR
 * session check using createServerClient from @supabase/ssr.
 *
 * Development fallback: if NEXT_PUBLIC_SUPABASE_URL is not set, all dashboard
 * routes are accessible so you can develop without Supabase credentials.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // ── Development bypass ─────────────────────────────────────────────────────
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    // No credentials configured → allow access for local development
    return NextResponse.next();
  }

  // ── Production: check for Supabase session cookie ──────────────────────────
  // The Supabase SSR client sets a cookie named sb-<project-ref>-auth-token.
  // We do a lightweight check here — the actual session validation happens in
  // each server component / route handler via createServerClient.
  const hasSession = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token"));

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
