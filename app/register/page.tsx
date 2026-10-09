import { Suspense } from 'react';
import { Metadata } from 'next';
import { AuthView } from '@/components/auth/AuthView';

export const metadata: Metadata = {
  title: 'Join the Sisterhood — Naag Nool UP',
  description: 'Create an account to begin your journey of resilience, purpose, and community.',
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-xs text-[#786E63]">
          Loading registration...
        </div>
      }
    >
      <AuthView initialMode="register" />
    </Suspense>
  );
}
