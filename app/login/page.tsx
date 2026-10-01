'use client';

import { Suspense, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/forms/Input';
import { Label } from '@/components/forms/Label';
import { loginAction } from '@/lib/auth/actions';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/account';
  const resetSuccess = searchParams.get('reset') === 'success';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const result = await loginAction({ email, password }, returnUrl);
      if (result.success && result.redirectUrl) {
        router.push(result.redirectUrl);
        router.refresh();
      } else {
        setErrorMessage(result.error || 'Failed to sign in. Please check your credentials.');
      }
    });
  };

  return (
    <div className="bg-white border border-[#E5DFC0] rounded-2xl p-8 sm:p-10 shadow-sm">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#B85233]/10 text-[#B85233] mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="font-playfair text-2xl sm:text-3xl font-medium text-[#1E1C1A] tracking-tight">
          Welcome Back
        </h1>
        <p className="mt-2 text-sm text-[#1E1C1A]/70 font-sans">
          Sign in to your account to access your saved journals, orders, and community space.
        </p>
      </div>

      {/* Reset Success Notice */}
      {resetSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <span>Your password has been successfully reset. Please sign in with your new password.</span>
        </div>
      )}

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

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password" required>
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs text-[#B85233] hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="ps-10 pe-10"
            />
            <Lock className="w-4 h-4 text-[#6B655B] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-[#6B655B] hover:text-[#1E1C1A] transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full justify-center group"
            disabled={isPending}
          >
            {isPending ? 'Signing In...' : 'Sign In'}
            <ArrowRight className="w-4 h-4 ms-2 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Button>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-[#E5DFC0]/70 text-center">
        <p className="text-sm text-[#1E1C1A]/70">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[#B85233] font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F9F6F0]">
      <Container size="narrow" className="w-full max-w-md">
        <Suspense fallback={<div className="bg-white border border-[#E5DFC0] rounded-2xl p-12 text-center text-sm text-stone-500">Loading sign in...</div>}>
          <LoginFormContent />
        </Suspense>
      </Container>
    </div>
  );
}
