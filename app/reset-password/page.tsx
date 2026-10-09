import { Suspense } from 'react';
import { Metadata } from 'next';
import { AuthView } from '@/components/auth/AuthView';

export const metadata: Metadata = {
  title: 'Set New Password — Naag Nool UP',
  description: 'Enter your new password to regain access to your account.',
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-xs text-[#786E63]">
          Loading password reset...
        </div>
      }
    >
      <AuthView initialMode="reset-password" />
    </Suspense>
  );
}
