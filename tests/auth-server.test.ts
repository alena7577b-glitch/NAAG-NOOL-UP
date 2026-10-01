/**
 * NAAG NOOL UP — Server Auth Guard Verification Tests
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
  requireRole,
  requireAdmin,
  requireSuperAdmin,
  isAuthenticated,
  AuthenticationError,
  AuthorizationError,
} from '../lib/auth/server';
import { getServerSupabaseClient } from '../lib/supabase/server';
import { provisionUserFromSupabase } from '../lib/auth/provisioning';

describe('Server Authentication & Authorization Guards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Unauthenticated Request Handling', () => {
    beforeEach(() => {
      (getServerSupabaseClient as jest.Mock).mockResolvedValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: new Error('No session') }),
        },
      });
    });

    test('isAuthenticated returns false', async () => {
      const auth = await isAuthenticated();
      expect(auth).toBe(false);
    });

    test('requireAuthenticatedUser throws AuthenticationError (401)', async () => {
      await expect(requireAuthenticatedUser()).rejects.toThrow(AuthenticationError);
      await expect(requireAuthenticatedUser()).rejects.toThrow('You must be signed in');
    });

    test('requireAdmin throws AuthenticationError when unauthenticated', async () => {
      await expect(requireAdmin()).rejects.toThrow(AuthenticationError);
    });

    test('requireSuperAdmin throws AuthenticationError when unauthenticated', async () => {
      await expect(requireSuperAdmin()).rejects.toThrow(AuthenticationError);
    });
  });

  describe('Customer Role Handling', () => {
    const customerUser = {
      id: 'customer-uuid-1',
      email: 'customer@example.com',
      role: 'CUSTOMER' as const,
    };

    beforeEach(() => {
      (getServerSupabaseClient as jest.Mock).mockResolvedValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: 'customer-uuid-1', email: 'customer@example.com' } },
            error: null,
          }),
        },
      });
      (provisionUserFromSupabase as jest.Mock).mockResolvedValue(customerUser);
    });

    test('isAuthenticated returns true', async () => {
      expect(await isAuthenticated()).toBe(true);
    });

    test('requireAuthenticatedUser succeeds and returns user', async () => {
      const user = await requireAuthenticatedUser();
      expect(user.id).toBe('customer-uuid-1');
      expect(user.role).toBe('CUSTOMER');
    });

    test('requireRole("CUSTOMER") succeeds', async () => {
      const user = await requireRole('CUSTOMER');
      expect(user.id).toBe('customer-uuid-1');
    });

    test('requireRole("ADMIN") throws AuthorizationError (403)', async () => {
      await expect(requireRole('ADMIN')).rejects.toThrow(AuthorizationError);
    });

    test('requireAdmin throws AuthorizationError (403)', async () => {
      await expect(requireAdmin()).rejects.toThrow(AuthorizationError);
      await expect(requireAdmin()).rejects.toThrow('Administrative privileges required');
    });

    test('requireSuperAdmin throws AuthorizationError (403)', async () => {
      await expect(requireSuperAdmin()).rejects.toThrow(AuthorizationError);
      await expect(requireSuperAdmin()).rejects.toThrow('Super Administrator privileges required');
    });
  });

  describe('Admin Role Handling', () => {
    const adminUser = {
      id: 'admin-uuid-2',
      email: 'admin@naagnoolup.com',
      role: 'ADMIN' as const,
    };

    beforeEach(() => {
      (getServerSupabaseClient as jest.Mock).mockResolvedValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: 'admin-uuid-2', email: 'admin@naagnoolup.com' } },
            error: null,
          }),
        },
      });
      (provisionUserFromSupabase as jest.Mock).mockResolvedValue(adminUser);
    });

    test('requireAdmin succeeds', async () => {
      const user = await requireAdmin();
      expect(user.id).toBe('admin-uuid-2');
      expect(user.role).toBe('ADMIN');
    });

    test('requireSuperAdmin throws AuthorizationError (403)', async () => {
      await expect(requireSuperAdmin()).rejects.toThrow(AuthorizationError);
    });
  });

  describe('SuperAdmin Role Handling', () => {
    const superAdminUser = {
      id: 'superadmin-uuid-3',
      email: 'superadmin@naagnoolup.com',
      role: 'SUPERADMIN' as const,
    };

    beforeEach(() => {
      (getServerSupabaseClient as jest.Mock).mockResolvedValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: 'superadmin-uuid-3', email: 'superadmin@naagnoolup.com' } },
            error: null,
          }),
        },
      });
      (provisionUserFromSupabase as jest.Mock).mockResolvedValue(superAdminUser);
    });

    test('requireAdmin succeeds for superadmin', async () => {
      const user = await requireAdmin();
      expect(user.id).toBe('superadmin-uuid-3');
    });

    test('requireSuperAdmin succeeds for superadmin', async () => {
      const user = await requireSuperAdmin();
      expect(user.id).toBe('superadmin-uuid-3');
      expect(user.role).toBe('SUPERADMIN');
    });
  });
});
