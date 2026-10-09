import { Suspense } from 'react';
import { Metadata } from 'next';
import { AuthView } from '@/components/auth/AuthView';

export const metadata: Metadata = {
  title: 'Sign In — Naag Nool UP',
  description: 'Sign in to access your guided reflections, orders, and the sisterhood circle.',
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-xs text-[#786E63]">
          Loading sign in...
        </div>
      }
    >
      <AuthView initialMode="login" />
    </Suspense>
  );
}
