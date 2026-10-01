/**
 * NAAG NOOL UP — Authentication Server Actions Tests
 */

import {
  registerAction,
  loginAction,
  adminLoginAction,
  forgotPasswordAction,
  resetPasswordAction,
  updateProfileAction,
  updatePasswordAction,
} from '../lib/auth/actions';
import { getServerSupabaseClient } from '../lib/supabase/server';
import { db } from '../lib/db';
import { requireAuthenticatedUser, serverSignOut } from '../lib/auth/server';

// Mock dependencies
jest.mock('../lib/supabase/server', () => ({
  getServerSupabaseClient: jest.fn(),
}));

jest.mock('../lib/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('../lib/auth/server', () => ({
  getCurrentUser: jest.fn(),
  requireAuthenticatedUser: jest.fn(),
  serverSignOut: jest.fn(),
}));

describe('Authentication Server Actions', () => {
  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase = {
      auth: {
        signUp: jest.fn(),
        signInWithPassword: jest.fn(),
        signOut: jest.fn(),
        resetPasswordForEmail: jest.fn(),
        updateUser: jest.fn(),
      },
    };
    (getServerSupabaseClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  describe('registerAction', () => {
    test('validates payload and signs up customer', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: {
          user: { id: 'usr-1', email: 'test@naagnoolup.com' },
          session: null,
        },
        error: null,
      });

      const result = await registerAction({
        fullName: 'Ayan Warsame',
        email: 'test@naagnoolup.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      });

      expect(result.success).toBe(true);
      expect(result.requiresEmailConfirmation).toBe(true);
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@naagnoolup.com',
        password: 'SecurePass123!',
        options: expect.objectContaining({
          data: {
            full_name: 'Ayan Warsame',
          },
        }),
      });
    });

    test('fails if passwords do not match', async () => {
      const result = await registerAction({
        fullName: 'Ayan Warsame',
        email: 'test@naagnoolup.com',
        password: 'SecurePass123!',
        confirmPassword: 'DifferentPassword!',
      });

      expect(result.success).toBe(false);
      expect(result.fieldErrors?.confirmPassword?.[0]).toContain('Passwords do not match');
      expect(mockSupabase.auth.signUp).not.toHaveBeenCalled();
    });
  });

  describe('loginAction', () => {
    test('authenticates valid credentials and returns redirectUrl', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: {
          user: { id: 'usr-1', email: 'test@naagnoolup.com' },
          session: {},
        },
        error: null,
      });

      (db.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'usr-1',
        email: 'test@naagnoolup.com',
        role: 'CUSTOMER',
      });

      const result = await loginAction({
        email: 'test@naagnoolup.com',
        password: 'SecurePass123!',
      });

      expect(result.success).toBe(true);
      expect(result.redirectUrl).toBe('/account');
    });

    test('returns error for invalid credentials', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' },
      });

      const result = await loginAction({
        email: 'test@naagnoolup.com',
        password: 'WrongPassword123!',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid email or password');
    });
  });

  describe('adminLoginAction (Role Isolation Protection)', () => {
    test('denies CUSTOMER access to admin portal and terminates session', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: {
          user: { id: 'customer-id', email: 'cust@naagnoolup.com' },
          session: {},
        },
        error: null,
      });

      (db.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'customer-id',
        email: 'cust@naagnoolup.com',
        role: 'CUSTOMER',
      });

      const result = await adminLoginAction({
        email: 'cust@naagnoolup.com',
        password: 'ValidCustomerPass!',
      });

      expect(serverSignOut).toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.error).toContain('Access denied');
    });

    test('grants ADMIN and SUPERADMIN access and redirects to /admin', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: {
          user: { id: 'admin-id', email: 'admin@naagnoolup.com' },
          session: {},
        },
        error: null,
      });

      (db.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'admin-id',
        email: 'admin@naagnoolup.com',
        role: 'ADMIN',
      });

      const result = await adminLoginAction({
        email: 'admin@naagnoolup.com',
        password: 'AdminPass123!',
      });

      expect(result.success).toBe(true);
      expect(result.redirectUrl).toBe('/admin');
    });
  });

  describe('forgotPasswordAction & resetPasswordAction', () => {
    test('sends password reset link to user email', async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: null,
      });

      const result = await forgotPasswordAction({
        email: 'user@example.com',
      });

      expect(result.success).toBe(true);
      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'user@example.com',
        expect.objectContaining({
          redirectTo: expect.stringContaining('/auth/callback?next=/reset-password'),
        })
      );
    });

    test('updates password with new credentials', async () => {
      mockSupabase.auth.updateUser.mockResolvedValue({
        data: { user: {} },
        error: null,
      });

      const result = await resetPasswordAction({
        password: 'NewSecretPass123!',
        confirmPassword: 'NewSecretPass123!',
      });

      expect(result.success).toBe(true);
      expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
        password: 'NewSecretPass123!',
      });
    });
  });

  describe('updateProfileAction & updatePasswordAction', () => {
    test('updates profile in Prisma and Supabase auth metadata', async () => {
      (requireAuthenticatedUser as jest.Mock).mockResolvedValue({
        id: 'usr-1',
        email: 'user@example.com',
        role: 'CUSTOMER',
      });

      (db.user.update as jest.Mock).mockResolvedValue({
        id: 'usr-1',
        fullName: 'Updated Name',
      });

      mockSupabase.auth.updateUser.mockResolvedValue({
        data: {},
        error: null,
      });

      const result = await updateProfileAction({
        fullName: 'Updated Name',
      });

      expect(result.success).toBe(true);
      expect(db.user.update).toHaveBeenCalledWith({
        where: { id: 'usr-1' },
        data: { fullName: 'Updated Name' },
      });
    });

    test('changes user password after verifying current password', async () => {
      (requireAuthenticatedUser as jest.Mock).mockResolvedValue({
        id: 'usr-1',
        email: 'user@example.com',
        role: 'CUSTOMER',
      });

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: 'usr-1' } },
        error: null,
      });

      mockSupabase.auth.updateUser.mockResolvedValue({
        data: {},
        error: null,
      });

      const result = await updatePasswordAction({
        currentPassword: 'OldPass123!',
        newPassword: 'BrandNewPass123!',
        confirmPassword: 'BrandNewPass123!',
      });

      expect(result.success).toBe(true);
      expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
        password: 'BrandNewPass123!',
      });
    });
  });
});
