'use server';

import { db } from '@/lib/db';
import { communitySignupSchema, contactSubmissionSchema } from '@/lib/validation/schemas';
import { logger } from '@/lib/logger';

export interface FormActionResult {
  success: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

/**
 * Handle Community Member Signup
 */
export async function submitCommunitySignup(
  _prevState: FormActionResult | null,
  formData: FormData
): Promise<FormActionResult> {
  try {
    const rawData = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      marketingConsent: formData.get('marketingConsent') === 'on' || formData.get('marketingConsent') === 'true',
    };

    const parsed = communitySignupSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        error: 'Please correct the errors in the form.',
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const { fullName, email, marketingConsent } = parsed.data;
    const cleanEmail = email.trim().toLowerCase();

    // Check if user already signed up (case-insensitive check)
    const existing = await db.communitySignup.findFirst({
      where: {
        email: {
          equals: cleanEmail,
          mode: 'insensitive',
        },
      },
    });

    if (existing) {
      return {
        success: true,
        message: "You're already part of the Naag Nool UP movement! Thank you for your continued support.",
      };
    }

    await db.communitySignup.create({
      data: {
        fullName: fullName.trim(),
        email: cleanEmail,
        marketingConsent,
      },
    });

    logger.info(`New community member joined: ${cleanEmail}`);

    return {
      success: true,
      message: "You're in. Welcome to Naag Nool UP!",
    };
  } catch (err: unknown) {
    logger.error('Failed to process community signup', err);

    // If duplicate entry due to race condition or unique index constraint
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: string }).code === 'P2002'
    ) {
      return {
        success: true,
        message: "You're already part of the Naag Nool UP movement! Thank you for your continued support.",
      };
    }

    return {
      success: false,
      error: 'Unable to submit your registration at this time. Please try again in a moment.',
    };
  }
}

/**
 * Handle Contact & Partnership Inquiry Submission
 */
export async function submitContactInquiry(
  _prevState: FormActionResult | null,
  formData: FormData
): Promise<FormActionResult> {
  try {
    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    const parsed = contactSubmissionSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        error: 'Please fill in all required fields correctly.',
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const { name, email, subject, message } = parsed.data;

    await db.contactSubmission.create({
      data: {
        name,
        email,
        subject,
        message,
        status: 'UNREAD',
      },
    });

    logger.info(`New contact inquiry received from ${email}: ${subject}`);

    // Dispatch asynchronous notification to admin inbox via Resend
    try {
      const { emailService } = await import('@/services/email');
      await emailService.sendContactInquiryNotification({
        name,
        email,
        subject,
        message,
      });
    } catch (emailErr) {
      logger.warn('Failed to send inquiry email notification (submission preserved in DB):', emailErr);
    }

    return {
      success: true,
      message: 'Thank you for reaching out. We have received your message and will respond shortly.',
    };
  } catch (err: unknown) {
    logger.error('Failed to submit contact inquiry', err);
    return {
      success: false,
      error: 'An unexpected error occurred while sending your message. Please try again later.',
    };
  }
}
