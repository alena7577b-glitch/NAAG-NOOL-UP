import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

/**
 * NAAG NOOL UP — Global Next.js Middleware
 *
 * Runs on every request except static assets and API/internal files.
 * Keeps Supabase Auth sessions active and cookies synchronized.
 */
export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Defensive fallback: If OAuth returns with a ?code= parameter to the site root or any page
  // other than /auth/callback, forward it immediately to /auth/callback to exchange the session
  if (searchParams.has('code') && !pathname.startsWith('/auth/callback')) {
    const callbackUrl = new URL('/auth/callback', request.url);
    searchParams.forEach((value, key) => {
      callbackUrl.searchParams.set(key, value);
    });
    return NextResponse.redirect(callbackUrl);
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (svg, png, jpg, jpeg, gif, webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
