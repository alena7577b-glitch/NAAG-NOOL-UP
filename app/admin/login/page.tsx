'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, KeyRound } from 'lucide-react';
import { adminLoginAction } from '@/lib/auth/actions';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const result = await adminLoginAction({ email: email.trim().toLowerCase(), password });
      if (result.success && result.redirectUrl) {
        router.push(result.redirectUrl);
        router.refresh();
      } else {
        setErrorMessage(
          result.error || 'Invalid administrator username or password. Access restricted.'
        );
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#121E19] text-white">
      <div className="w-full max-w-md">
        <div className="bg-[#182821] border border-[#243B30] rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Header & Logo */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#283C33] text-[#D49B4B] border border-[#3A5448] shadow-inner">
              <Shield className="w-8 h-8 stroke-[1.5]" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#D49B4B]">
                Staff & Super Admin Authentication
              </span>
              <h1 className="font-playfair text-2xl sm:text-3xl font-normal text-white tracking-tight">
                Naag Nool UP
              </h1>
              <p className="text-xs text-[#9EB1A7]">
                Official Administration Portal
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-3.5 rounded-2xl bg-[#13201A] border border-[#22382D] text-xs text-[#9EB1A7] flex items-start gap-2.5">
            <KeyRound className="w-4 h-4 text-[#D49B4B] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold text-white">Restricted Credentials Required</p>
              <p className="text-[11px] leading-relaxed">
                Only accounts provisioned by the Super Admin may sign in. Social & third-party logins (Google) are strictly disabled for security compliance.
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div
              role="alert"
              className="p-4 rounded-2xl bg-red-950/80 border border-red-800 text-red-200 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Denied</p>
                <p className="text-xs text-red-300 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="admin-email" className="text-xs font-semibold uppercase tracking-wider text-[#C5D3CB]">
                Admin Username / Email
              </label>
              <div className="relative">
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@naagnoolup.com"
                  className="w-full ps-11 pe-4 py-3 rounded-2xl bg-[#13201A] border border-[#294236] text-white placeholder-[#5A7366] text-sm focus:outline-none focus:border-[#D49B4B] focus:ring-2 focus:ring-[#D49B4B]/20 transition-all"
                />
                <Mail className="w-4 h-4 text-[#668073] absolute start-4 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="admin-password" className="text-xs font-semibold uppercase tracking-wider text-[#C5D3CB]">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full ps-11 pe-11 py-3 rounded-2xl bg-[#13201A] border border-[#294236] text-white placeholder-[#5A7366] text-sm focus:outline-none focus:border-[#D49B4B] focus:ring-2 focus:ring-[#D49B4B]/20 transition-all"
                />
                <Lock className="w-4 h-4 text-[#668073] absolute start-4 top-3.5 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-4 top-3.5 text-[#668073] hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#B85233] hover:bg-[#9E4228] disabled:bg-[#B85233]/50 text-white font-medium text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#B85233]/25 transition-all duration-300 active:scale-[0.98] mt-2"
            >
              {isPending ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying Credentials...
                </span>
              ) : (
                <>
                  <span>Sign In to Admin Console</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </>
              )}
            </button>
          </form>

          {/* Footer return link */}
          <div className="pt-4 border-t border-[#22382D] text-center">
            <Link
              href="/"
              className="text-xs text-[#879C91] hover:text-[#D49B4B] transition-colors"
            >
              ← Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
