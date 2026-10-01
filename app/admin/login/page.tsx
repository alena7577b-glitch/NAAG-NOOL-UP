'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/forms/Input';
import { Label } from '@/components/forms/Label';
import { adminLoginAction } from '@/lib/auth/actions';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const result = await adminLoginAction({ email, password });
      if (result.success && result.redirectUrl) {
        router.push(result.redirectUrl);
        router.refresh();
      } else {
        setErrorMessage(
          result.error || 'Invalid administrator credentials. Access restricted.'
        );
      }
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#1E1C1A]">
      <Container size="narrow" className="w-full max-w-md">
        <div className="bg-[#2A2724] border border-[#443E38] rounded-2xl p-8 sm:p-10 shadow-xl text-white">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#B85233]/20 text-[#D49B4B] mb-4 border border-[#B85233]/30">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="font-playfair text-2xl sm:text-3xl font-medium tracking-tight text-white">
              Admin Portal
            </h1>
            <p className="mt-2 text-xs uppercase tracking-[0.15em] text-[#D49B4B] font-semibold">
              Authorized Personnel Only
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-800/80 text-red-200 text-sm flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="admin-email" className="text-stone-300" required>
                Staff Email Address
              </Label>
              <div className="relative mt-1">
                <Input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@naagnoolup.com"
                  className="ps-10 bg-[#1E1C1A] border-[#443E38] text-white placeholder:text-stone-500 focus:border-[#D49B4B]"
                />
                <Mail className="w-4 h-4 text-stone-500 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <Label htmlFor="admin-password" className="text-stone-300" required>
                Staff Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="ps-10 bg-[#1E1C1A] border-[#443E38] text-white placeholder:text-stone-500 focus:border-[#D49B4B]"
                />
                <Lock className="w-4 h-4 text-stone-500 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center group mt-2 bg-[#B85233] hover:bg-[#A34326] text-white font-medium"
              disabled={isPending}
            >
              {isPending ? 'Verifying Credentials...' : 'Access Admin Console'}
              <ArrowRight className="w-4 h-4 ms-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>

          {/* Return link */}
          <div className="mt-8 pt-6 border-t border-[#443E38] text-center">
            <Link
              href="/"
              className="text-xs text-stone-400 hover:text-[#D49B4B] transition-colors focus:outline-none"
            >
              Return to Public Website
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
