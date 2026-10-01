'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { KeyRound, Mail, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/forms/Input';
import { Label } from '@/components/forms/Label';
import { forgotPasswordAction } from '@/lib/auth/actions';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const result = await forgotPasswordAction({ email });
      if (result.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(result.error || 'Failed to request password reset. Please try again.');
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
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="font-playfair text-2xl sm:text-3xl font-medium text-[#1E1C1A] tracking-tight">
              Reset Your Password
            </h1>
            <p className="mt-2 text-sm text-[#1E1C1A]/70 font-sans">
              Enter your email address and we will send you secure instructions to reset your password.
            </p>
          </div>

          {isSuccess ? (
            <div className="space-y-6 text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-playfair text-xl font-medium text-[#1E1C1A]">
                Instructions Sent
              </h2>
              <p className="text-sm text-[#1E1C1A]/70 leading-relaxed">
                If an account exists for <strong className="text-[#1E1C1A]">{email}</strong>, you will receive an email shortly with a password reset link.
              </p>
              <div className="pt-4">
                <Link href="/login">
                  <Button variant="outline" size="md" className="w-full">
                    Return to Sign In
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

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="email" required>
                    Email Address
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="ps-10"
                    />
                    <Mail className="w-4 h-4 text-[#6B655B] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center group mt-2"
                  disabled={isPending}
                >
                  {isPending ? 'Sending Link...' : 'Send Reset Instructions'}
                  <ArrowRight className="w-4 h-4 ms-2 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </Button>
              </form>

              {/* Back to Login */}
              <div className="mt-8 pt-6 border-t border-[#E5DFC0] text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center text-sm font-medium text-[#1E1C1A]/70 hover:text-[#B85233] transition-colors focus:outline-none"
                >
                  <ArrowLeft className="w-4 h-4 me-1.5" />
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
