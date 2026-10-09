import { Metadata } from 'next';
import { CartView } from '@/components/commerce/CartView';

export const metadata: Metadata = {
  title: 'Shopping Bag — Naag Nool UP',
  description: 'Review the items in your Naag Nool UP shopping bag.',
};

export default function CartPage() {
  return <CartView />;
}
