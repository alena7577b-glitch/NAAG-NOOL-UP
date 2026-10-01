/**
 * NAAG NOOL UP — User Provisioning & Anti-Escalation Tests
 */

import { provisionUserFromSupabase, assignUserRole } from '../lib/auth/provisioning';
import { db } from '../lib/db';
import { AuthSessionUser } from '../lib/auth/types';

// Mock Prisma client
jest.mock('../lib/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// Mock logger
jest.mock('../lib/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('User Provisioning & Anti-Escalation Architecture', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('provisionUserFromSupabase', () => {
    test('provisions a new user with strictly default role CUSTOMER', async () => {
      (db.user.findUnique as jest.Mock).mockResolvedValue(null);
      (db.user.create as jest.Mock).mockResolvedValue({
        id: 'supabase-uuid-1234',
        email: 'newuser@example.com',
        fullName: 'New Customer',
        role: 'CUSTOMER',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await provisionUserFromSupabase({
        id: 'supabase-uuid-1234',
        email: 'newuser@example.com',
        user_metadata: {
          full_name: 'New Customer',
          // Malicious client attempting to self-assign SUPERADMIN in metadata
          role: 'SUPERADMIN',
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as any);

      expect(db.user.create).toHaveBeenCalledWith({
        data: {
          id: 'supabase-uuid-1234',
          email: 'newuser@example.com',
          fullName: 'New Customer',
          role: 'CUSTOMER', // Invariant: always CUSTOMER
        },
      });

      expect(result.role).toBe('CUSTOMER');
      expect(result.id).toBe('supabase-uuid-1234');
    });

    test('returns existing user without mutating existing role', async () => {
      (db.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'existing-admin-uuid',
        email: 'admin@naagnoolup.com',
        fullName: 'Existing Admin',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await provisionUserFromSupabase({
        id: 'existing-admin-uuid',
        email: 'admin@naagnoolup.com',
        user_metadata: {
          full_name: 'Existing Admin',
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as any);

      expect(db.user.create).not.toHaveBeenCalled();
      expect(result.role).toBe('ADMIN');
      expect(result.id).toBe('existing-admin-uuid');
    });
  });

  describe('assignUserRole (Elevation Protection)', () => {
    const customerActor: AuthSessionUser = {
      id: 'customer-actor',
      email: 'customer@example.com',
      role: 'CUSTOMER',
    };

    const adminActor: AuthSessionUser = {
      id: 'admin-actor',
      email: 'admin@example.com',
      role: 'ADMIN',
    };

    const superAdminActor: AuthSessionUser = {
      id: 'superadmin-actor',
      email: 'superadmin@example.com',
      role: 'SUPERADMIN',
    };

    test('throws error when a CUSTOMER attempts to elevate any role', async () => {
      await expect(
        assignUserRole('target-user-id', 'ADMIN', customerActor)
      ).rejects.toThrow(/Only SUPERADMIN can modify user roles/);
    });

    test('throws error when a normal ADMIN attempts to elevate role', async () => {
      await expect(
        assignUserRole('target-user-id', 'ADMIN', adminActor)
      ).rejects.toThrow(/Only SUPERADMIN can modify user roles/);
    });

    test('successfully elevates role when performed by SUPERADMIN', async () => {
      (db.user.update as jest.Mock).mockResolvedValue({
        id: 'target-user-id',
        email: 'promoted@naagnoolup.com',
        fullName: 'Promoted Admin',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await assignUserRole('target-user-id', 'ADMIN', superAdminActor);

      expect(db.user.update).toHaveBeenCalledWith({
        where: { id: 'target-user-id' },
        data: { role: 'ADMIN' },
      });

      expect(result.success).toBe(true);
      expect(result.user.role).toBe('ADMIN');
    });
  });
});
