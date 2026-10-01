import { type NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

/**
 * NAAG NOOL UP — Global Next.js Middleware
 *
 * Runs on every request except static assets and API/internal files.
 * Keeps Supabase Auth sessions active and cookies synchronized.
 */
export async function middleware(request: NextRequest) {
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
