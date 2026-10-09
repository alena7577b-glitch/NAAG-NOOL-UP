import { Suspense } from 'react';
import { Metadata } from 'next';
import { AuthView } from '@/components/auth/AuthView';

export const metadata: Metadata = {
  title: 'Reset Password — Naag Nool UP',
  description: 'Enter your email address to receive secure instructions to reset your password.',
};

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-xs text-[#786E63]">
          Loading password recovery...
        </div>
      }
    >
      <AuthView initialMode="forgot-password" />
    </Suspense>
  );
}
