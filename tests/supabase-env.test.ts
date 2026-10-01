/**
 * NAAG NOOL UP — Supabase Environment & Security Boundaries Tests
 */

import {
  getClientEnv,
  getServerEnv,
  isSupabaseConfigured,
  isSupabaseAdminConfigured,
} from '../lib/env';

describe('Supabase Environment Configuration & Security', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('isSupabaseConfigured returns false when env variables are missing', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    expect(isSupabaseConfigured()).toBe(false);
  });

  test('isSupabaseConfigured returns true when valid public credentials exist', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://abcdefghijklm.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.valid_anon_key_string';
    expect(isSupabaseConfigured()).toBe(true);
  });

  test('isSupabaseAdminConfigured requires service role key', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://abcdefghijklm.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.valid_anon_key_string';
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    expect(isSupabaseAdminConfigured()).toBe(false);

    process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.service_role_secret';
    expect(isSupabaseAdminConfigured()).toBe(true);
  });

  test('getClientEnv parses public environment safely', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://naagnoolup.com';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key-123';

    const clientEnv = getClientEnv();
    expect(clientEnv.NEXT_PUBLIC_SITE_URL).toBe('https://naagnoolup.com');
    expect(clientEnv.NEXT_PUBLIC_SUPABASE_URL).toBe('https://example.supabase.co');
  });

  test('getServerEnv returns valid server environment object', () => {
    process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/naag_nool_up?schema=public';
    const serverEnv = getServerEnv();
    expect(serverEnv.DATABASE_URL).toBeDefined();
    expect(serverEnv.SUPABASE_STORAGE_PUBLIC_BUCKET).toBe('naag-nool-public-media');
  });
});
