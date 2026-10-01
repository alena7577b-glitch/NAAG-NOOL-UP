import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isSupabaseConfigured } from '../env';

/**
 * NAAG NOOL UP — Supabase Middleware Session Manager
 *
 * Responsibilities:
 * 1. Refresh expired auth tokens on incoming requests.
 * 2. Synchronize updated auth cookies between NextRequest and NextResponse.
 * 3. Never throw or block requests when Supabase is unconfigured (graceful fallback).
 */

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (!isSupabaseConfigured()) {
    return response;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // IMPORTANT: getUser() sends a request to the Supabase Auth server
  // to revalidate the token, safely refreshing cookies.
  await supabase.auth.getUser();

  return response;
}
