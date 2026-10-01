/**
 * NAAG NOOL UP — RBAC & Permission Architecture Verification Tests
 */

import {
  AuthSessionUser,
  hasMinimumRole,
  isAdmin,
  isSuperAdmin,
  isCustomer,
  canManageProducts,
  canManageOrders,
  canManageCMS,
  canManageUsers,
  canAssignAdminRole,
  canViewFinancials,
  canAccessAdminPanel,
  hasAnyRole,
} from '../lib/auth/rbac';

describe('RBAC & Role-Based Authorization Engine', () => {
  const customerUser: AuthSessionUser = {
    id: 'usr_customer_123',
    email: 'customer@example.com',
    fullName: 'Test Customer',
    role: 'CUSTOMER',
  };

  const adminUser: AuthSessionUser = {
    id: 'usr_admin_456',
    email: 'admin@naagnoolup.com',
    fullName: 'Store Admin',
    role: 'ADMIN',
  };

  const superAdminUser: AuthSessionUser = {
    id: 'usr_superadmin_789',
    email: 'superadmin@naagnoolup.com',
    fullName: 'Executive Superadmin',
    role: 'SUPERADMIN',
  };

  describe('Unauthenticated User (null / undefined)', () => {
    test('rejects all permissions when user is null', () => {
      expect(isAdmin(null)).toBe(false);
      expect(isSuperAdmin(null)).toBe(false);
      expect(isCustomer(null)).toBe(false);
      expect(canManageProducts(null)).toBe(false);
      expect(canManageOrders(null)).toBe(false);
      expect(canManageCMS(null)).toBe(false);
      expect(canManageUsers(null)).toBe(false);
      expect(canAssignAdminRole(null)).toBe(false);
      expect(canAccessAdminPanel(null)).toBe(false);
      expect(canViewFinancials(null)).toBe(false);
    });

    test('rejects all permissions when user is undefined', () => {
      expect(isAdmin(undefined)).toBe(false);
      expect(isSuperAdmin(undefined)).toBe(false);
      expect(hasMinimumRole(undefined, 'CUSTOMER')).toBe(false);
    });
  });

  describe('CUSTOMER Role', () => {
    test('identifies customer correctly', () => {
      expect(isCustomer(customerUser)).toBe(true);
      expect(isAdmin(customerUser)).toBe(false);
      expect(isSuperAdmin(customerUser)).toBe(false);
    });

    test('denies all administrative capabilities to CUSTOMER', () => {
      expect(canManageProducts(customerUser)).toBe(false);
      expect(canManageOrders(customerUser)).toBe(false);
      expect(canManageCMS(customerUser)).toBe(false);
      expect(canManageUsers(customerUser)).toBe(false);
      expect(canAssignAdminRole(customerUser)).toBe(false);
      expect(canAccessAdminPanel(customerUser)).toBe(false);
      expect(canViewFinancials(customerUser)).toBe(false);
    });

    test('satisfies minimum role CUSTOMER', () => {
      expect(hasMinimumRole(customerUser, 'CUSTOMER')).toBe(true);
      expect(hasMinimumRole(customerUser, 'ADMIN')).toBe(false);
      expect(hasMinimumRole(customerUser, 'SUPERADMIN')).toBe(false);
    });
  });

  describe('ADMIN Role', () => {
    test('identifies admin correctly', () => {
      expect(isCustomer(adminUser)).toBe(false);
      expect(isAdmin(adminUser)).toBe(true);
      expect(isSuperAdmin(adminUser)).toBe(false);
    });

    test('grants standard operational administration', () => {
      expect(canManageProducts(adminUser)).toBe(true);
      expect(canManageOrders(adminUser)).toBe(true);
      expect(canManageCMS(adminUser)).toBe(true);
      expect(canManageUsers(adminUser)).toBe(true);
      expect(canAccessAdminPanel(adminUser)).toBe(true);
      expect(canViewFinancials(adminUser)).toBe(true);
    });

    test('strictly denies role assignment capability to standard ADMIN', () => {
      // Prevents privilege escalation by normal administrators
      expect(canAssignAdminRole(adminUser)).toBe(false);
    });

    test('satisfies role hierarchy levels up to ADMIN', () => {
      expect(hasMinimumRole(adminUser, 'CUSTOMER')).toBe(true);
      expect(hasMinimumRole(adminUser, 'ADMIN')).toBe(true);
      expect(hasMinimumRole(adminUser, 'SUPERADMIN')).toBe(false);
    });
  });

  describe('SUPERADMIN Role', () => {
    test('identifies superadmin correctly', () => {
      expect(isCustomer(superAdminUser)).toBe(false);
      expect(isAdmin(superAdminUser)).toBe(true);
      expect(isSuperAdmin(superAdminUser)).toBe(true);
    });

    test('grants all permissions including administrative role assignment', () => {
      expect(canManageProducts(superAdminUser)).toBe(true);
      expect(canManageOrders(superAdminUser)).toBe(true);
      expect(canManageCMS(superAdminUser)).toBe(true);
      expect(canManageUsers(superAdminUser)).toBe(true);
      expect(canAssignAdminRole(superAdminUser)).toBe(true);
      expect(canAccessAdminPanel(superAdminUser)).toBe(true);
      expect(canViewFinancials(superAdminUser)).toBe(true);
    });

    test('satisfies all hierarchy levels', () => {
      expect(hasMinimumRole(superAdminUser, 'CUSTOMER')).toBe(true);
      expect(hasMinimumRole(superAdminUser, 'ADMIN')).toBe(true);
      expect(hasMinimumRole(superAdminUser, 'SUPERADMIN')).toBe(true);
    });
  });

  describe('hasAnyRole Helper', () => {
    test('matches allowed roles correctly', () => {
      expect(hasAnyRole(customerUser, ['CUSTOMER', 'ADMIN'])).toBe(true);
      expect(hasAnyRole(customerUser, ['ADMIN', 'SUPERADMIN'])).toBe(false);
      expect(hasAnyRole(adminUser, ['ADMIN', 'SUPERADMIN'])).toBe(true);
      expect(hasAnyRole(superAdminUser, ['SUPERADMIN'])).toBe(true);
      expect(hasAnyRole(null, ['CUSTOMER'])).toBe(false);
    });
  });
});
