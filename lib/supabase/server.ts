import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { isSupabaseConfigured } from '../env';

/**
 * NAAG NOOL UP — Supabase Server Client
 *
 * For Server Components, Server Actions, and Route Handlers.
 * Uses Next.js cookies() to read and write authenticated session tokens securely.
 * Restricted to anonymous/user context (RLS enforced).
 */

export async function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase server client cannot be initialized: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.'
    );
  }

  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // In Server Components, mutating cookies throws an error.
          // This can be safely ignored when middleware handles session refreshing.
        }
      },
    },
  });
}

/**
 * Safely obtain the server client or null if unconfigured
 */
export async function getServerSupabaseClient() {
  try {
    if (!isSupabaseConfigured()) return null;
    return await createClient();
  } catch {
    return null;
  }
}
