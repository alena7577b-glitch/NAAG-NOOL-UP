import { z } from 'zod';

/**
 * NAAG NOOL UP — Environment Configuration & Validation
 *
 * Implements strict runtime validation for server and client environment variables.
 * Enforces security boundaries: Service-role keys and database credentials are
 * strictly server-side and never exposed to client bundles.
 */

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_URL: z.string().optional(),
  AUTH_SECRET: z.string().optional(),

  // Supabase Server Credentials
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Payment Provider Configuration
  PAYMENT_PROVIDER: z.string().optional(),
  PAYMENT_PROVIDER_KEY: z.string().optional(),
  PAYMENT_PROVIDER_SECRET: z.string().optional(),
  PAYMENT_WEBHOOK_SECRET: z.string().optional(),

  // SoomarPay Configuration
  SOOMARPAY_API_KEY: z.string().optional(),
  SOOMARPAY_WEBHOOK_SECRET: z.string().optional(),
  SOOMARPAY_BASE_URL: z.string().optional(),

  // Storage Bucket Names
  SUPABASE_STORAGE_PUBLIC_BUCKET: z.string().default('naag-nool-public-media'),
  SUPABASE_STORAGE_PRIVATE_BUCKET: z.string().default('naag-nool-private-docs'),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal('')),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().or(z.literal('')),
});

/**
 * Check whether code is running in a browser environment (excluding test runners)
 */
export const isBrowser =
  typeof window !== 'undefined' &&
  !(typeof process !== 'undefined' && (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined));

/**
 * Validated server environment
 * Safe to access only on Node.js / Server environments
 */
export function getServerEnv() {
  if (isBrowser) {
    throw new Error(
      'CRITICAL SECURITY ERROR: Attempted to access server environment variables from browser client bundle!'
    );
  }

  const result = serverEnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Invalid server environment configuration:', result.error.flatten().fieldErrors);
    throw new Error(`Invalid server environment variables: ${JSON.stringify(result.error.flatten().fieldErrors)}`);
  }
  return result.data;
}

/**
 * Validated client/public environment
 * Safe to access in both server and browser environments
 */
export function getClientEnv() {
  const result = clientEnvSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  if (!result.success) {
    console.error('Invalid client environment configuration:', result.error.flatten().fieldErrors);
    throw new Error(`Invalid client environment variables: ${JSON.stringify(result.error.flatten().fieldErrors)}`);
  }
  return result.data;
}

/**
 * Helper to check if Supabase is fully configured
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && anonKey && url.startsWith('http') && anonKey.length > 10);
}

/**
 * Helper to check if Supabase Service Role is configured (Server only)
 */
export function isSupabaseAdminConfigured(): boolean {
  if (isBrowser) return false;
  const isPublicConfigured = isSupabaseConfigured();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(isPublicConfigured && serviceRoleKey && serviceRoleKey.length > 10);
}
