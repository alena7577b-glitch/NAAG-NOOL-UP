/**
 * NAAG NOOL UP — Admin Guards & Route Protection Tests
 */

jest.mock('../lib/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('../lib/supabase/server', () => ({
  getServerSupabaseClient: jest.fn(),
}));

jest.mock('../lib/auth/provisioning', () => ({
  provisionUserFromSupabase: jest.fn(),
}));

import {
  requireAuthenticatedUser,
  requireAdmin,
  requireSuperAdmin,
  AuthenticationError,
  AuthorizationError,
} from '../lib/auth/server';
import { getServerSupabaseClient } from '../lib/supabase/server';
import { provisionUserFromSupabase } from '../lib/auth/provisioning';

describe('Authorization Guards & Route Protection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requireAuthenticatedUser', () => {
    test('throws AuthenticationError (401) when user is unauthenticated', async () => {
      (getServerSupabaseClient as jest.Mock).mockResolvedValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
        },
      });

      await expect(requireAuthenticatedUser()).rejects.toThrow(AuthenticationError);
    });

    test('returns user object when user is authenticated', async () => {
      const mockUser = { id: 'usr-1', email: 'test@example.com', role: 'CUSTOMER' as const };
      (getServerSupabaseClient as jest.Mock).mockResolvedValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: 'usr-1', email: 'test@example.com' } },
            error: null,
          }),
        },
      });
      (provisionUserFromSupabase as jest.Mock).mockResolvedValue(mockUser);

      const user = await requireAuthenticatedUser();
      expect(user).toEqual(mockUser);
    });
  });

  describe('requireAdmin', () => {
    test('throws AuthenticationError when user is unauthenticated', async () => {
      (getServerSupabaseClient as jest.Mock).mockResolvedValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
        },
      });

      await expect(requireAdmin()).rejects.toThrow(AuthenticationError);
    });

    test('throws AuthorizationError (403) when user has CUSTOMER role', async () => {
      const mockUser = { id: 'cust-1', email: 'customer@example.com', role: 'CUSTOMER' as const };
      (getServerSupabaseClient as jest.Mock).mockResolvedValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: 'cust-1', email: 'customer@example.com' } },
            error: null,
          }),
        },
      });
      (provisionUserFromSupabase as jest.Mock).mockResolvedValue(mockUser);

      await expect(requireAdmin()).rejects.toThrow(AuthorizationError);
    });

    test('allows ADMIN and SUPERADMIN to proceed', async () => {
      const mockUser = { id: 'admin-1', email: 'admin@naagnoolup.com', role: 'ADMIN' as const };
      (getServerSupabaseClient as jest.Mock).mockResolvedValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: 'admin-1', email: 'admin@naagnoolup.com' } },
            error: null,
          }),
        },
      });
      (provisionUserFromSupabase as jest.Mock).mockResolvedValue(mockUser);

      const user = await requireAdmin();
      expect(user.role).toBe('ADMIN');
    });
  });

  describe('requireSuperAdmin', () => {
    test('throws AuthorizationError (403) when user is standard ADMIN', async () => {
      const mockUser = { id: 'admin-1', email: 'admin@naagnoolup.com', role: 'ADMIN' as const };
      (getServerSupabaseClient as jest.Mock).mockResolvedValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: 'admin-1', email: 'admin@naagnoolup.com' } },
            error: null,
          }),
        },
      });
      (provisionUserFromSupabase as jest.Mock).mockResolvedValue(mockUser);

      await expect(requireSuperAdmin()).rejects.toThrow(AuthorizationError);
    });

    test('allows SUPERADMIN to proceed', async () => {
      const mockUser = { id: 'super-1', email: 'super@naagnoolup.com', role: 'SUPERADMIN' as const };
      (getServerSupabaseClient as jest.Mock).mockResolvedValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: 'super-1', email: 'super@naagnoolup.com' } },
            error: null,
          }),
        },
      });
      (provisionUserFromSupabase as jest.Mock).mockResolvedValue(mockUser);

      const user = await requireSuperAdmin();
      expect(user.role).toBe('SUPERADMIN');
    });
  });
});
