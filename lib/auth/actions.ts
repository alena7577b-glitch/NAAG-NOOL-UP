'use server';

import { redirect } from 'next/navigation';
import { getServerSupabaseClient } from '../supabase/server';
import { provisionUserFromSupabase } from './provisioning';
import { requireAuthenticatedUser, serverSignOut } from './server';
import { isAdmin } from './rbac';
import { db } from '../db';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  updatePasswordSchema,
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  UpdateProfileInput,
  UpdatePasswordInput,
} from '../validation/schemas';
import { logger } from '../logger';

/**
 * NAAG NOOL UP — Server Actions for Authentication & Profile Operations
 */

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  redirectUrl?: string;
  requiresEmailConfirmation?: boolean;
}

/**
 * Customer Registration Server Action
 */
export async function registerAction(input: RegisterInput): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Please correct the errors in the form.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { fullName, email, password } = parsed.data;

  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      error: 'Authentication service is temporarily unavailable. Please try again later.',
    };
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${siteUrl}/auth/callback?next=/account`,
      },
    });

    if (authError) {
      logger.warn(`Registration error for ${email}: ${authError.message}`);
      return {
        success: false,
        error: authError.message,
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'Registration could not be completed. Please try again.',
      };
    }

    // Provision user in application database with strictly CUSTOMER role
    try {
      await provisionUserFromSupabase(authData.user);
    } catch (provErr) {
      logger.error('Failed to provision user record during registration:', provErr);
    }

    // Check if email confirmation is required by Supabase Auth configuration
    const requiresEmailConfirmation = !authData.session;

    return {
      success: true,
      requiresEmailConfirmation,
      redirectUrl: requiresEmailConfirmation ? undefined : '/account',
    };
  } catch (err: unknown) {
    logger.error('Unexpected error during registration:', err);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Customer Login Server Action
 */
export async function loginAction(
  input: LoginInput,
  returnUrl = '/account'
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Please enter a valid email and password.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password } = parsed.data;

  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      error: 'Authentication service is temporarily unavailable.',
    };
  }

  try {
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user) {
      logger.warn(`Login failure for ${email}: ${authError?.message}`);
      return {
        success: false,
        error: 'Invalid email or password. Please check your credentials.',
      };
    }

    // Synchronize application user record in PostgreSQL
    await provisionUserFromSupabase(authData.user);

    // Sanitize returnUrl (prevent open redirects)
    const safeReturnUrl =
      returnUrl.startsWith('/') && !returnUrl.startsWith('//')
        ? returnUrl
        : '/account';

    return {
      success: true,
      redirectUrl: safeReturnUrl,
    };
  } catch (err: unknown) {
    logger.error('Unexpected error during login:', err);
    return {
      success: false,
      error: 'An unexpected error occurred during sign in.',
    };
  }
}

/**
 * Administrator Login Server Action
 * Strictly enforces ADMIN or SUPERADMIN role authorization
 */
export async function adminLoginAction(input: LoginInput): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Please enter a valid administrator email and password.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password } = parsed.data;

  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      error: 'Authentication service is temporarily unavailable.',
    };
  }

  try {
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user) {
      logger.warn(`Admin login failure for ${email}: ${authError?.message}`);
      return {
        success: false,
        error: 'Invalid administrator credentials.',
      };
    }

    // Verify user role in PostgreSQL database
    const appUser = await provisionUserFromSupabase(authData.user);

    if (!isAdmin(appUser)) {
      logger.warn(
        `Non-admin user ${appUser.id} (${appUser.email}) attempted admin portal login`
      );
      // Immediately terminate the session for unauthorized portal access
      await serverSignOut();
      return {
        success: false,
        error: 'Access denied: You do not have administrative privileges.',
      };
    }

    return {
      success: true,
      redirectUrl: '/admin',
    };
  } catch (err: unknown) {
    logger.error('Unexpected error during admin login:', err);
    return {
      success: false,
      error: 'An unexpected error occurred during administrative authentication.',
    };
  }
}

/**
 * Password Recovery Request Server Action
 */
export async function forgotPasswordAction(
  input: ForgotPasswordInput
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Please enter a valid email address.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email } = parsed.data;

  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      error: 'Authentication service is temporarily unavailable.',
    };
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
    });

    // Always return success to prevent email enumeration attacks
    return {
      success: true,
      data: {
        message:
          'If an account exists with this email address, you will receive password reset instructions shortly.',
      },
    };
  } catch (err: unknown) {
    logger.error('Error during password recovery request:', err);
    return {
      success: false,
      error: 'An error occurred while sending the reset link. Please try again.',
    };
  }
}

/**
 * Password Reset (New Password) Server Action
 */
export async function resetPasswordAction(
  input: ResetPasswordInput
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Please enter a valid password (minimum 8 characters with letters and numbers).',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { password } = parsed.data;

  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      error: 'Authentication service is temporarily unavailable.',
    };
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      logger.warn(`Password reset error: ${error.message}`);
      return {
        success: false,
        error:
          error.message ||
          'Your password reset session has expired or is invalid. Please request a new link.',
      };
    }

    return {
      success: true,
      redirectUrl: '/login?reset=success',
    };
  } catch (err: unknown) {
    logger.error('Unexpected error during password reset:', err);
    return {
      success: false,
      error: 'Failed to reset password. Please try again.',
    };
  }
}

/**
 * User Profile Update Server Action
 */
export async function updateProfileAction(
  input: UpdateProfileInput
): Promise<ActionResult> {
  const user = await requireAuthenticatedUser();

  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Please provide a valid name.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { fullName } = parsed.data;

  try {
    const updated = await db.user.update({
      where: { id: user.id },
      data: { fullName },
    });

    // Also update metadata in Supabase
    const supabase = await getServerSupabaseClient();
    if (supabase) {
      await supabase.auth.updateUser({
        data: { full_name: fullName },
      });
    }

    return {
      success: true,
      data: {
        id: updated.id,
        email: updated.email,
        fullName: updated.fullName,
        role: updated.role,
      },
    };
  } catch (err: unknown) {
    logger.error(`Error updating profile for user ${user.id}:`, err);
    return {
      success: false,
      error: 'Failed to update profile. Please try again.',
    };
  }
}

/**
 * Password Update Server Action (Authenticated from Settings)
 */
export async function updatePasswordAction(
  input: UpdatePasswordInput
): Promise<ActionResult> {
  const user = await requireAuthenticatedUser();

  const parsed = updatePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Please provide a valid new password.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { currentPassword, newPassword } = parsed.data;

  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      error: 'Authentication service is temporarily unavailable.',
    };
  }

  try {
    // Verify current password first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      return {
        success: false,
        error: 'The current password you entered is incorrect.',
      };
    }

    // Update to new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return {
        success: false,
        error: updateError.message || 'Failed to update password.',
      };
    }

    return {
      success: true,
      data: { message: 'Your password has been changed successfully.' },
    };
  } catch (err: unknown) {
    logger.error(`Error updating password for user ${user.id}:`, err);
    return {
      success: false,
      error: 'An unexpected error occurred while updating your password.',
    };
  }
}

/**
 * Sign Out Server Action
 */
export async function logoutAction(): Promise<void> {
  await serverSignOut();
  redirect('/login');
}
