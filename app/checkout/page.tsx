import { Metadata } from 'next';
import { CheckoutView } from '@/components/commerce/CheckoutView';
import { getCurrentUser } from '@/lib/auth/server';

export const metadata: Metadata = {
  title: 'Secure Checkout — Naag Nool UP',
  description: 'Complete your order of intentional guided journals and cultural tools.',
};

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  return (
    <CheckoutView
      initialUserEmail={user?.email || ''}
      initialUserName={user?.fullName || ''}
    />
  );
}
