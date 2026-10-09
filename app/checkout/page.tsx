import { Metadata } from 'next';
import { CheckoutView } from '@/components/commerce/CheckoutView';
import { getCurrentUser } from '@/lib/auth/server';
import { getPaymentSettingsAction } from '@/lib/actions/payment-settings';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Secure Checkout — Naag Nool UP',
  description: 'Complete your order of intentional guided journals and cultural tools.',
};

export default async function CheckoutPage() {
  const [user, paymentConfig] = await Promise.all([
    getCurrentUser(),
    getPaymentSettingsAction(),
  ]);

  return (
    <CheckoutView
      initialUserEmail={user?.email || ''}
      initialUserName={user?.fullName || ''}
      initialPaymentConfig={paymentConfig}
    />
  );
}
