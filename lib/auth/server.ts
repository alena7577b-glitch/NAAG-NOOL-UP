import { getServerSupabaseClient } from '../supabase/server';
import { provisionUserFromSupabase } from './provisioning';
import { AuthSessionUser, UserRole } from './types';
import { hasAnyRole, isAdmin, isSuperAdmin } from './rbac';
import { logger } from '../logger';

/**
 * NAAG NOOL UP — Server-Side Authentication & Authorization Helpers
 *
 * For Server Components, Server Actions, and Route Handlers.
 * Authoritative: Performs database-backed authorization verification.
 */

export class AuthenticationError extends Error {
  statusCode: number;
  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
  }
}

export class AuthorizationError extends Error {
  statusCode: number;
  constructor(message = 'Forbidden: insufficient permissions') {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = 403;
  }
}

/**
 * Get current authenticated session from Supabase server client
 */
export async function getAuthSession() {
  const supabase = await getServerSupabaseClient();
  if (!supabase) return null;

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) return null;
    return session;
  } catch (error) {
    logger.error('Error fetching Supabase session:', error);
    return null;
  }
}

/**
 * Get the current authenticated application user.
 * 1. Validates Supabase Auth user securely with getUser()
 * 2. Fetches/provisions corresponding public.User record from PostgreSQL
 */
export async function getCurrentUser(): Promise<AuthSessionUser | null> {
  const supabase = await getServerSupabaseClient();
  if (!supabase) return null;

  try {
    const {
      data: { user: authUser },
      error,
    } = await supabase.auth.getUser();

    if (error || !authUser) {
      return null;
    }

    // Synchronize / read authoritative application user record
    return await provisionUserFromSupabase(authUser);
  } catch (error) {
    logger.error('Error in getCurrentUser:', error);
    return null;
  }
}

/**
 * Check if a request has an active authenticated user
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return Boolean(user);
}

/**
 * Server guard: requires an authenticated user.
 * Throws AuthenticationError (401) if not logged in.
 */
export async function requireAuthenticatedUser(): Promise<AuthSessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthenticationError('You must be signed in to perform this action.');
  }
  return user;
}

/**
 * Server guard: requires specific role(s).
 * Throws AuthenticationError (401) or AuthorizationError (403).
 */
export async function requireRole(allowedRoles: UserRole | UserRole[]): Promise<AuthSessionUser> {
  const user = await requireAuthenticatedUser();
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!hasAnyRole(user, rolesArray)) {
    logger.warn(
      `Forbidden access attempt: user ${user.id} (${user.role}) required [${rolesArray.join(', ')}]`
    );
    throw new AuthorizationError(
      `Access denied. Requires one of roles: ${rolesArray.join(', ')}.`
    );
  }

  return user;
}

/**
 * Server guard: requires ADMIN or SUPERADMIN role.
 */
export async function requireAdmin(): Promise<AuthSessionUser> {
  const user = await requireAuthenticatedUser();
  if (!isAdmin(user)) {
    logger.warn(`Non-admin user ${user.id} attempted to access admin resource`);
    throw new AuthorizationError('Administrative privileges required.');
  }
  return user;
}

/**
 * Server guard: strictly requires SUPERADMIN role.
 */
export async function requireSuperAdmin(): Promise<AuthSessionUser> {
  const user = await requireAuthenticatedUser();
  if (!isSuperAdmin(user)) {
    logger.warn(`Non-superadmin user ${user.id} attempted to access superadmin resource`);
    throw new AuthorizationError('Super Administrator privileges required.');
  }
  return user;
}

/**
 * Server sign-out utility
 */
export async function serverSignOut(): Promise<{ success: boolean; error?: string }> {
  const supabase = await getServerSupabaseClient();
  if (!supabase) return { success: true };

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      logger.error('Error signing out:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error) {
    logger.error('Unexpected error during sign-out:', error);
    return { success: false, error: 'Sign out failed' };
  }
}
