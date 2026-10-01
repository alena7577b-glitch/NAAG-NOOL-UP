'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/forms/Input';
import { Label } from '@/components/forms/Label';
import { resetPasswordAction } from '@/lib/auth/actions';

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: ['Passwords do not match'] });
      return;
    }

    startTransition(async () => {
      const result = await resetPasswordAction({ password, confirmPassword });
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/login?reset=success');
        }, 2000);
      } else {
        setErrorMessage(
          result.error ||
            'Your password reset session is invalid or has expired. Please request a new link.'
        );
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
      }
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F9F6F0]">
      <Container size="narrow" className="w-full max-w-md">
        <div className="bg-white border border-[#E5DFC0] rounded-2xl p-8 sm:p-10 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#B85233]/10 text-[#B85233] mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="font-playfair text-2xl sm:text-3xl font-medium text-[#1E1C1A] tracking-tight">
              Create New Password
            </h1>
            <p className="mt-2 text-sm text-[#1E1C1A]/70 font-sans">
              Enter and confirm your new secure password below.
            </p>
          </div>

          {isSuccess ? (
            <div className="space-y-6 text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-playfair text-xl font-medium text-[#1E1C1A]">
                Password Updated
              </h2>
              <p className="text-sm text-[#1E1C1A]/70 leading-relaxed">
                Your password has been changed successfully. Redirecting you to sign in...
              </p>
              <div className="pt-4">
                <Link href="/login">
                  <Button variant="primary" size="md" className="w-full">
                    Go to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Error Alert */}
              {errorMessage && (
                <div
                  role="alert"
                  className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Reset Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password" required>
                    New Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters (letters & numbers)"
                      className="ps-10"
                      hasError={Boolean(fieldErrors.password?.[0])}
                    />
                    <Lock className="w-4 h-4 text-[#6B655B] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {fieldErrors.password && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.password[0]}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword" required>
                    Confirm New Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      className="ps-10"
                      hasError={Boolean(fieldErrors.confirmPassword?.[0])}
                    />
                    <Lock className="w-4 h-4 text-[#6B655B] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword[0]}</p>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full justify-center group"
                    disabled={isPending}
                  >
                    {isPending ? 'Updating Password...' : 'Update Password'}
                    <ArrowRight className="w-4 h-4 ms-2 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </Button>
                </div>
              </form>

              {/* Back to Login */}
              <div className="mt-8 pt-6 border-t border-[#E5DFC0] text-center">
                <Link
                  href="/login"
                  className="text-sm font-medium text-[#1E1C1A]/70 hover:text-[#B85233] transition-colors focus:outline-none"
                >
                  Return to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
