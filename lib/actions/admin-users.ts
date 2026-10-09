'use server';

import { db } from '@/lib/db';
import { requireSuperAdmin } from '@/lib/auth/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { logger } from '@/lib/logger';
import { Role } from '@prisma/client';

export interface CreateStaffInput {
  email: string;
  password: string;
  fullName: string;
  role: 'ADMIN' | 'SUPERADMIN';
}

export async function getAdminUsersList() {
  await requireSuperAdmin();

  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return users.map((u) => ({
    id: u.id,
    email: u.email,
    fullName: u.fullName || '',
    role: u.role,
    createdAt: u.createdAt.toISOString(),
  }));
}

export async function createStaffAccountAction(input: CreateStaffInput) {
  try {
    await requireSuperAdmin();

    const email = input.email.trim().toLowerCase();
    const password = input.password.trim();
    const fullName = input.fullName.trim();
    const role = input.role;

    if (!email || !email.includes('@')) {
      return { success: false, error: 'A valid email address is required.' };
    }

    if (!password || password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters.' };
    }

    const supabaseAdmin = createAdminClient();

    // 1. Create in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role,
        full_name: fullName,
        name: fullName,
      },
    });

    if (authError) {
      logger.error('Failed to create user in Supabase Auth:', authError);
      return { success: false, error: authError.message };
    }

    const userId = authData.user.id;

    // 2. Persist in application database
    const user = await db.user.upsert({
      where: { email },
      create: {
        id: userId,
        email,
        fullName,
        role: role as Role,
      },
      update: {
        fullName,
        role: role as Role,
      },
    });

    logger.info(`Super Admin created staff user: ${email} (${role})`);
    return { success: true, user: { id: user.id, email: user.email, role: user.role } };
  } catch (err: unknown) {
    logger.error('Error in createStaffAccountAction:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to create staff account.',
    };
  }
}

export async function updateUserRoleAction(userId: string, newRole: Role) {
  try {
    const superAdmin = await requireSuperAdmin();

    // Prevent demoting own superadmin account
    const targetUser = await db.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return { success: false, error: 'User not found.' };
    }

    if (targetUser.email.toLowerCase() === 'info@naagnoolup.com' && newRole !== 'SUPERADMIN') {
      return { success: false, error: 'Cannot demote the primary Super Administrator account.' };
    }

    // 1. Update in database
    await db.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    // 2. Update metadata in Supabase Auth
    try {
      const supabaseAdmin = createAdminClient();
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: { role: newRole },
      });
    } catch (syncErr) {
      logger.warn('Failed to sync updated role to Supabase metadata:', syncErr);
    }

    logger.info(`Super Admin ${superAdmin.email} changed user ${targetUser.email} role to ${newRole}`);
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update user role.',
    };
  }
}

export async function deleteUserAccountAction(userId: string) {
  try {
    await requireSuperAdmin();

    const targetUser = await db.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return { success: false, error: 'User not found.' };
    }

    if (targetUser.email.toLowerCase() === 'info@naagnoolup.com') {
      return { success: false, error: 'The primary Super Administrator account cannot be deleted.' };
    }

    // 1. Delete from database
    await db.user.delete({ where: { id: userId } });

    // 2. Delete from Supabase Auth
    try {
      const supabaseAdmin = createAdminClient();
      await supabaseAdmin.auth.admin.deleteUser(userId);
    } catch (authErr) {
      logger.warn('Failed to delete user in Supabase Auth:', authErr);
    }

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to delete user.',
    };
  }
}
