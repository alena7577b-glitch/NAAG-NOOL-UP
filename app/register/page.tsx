'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/forms/Input';
import { Label } from '@/components/forms/Label';
import { Checkbox } from '@/components/forms/Checkbox';
import { registerAction } from '@/lib/auth/actions';

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [confirmationSent, setConfirmationSent] = useState(false);
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
      const result = await registerAction({
        fullName,
        email,
        password,
        confirmPassword,
        marketingConsent,
      });

      if (result.success) {
        if (result.requiresEmailConfirmation) {
          setConfirmationSent(true);
        } else if (result.redirectUrl) {
          router.push(result.redirectUrl);
          router.refresh();
        }
      } else {
        setErrorMessage(result.error || 'Registration failed. Please try again.');
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
      }
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F9F6F0]">
      <Container size="narrow" className="w-full max-w-md">
        <div className="bg-white border border-[#E5DFC0] rounded-2xl p-8 sm:p-10 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#B85233]/10 text-[#B85233] mb-4">
              <UserPlus className="w-6 h-6" />
            </div>
            <h1 className="font-playfair text-2xl sm:text-3xl font-medium text-[#1E1C1A] tracking-tight">
              Join Naag Nool UP
            </h1>
            <p className="mt-2 text-sm text-[#1E1C1A]/70 font-sans">
              Create an account to begin your journey of resilience, purpose, and community.
            </p>
          </div>

          {/* Confirmation Sent Notice */}
          {confirmationSent ? (
            <div className="space-y-6 text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-playfair text-xl font-medium text-[#1E1C1A]">
                Check Your Inbox
              </h2>
              <p className="text-sm text-[#1E1C1A]/70 leading-relaxed">
                We have sent a verification email to <strong className="text-[#1E1C1A]">{email}</strong>.
                Please click the link in the email to activate your account.
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

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fullName" required>
                    Full Name
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Amina Warsame"
                      className="ps-10"
                      hasError={Boolean(fieldErrors.fullName?.[0])}
                    />
                    <User className="w-4 h-4 text-[#6B655B] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {fieldErrors.fullName && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.fullName[0]}</p>
                  )}
                </div>

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
                      hasError={Boolean(fieldErrors.email?.[0])}
                    />
                    <Mail className="w-4 h-4 text-[#6B655B] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.email[0]}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password" required>
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters (letters & numbers)"
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
                    Confirm Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
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
                  <Checkbox
                    id="marketingConsent"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    label="I agree to receive inspiring updates and community news from Naag Nool UP."
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full justify-center group"
                    disabled={isPending}
                  >
                    {isPending ? 'Creating Account...' : 'Create Account'}
                    <ArrowRight className="w-4 h-4 ms-2 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </Button>
                </div>
              </form>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-[#E5DFC0] text-center">
                <p className="text-sm text-[#1E1C1A]/70">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="font-medium text-[#B85233] hover:underline focus:outline-none"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
