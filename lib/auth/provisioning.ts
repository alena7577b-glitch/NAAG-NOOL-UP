import { type User as SupabaseAuthUser } from '@supabase/supabase-js';
import { db } from '../db';
import { AuthSessionUser, UserRole } from './types';
import { canAssignAdminRole } from './rbac';
import { getAdminSupabaseClient } from '../supabase/admin';
import { logger } from '../logger';

/**
 * NAAG NOOL UP — User Provisioning & Identity Synchronization Service
 *
 * Coordinates identity mapping between:
 * - Supabase Auth (auth.users)
 * - Application Database (public.User)
 *
 * Security Invariants:
 * 1. Default role for any new user is STRICTLY 'CUSTOMER'.
 * 2. Self-assignment of privileged roles (ADMIN, SUPERADMIN) is completely impossible.
 * 3. Role elevation requires an existing SUPERADMIN performing the action via server-side logic.
 */

/**
 * Ensures an application-level public.User record exists for a Supabase Auth user.
 * Idempotent: returns existing user or creates a new one.
 */
export async function provisionUserFromSupabase(
  supabaseUser: SupabaseAuthUser
): Promise<AuthSessionUser> {
  if (!supabaseUser || !supabaseUser.id || !supabaseUser.email) {
    throw new Error('Cannot provision user: invalid Supabase user payload');
  }

  const email = supabaseUser.email.toLowerCase().trim();
  const fullName =
    (supabaseUser.user_metadata?.full_name as string) ||
    (supabaseUser.user_metadata?.name as string) ||
    null;

  try {
    // 1. Check if user already exists by ID (Primary UUID match)
    const existingById = await db.user.findUnique({
      where: { id: supabaseUser.id },
    });

    if (existingById) {
      // Sync full name or email if changed, but NEVER overwrite existing role from client
      if (existingById.email !== email || (fullName && existingById.fullName !== fullName)) {
        const updated = await db.user.update({
          where: { id: existingById.id },
          data: {
            email,
            fullName: fullName || existingById.fullName,
          },
        });
        return {
          id: updated.id,
          email: updated.email,
          fullName: updated.fullName,
          role: updated.role as UserRole,
          createdAt: updated.createdAt,
          updatedAt: updated.updatedAt,
        };
      }

      return {
        id: existingById.id,
        email: existingById.email,
        fullName: existingById.fullName,
        role: existingById.role as UserRole,
        createdAt: existingById.createdAt,
        updatedAt: existingById.updatedAt,
      };
    }

    // 2. Check if user exists by email (e.g. existing email before Supabase Auth linkage)
    const existingByEmail = await db.user.findUnique({
      where: { email },
    });

    if (existingByEmail) {
      // If found by email with different ID, update the ID to align with Supabase Auth UUID
      logger.info(`Linking existing public.User (${email}) to Supabase Auth ID ${supabaseUser.id}`);
      const updated = await db.user.update({
        where: { id: existingByEmail.id },
        data: {
          id: supabaseUser.id,
          fullName: fullName || existingByEmail.fullName,
        },
      });
      return {
        id: updated.id,
        email: updated.email,
        fullName: updated.fullName,
        role: updated.role as UserRole,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      };
    }

    // 3. New User: Provision with default role 'CUSTOMER'
    logger.info(`Provisioning new application user: ${email} (${supabaseUser.id}) with role CUSTOMER`);
    const newUser = await db.user.create({
      data: {
        id: supabaseUser.id,
        email,
        fullName,
        role: 'CUSTOMER', // Default role cannot be overridden
      },
    });

    return {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role as UserRole,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
  } catch (error) {
    logger.error(`Error during user provisioning for ${email}:`, error);
    throw error;
  }
}

/**
 * Administrative function to assign a user role.
 * Requires the performing actor to have SUPERADMIN role.
 */
export async function assignUserRole(
  targetUserId: string,
  targetRole: UserRole,
  actor: AuthSessionUser
): Promise<{ success: boolean; user: AuthSessionUser }> {
  // Authorization check: only SUPERADMIN can assign administrative roles
  if (!canAssignAdminRole(actor)) {
    logger.warn(
      `Unauthorized role assignment attempt by user ${actor.id} (${actor.email}) attempting to set ${targetRole} for ${targetUserId}`
    );
    throw new Error('Forbidden: Only SUPERADMIN can modify user roles.');
  }

  // 1. Update database record
  const updatedUser = await db.user.update({
    where: { id: targetUserId },
    data: { role: targetRole },
  });

  // 2. Sync to Supabase Auth app_metadata if admin client is configured
  const adminClient = getAdminSupabaseClient();
  if (adminClient) {
    try {
      await adminClient.auth.admin.updateUserById(targetUserId, {
        app_metadata: { role: targetRole },
      });
      logger.info(`Updated Supabase Auth app_metadata for user ${targetUserId} to role ${targetRole}`);
    } catch (err) {
      logger.error(`Failed to sync app_metadata to Supabase Auth for user ${targetUserId}:`, err);
      // We don't fail the operation since the database is the primary source of truth
    }
  }

  return {
    success: true,
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      role: updatedUser.role as UserRole,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    },
  };
}
