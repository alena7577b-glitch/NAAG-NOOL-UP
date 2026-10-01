/**
 * NAAG NOOL UP — Supabase Client Instantiation & Isolation Tests
 */

import { getBrowserClient, createClient as createBrowserSupabaseClient } from '../lib/supabase/client';
import { getAdminSupabaseClient, createAdminClient } from '../lib/supabase/admin';

const VALID_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSJ9.mock_signature_part';

describe('Supabase Client Architecture & Isolation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('Browser Client', () => {
    test('throws clear configuration error when unconfigured', () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      expect(() => createBrowserSupabaseClient()).toThrow(/Supabase is not configured/);
    });

    test('getBrowserClient returns null when unconfigured', () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      expect(getBrowserClient()).toBeNull();
    });

    test('creates browser client when configured', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = VALID_JWT;

      const client = createBrowserSupabaseClient();
      expect(client).toBeDefined();
      expect(client.auth).toBeDefined();
      expect(client.storage).toBeDefined();
    });
  });

  describe('Admin (Service Role) Client', () => {
    test('throws configuration error when service role key is missing', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = VALID_JWT;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;

      expect(() => createAdminClient()).toThrow(/Supabase Admin client cannot be initialized/);
    });

    test('creates privileged admin client when properly configured on server', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = VALID_JWT;
      process.env.SUPABASE_SERVICE_ROLE_KEY = VALID_JWT;

      const adminClient = createAdminClient();
      expect(adminClient).toBeDefined();
      expect(adminClient.auth).toBeDefined();
      expect(adminClient.auth.admin).toBeDefined();
    });

    test('getAdminSupabaseClient safely returns null when unconfigured', () => {
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
      expect(getAdminSupabaseClient()).toBeNull();
    });
  });
});
