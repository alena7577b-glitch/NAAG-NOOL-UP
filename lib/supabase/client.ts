import { createBrowserClient } from '@supabase/ssr';
import { getClientEnv, isSupabaseConfigured } from '../env';

/**
 * NAAG NOOL UP — Supabase Browser Client
 *
 * Safe for Client Components.
 * Uses only public environment variables (URL + Anon Key).
 * Never exposes the service-role key or database credentials.
 */

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (browserClient) return browserClient;

  if (!isSupabaseConfigured()) {
    // If not configured, throw a clear configuration error on invocation
    throw new Error(
      'Supabase is not configured. Please define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.'
    );
  }

  const env = getClientEnv();

  browserClient = createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return browserClient;
}

/**
 * Safely obtain the browser client or null if unconfigured
 */
export function getBrowserClient() {
  try {
    if (!isSupabaseConfigured()) return null;
    return createClient();
  } catch {
    return null;
  }
}
