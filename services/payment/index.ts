/**
 * NAAG NOOL UP — Payment Gateway Service Dispatcher
 */

import { PaymentProvider } from './types';
import { MockPaymentProvider } from './mockProvider';
import { StripePaymentProvider } from './stripeProvider';
import { SoomarPayProvider } from './soomarPayProvider';

export * from './types';
export * from './mockProvider';
export * from './stripeProvider';
export * from './soomarPayProvider';

export function getPaymentProvider(): PaymentProvider {
  const soomarProvider = new SoomarPayProvider();
  if (soomarProvider.isConfigured() || process.env.PAYMENT_PROVIDER === 'soomarpay') {
    return soomarProvider;
  }

  const stripeProvider = new StripePaymentProvider();
  if (stripeProvider.isConfigured() || process.env.PAYMENT_PROVIDER === 'stripe') {
    return stripeProvider;
  }

  // If in production and no credentials configured, provider returns PAYMENT_ACTIVATION_BLOCKED
  if (process.env.NODE_ENV === 'production') {
    return soomarProvider;
  }

  // In test/local dev environment without keys, return sandbox mock provider
  return new MockPaymentProvider();
}

export const activePaymentProvider = getPaymentProvider();
