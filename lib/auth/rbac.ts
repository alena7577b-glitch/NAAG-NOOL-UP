import { UserRole, AuthSessionUser } from './types';

export { type UserRole, type AuthSessionUser } from './types';

/**
 * NAAG NOOL UP — Role-Based Access Control (RBAC) Architecture
 *
 * Enforces role hierarchy and granular permissions.
 *
 * Role Hierarchy:
 * SUPERADMIN > ADMIN > CUSTOMER
 *
 * Security Principle:
 * Client metadata is NEVER trusted for role assignment.
 * All administrative actions verify roles against the server database.
 */

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  CUSTOMER: 1,
  ADMIN: 2,
  SUPERADMIN: 3,
};

/**
 * Check if user has at least the required role in hierarchy
 */
export function hasMinimumRole(user: AuthSessionUser | null | undefined, minimumRole: UserRole): boolean {
  if (!user || !user.role) return false;
  const userLevel = ROLE_HIERARCHY[user.role] ?? 0;
  const targetLevel = ROLE_HIERARCHY[minimumRole] ?? 999;
  return userLevel >= targetLevel;
}

/**
 * Check if user is an ADMIN or SUPERADMIN
 */
export function isAdmin(user?: AuthSessionUser | null): boolean {
  return hasMinimumRole(user, 'ADMIN');
}

/**
 * Check if user is strictly a SUPERADMIN
 */
export function isSuperAdmin(user?: AuthSessionUser | null): boolean {
  if (!user) return false;
  return user.role === 'SUPERADMIN';
}

/**
 * Check if user is a standard CUSTOMER
 */
export function isCustomer(user?: AuthSessionUser | null): boolean {
  if (!user) return false;
  return user.role === 'CUSTOMER';
}

/**
 * Permission: Manage Products & Inventory
 */
export function canManageProducts(user?: AuthSessionUser | null): boolean {
  return isAdmin(user);
}

/**
 * Permission: Manage Orders & Shipments
 */
export function canManageOrders(user?: AuthSessionUser | null): boolean {
  return isAdmin(user);
}

/**
 * Permission: Access Admin Dashboard UI
 */
export function canAccessAdminPanel(user?: AuthSessionUser | null): boolean {
  return isAdmin(user);
}

/**
 * Permission: Manage Content, CMS, and Blog Posts
 */
export function canManageCMS(user?: AuthSessionUser | null): boolean {
  return isAdmin(user);
}

/**
 * Permission: Manage Users and Roles (Super Admin only for role changes)
 */
export function canManageUsers(user?: AuthSessionUser | null): boolean {
  return isAdmin(user);
}

/**
 * Permission: Assign or modify administrative roles
 * STRICTLY restricted to Super Admin
 */
export function canAssignAdminRole(user?: AuthSessionUser | null): boolean {
  return isSuperAdmin(user);
}

/**
 * Permission: View financial reports & payment transaction details
 */
export function canViewFinancials(user?: AuthSessionUser | null): boolean {
  return isAdmin(user);
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: AuthSessionUser | null | undefined, allowedRoles: UserRole[]): boolean {
  if (!user || !user.role) return false;
  return allowedRoles.includes(user.role);
}
