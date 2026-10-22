/**
 * NAAG NOOL UP — Payment Gateway Service Dispatcher
 * Active Providers: Stripe (Card, Apple Pay, Google Pay) and PayPal.
 */

import { PaymentProvider } from './types';
import { MockPaymentProvider } from './mockProvider';
import { StripePaymentProvider } from './stripeProvider';
import { PayPalPaymentProvider } from './paypalProvider';

export * from './types';
export * from './mockProvider';
export * from './stripeProvider';
export * from './paypalProvider';

export function getPaymentProvider(method?: 'STRIPE' | 'PAYPAL' | string): PaymentProvider {
  const stripeProvider = new StripePaymentProvider();
  const paypalProvider = new PayPalPaymentProvider();

  // If explicit method specified:
  if (method === 'PAYPAL' || method === 'paypal') {
    if (paypalProvider.isConfigured() || process.env.NODE_ENV === 'production') {
      return paypalProvider;
    }
    return new MockPaymentProvider();
  }

  if (method === 'STRIPE' || method === 'CARD' || method === 'stripe' || method === 'card') {
    if (stripeProvider.isConfigured() || process.env.NODE_ENV === 'production') {
      return stripeProvider;
    }
    return new MockPaymentProvider();
  }

  // Automatic preference: Stripe first, then PayPal
  if (stripeProvider.isConfigured()) {
    return stripeProvider;
  }

  if (paypalProvider.isConfigured()) {
    return paypalProvider;
  }

  // Production fallback: Stripe provider
  if (process.env.NODE_ENV === 'production') {
    return stripeProvider;
  }

  // In test/local dev environment without keys, return sandbox mock provider
  return new MockPaymentProvider();
}

export const activePaymentProvider = getPaymentProvider();
