import { createClient } from '@supabase/supabase-js';
import { isBrowser, isSupabaseAdminConfigured } from '../env';

/**
 * NAAG NOOL UP — Supabase Admin (Service Role) Client
 *
 * CRITICAL SECURITY REQUIREMENTS:
 * 1. SERVER-ONLY: MUST NEVER be bundled or executed in browser client code.
 * 2. BYPASSES RLS: This client has full administrative privileges.
 * 3. USE CASES: User role synchronization, administrative metadata updates,
 *    system-level maintenance, private storage management.
 */

let adminClient: ReturnType<typeof createClient> | null = null;

export function createAdminClient() {
  if (isBrowser) {
    throw new Error(
      'CRITICAL SECURITY VIOLATION: createAdminClient() was called in a browser environment!'
    );
  }

  if (!isSupabaseAdminConfigured()) {
    throw new Error(
      'Supabase Admin client cannot be initialized: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY is missing.'
    );
  }

  if (adminClient) return adminClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}

/**
 * Safely obtain the admin client or null if unconfigured
 */
export function getAdminSupabaseClient() {
  try {
    if (!isSupabaseAdminConfigured()) return null;
    return createAdminClient();
  } catch {
    return null;
  }
}
