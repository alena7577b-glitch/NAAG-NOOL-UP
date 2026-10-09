'use server';

import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/server';
import { logger } from '@/lib/logger';

export interface PaymentMethodsConfig {
  cardEnabled: boolean;
  mobileMoneyEnabled: boolean;
  evcEnabled: boolean;
  zaadEnabled: boolean;
  sahalEnabled: boolean;
  edahabEnabled: boolean;
  premierEnabled: boolean;
}

export const DEFAULT_PAYMENT_CONFIG: PaymentMethodsConfig = {
  cardEnabled: true,
  mobileMoneyEnabled: true,
  evcEnabled: true,
  zaadEnabled: true,
  sahalEnabled: true,
  edahabEnabled: true,
  premierEnabled: true,
};

export async function getPaymentSettingsAction(): Promise<PaymentMethodsConfig> {
  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: 'payment_methods' },
    });

    if (setting && typeof setting.value === 'object' && setting.value !== null) {
      return {
        ...DEFAULT_PAYMENT_CONFIG,
        ...(setting.value as Record<string, any>),
      };
    }
  } catch (err) {
    logger.warn('Failed to fetch payment_methods from db, returning defaults:', err);
  }

  return DEFAULT_PAYMENT_CONFIG;
}

export async function updatePaymentSettingsAction(config: PaymentMethodsConfig) {
  try {
    await requireAdmin();

    await db.siteSetting.upsert({
      where: { key: 'payment_methods' },
      create: {
        key: 'payment_methods',
        value: config as any,
      },
      update: {
        value: config as any,
      },
    });

    logger.info('Payment methods configuration updated successfully');
    return { success: true };
  } catch (err: unknown) {
    logger.error('Failed to update payment methods:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update payment settings.',
    };
  }
}
