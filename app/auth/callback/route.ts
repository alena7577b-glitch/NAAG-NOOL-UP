import { NextResponse, type NextRequest } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase/server';
import { provisionUserFromSupabase } from '@/lib/auth/provisioning';
import { logger } from '@/lib/logger';

/**
 * NAAG NOOL UP — Supabase Auth Code Exchange Callback
 *
 * Exchanges one-time authentication codes (e.g. from confirmation or password reset emails)
 * for authenticated session cookies.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/account';

  // Sanitize next redirect URL to avoid open redirects
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/account';

  if (code) {
    const supabase = await getServerSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error && data.user) {
          // Provision or sync public.User record
          await provisionUserFromSupabase(data.user);
          return NextResponse.redirect(new URL(safeNext, request.url));
        } else if (error) {
          logger.warn('Auth code exchange error:', error.message);
        }
      } catch (err) {
        logger.error('Unexpected error in auth callback:', err);
      }
    }
  }

  // If code exchange fails or is missing, redirect to login with error parameter
  return NextResponse.redirect(new URL('/login?error=auth_callback_failed', request.url));
}
