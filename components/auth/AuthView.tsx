'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  Users, 
  Heart
} from 'lucide-react';
import { loginAction, registerAction, forgotPasswordAction, resetPasswordAction } from '@/lib/auth/actions';
import { getBrowserClient } from '@/lib/supabase/client';

export type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-password';

interface AuthViewProps {
  initialMode: AuthMode;
}

export function AuthView({ initialMode }: AuthViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/account';
  const resetSuccessParam = searchParams.get('reset') === 'success';

  const [mode, setMode] = useState<AuthMode>(initialMode);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(resetSuccessParam);
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, setIsGooglePending] = useState(false);

  // Google OAuth Handler
  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsGooglePending(true);
    try {
      const supabase = getBrowserClient();
      if (!supabase) {
        setErrorMessage('Authentication service is not configured. Please check your Supabase environment variables.');
        setIsGooglePending(false);
        return;
      }

      const safeNext = returnUrl.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : '/account';
      const redirectUri = `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsGooglePending(false);
      }
    } catch (err: unknown) {
      setErrorMessage('Failed to connect to Google authentication service.');
      setIsGooglePending(false);
    }
  };

  // Switch modes cleanly
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrorMessage(null);
    setFieldErrors({});
    setConfirmationSent(false);
    setResetEmailSent(false);
    
    // Update shallow URL for bookmarking without page reload
    if (newMode === 'login') {
      window.history.replaceState(null, '', '/login');
    } else if (newMode === 'register') {
      window.history.replaceState(null, '', '/register');
    } else if (newMode === 'forgot-password') {
      window.history.replaceState(null, '', '/forgot-password');
    }
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    // Client-side validations
    if ((mode === 'register' || mode === 'reset-password') && password !== confirmPassword) {
      setFieldErrors({ confirmPassword: ['Passwords do not match. Please verify.'] });
      return;
    }

    startTransition(async () => {
      if (mode === 'login') {
        const result = await loginAction({ email, password }, returnUrl);
        if (result.success && result.redirectUrl) {
          router.push(result.redirectUrl);
          router.refresh();
        } else {
          setErrorMessage(result.error || 'Failed to sign in. Please verify your email and password.');
        }
      } else if (mode === 'register') {
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
          setErrorMessage(result.error || 'Registration failed. Please check your information.');
          if (result.fieldErrors) {
            setFieldErrors(result.fieldErrors);
          }
        }
      } else if (mode === 'forgot-password') {
        const result = await forgotPasswordAction({ email });
        if (result.success) {
          setResetEmailSent(true);
        } else {
          setErrorMessage(result.error || 'Failed to send reset link. Please check the email address.');
        }
      } else if (mode === 'reset-password') {
        const result = await resetPasswordAction({ password, confirmPassword });
        if (result.success) {
          setResetSuccess(true);
          setTimeout(() => {
            switchMode('login');
          }, 2500);
        } else {
          setErrorMessage(result.error || 'Reset link expired or invalid. Please request a new link.');
          if (result.fieldErrors) {
            setFieldErrors(result.fieldErrors);
          }
        }
      }
    });
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FAF8F5] text-[#1E1C1A]">
      {/* =========================================================================
          LEFT PANE: LUXURY EDITORIAL STORYTELLING & SISTERHOOD ARTWORK
      ========================================================================= */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1E1C12] text-[#FAF6F0] overflow-hidden flex-col justify-between p-10 xl:p-14 2xl:p-16">
        {/* Background authentic contemplative portrait */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/why-journaling-woman.png"
            alt="Somali woman reflecting peacefully with her journal"
            className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.05]"
          />
          {/* Multi-stage warm cinematic scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#14120E] via-[#1E1C12]/75 via-45% to-[#1E1C12]/40" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60 pointer-events-none" />
        </div>

        {/* Top: Brand Header */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group focus:outline-none">
            {/* Authentic Botanical Sprig Motif */}
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#D49B4B] group-hover:scale-105 transition-transform">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 21C7 16 11 11 19 5" />
                <path d="M19 5C17 2 13 4 14 8C15 8 18 7 19 5Z" fill="currentColor" fillOpacity="0.3" />
                <path d="M10 12C7 11 6 14 9 16C10 15 11 13 10 12Z" fill="currentColor" fillOpacity="0.25" />
              </svg>
            </div>
            <div>
              <span className="font-playfair text-xl tracking-wider text-white font-medium block">
                NAAG NOOL UP
              </span>
              <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#D49B4B] font-semibold">
                The time to be ALIVE is now
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Editorial Manifesto & Quote */}
        <div className="relative z-10 my-auto py-12 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D49B4B]" />
            <span className="font-sans text-[11px] font-medium tracking-wide uppercase">
              The Sisterhood Sanctuary
            </span>
          </div>

          <h2 className="font-playfair text-3xl xl:text-4xl 2xl:text-[42px] font-normal text-white leading-[1.2] tracking-tight">
            &ldquo;When a woman chooses to be <span className="font-cormorant italic text-[#E5A869]">fully alive</span>, she gives permission for every sister around her to rise.&rdquo;
          </h2>

          <p className="font-sans text-xs sm:text-sm text-white/80 leading-relaxed">
            Your journey of self-reflection, healing, and intentional growth starts within these pages. Welcome to a sanctuary created exclusively for your elevation.
          </p>

          {/* 3 Floating Glassmorphism Feature Chips */}
          <div className="grid grid-cols-1 gap-2.5 pt-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/8 backdrop-blur-md border border-white/12 text-white/90">
              <BookOpen className="w-4 h-4 text-[#D49B4B] shrink-0" />
              <span className="font-sans text-xs">
                <strong>Private Journal Vault:</strong> Track your daily reflections and milestones.
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/8 backdrop-blur-md border border-white/12 text-white/90">
              <Users className="w-4 h-4 text-[#D49B4B] shrink-0" />
              <span className="font-sans text-xs">
                <strong>Sisterhood Circle:</strong> Access private community circles & events.
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/8 backdrop-blur-md border border-white/12 text-white/90">
              <Heart className="w-4 h-4 text-[#D49B4B] shrink-0" />
              <span className="font-sans text-xs">
                <strong>Order Management:</strong> Manage physical journal orders & tracking.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom: Somali Blessing & Member Count */}
        <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between text-xs font-sans text-white/70">
          <p className="font-cormorant italic text-base text-[#D49B4B]">
            Xoog, Xikmad & Walaalnimo — Strength, Wisdom & Sisterhood
          </p>
          <span className="text-[11px] text-white/60">
            Over 1,200+ sisters on the path
          </span>
        </div>
      </div>

      {/* =========================================================================
          RIGHT PANE: REFINED LUXURY AUTHENTICATION INTERACTION
      ========================================================================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 md:p-12 xl:p-16 2xl:p-20 overflow-y-auto min-h-screen">
        {/* Top Bar: Return Link + Mobile Brand Icon */}
        <div className="flex items-center justify-between pb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-sans text-[#786E63] hover:text-[#B85233] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Store</span>
          </Link>

          {/* Mobile-only logo */}
          <div className="lg:hidden">
            <Link href="/" className="font-playfair text-lg text-[#1E1C1A] font-semibold tracking-wider">
              NAAG NOOL UP
            </Link>
          </div>
        </div>

        {/* Central Auth Container */}
        <div className="w-full max-w-md mx-auto my-auto space-y-7">
          {/* Segmented Mode Switcher (Visible for login / register) */}
          {(mode === 'login' || mode === 'register') && (
            <div className="p-1 rounded-xl bg-[#EAE4D8]/70 border border-[#DDD5C5] flex items-center">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 py-2 text-xs sm:text-[13px] font-sans font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-[#1E1C1A] shadow-xs'
                    : 'text-[#6B6155] hover:text-[#1E1C1A]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`flex-1 py-2 text-xs sm:text-[13px] font-sans font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-[#1E1C1A] shadow-xs'
                    : 'text-[#6B6155] hover:text-[#1E1C1A]'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Header Typography */}
          <div className="space-y-2">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B85233]">
              {mode === 'login' && 'THE SISTERHOOD SPACE'}
              {mode === 'register' && 'JOIN NAAG NOOL UP'}
              {mode === 'forgot-password' && 'ACCOUNT RECOVERY'}
              {mode === 'reset-password' && 'CHOOSE NEW PASSWORD'}
            </p>

            <h1 className="font-playfair text-2xl sm:text-3xl lg:text-[34px] font-normal text-[#1E1C1A] tracking-tight leading-tight">
              {mode === 'login' && 'Welcome Back, Sister.'}
              {mode === 'register' && 'Begin Your Journey.'}
              {mode === 'forgot-password' && 'Reset Your Password.'}
              {mode === 'reset-password' && 'Create Your New Password.'}
            </h1>

            <p className="font-sans text-xs sm:text-[13.5px] text-[#6B6155] leading-relaxed">
              {mode === 'login' &&
                'Sign in to access your guided reflections, orders, and the sisterhood circle.'}
              {mode === 'register' &&
                'Create an account to join an inspiring circle of women dedicated to intentional living.'}
              {mode === 'forgot-password' &&
                'Enter the email registered to your account, and we will send a secure reset link.'}
              {mode === 'reset-password' &&
                'Enter and confirm your new secure password below to access your account.'}
            </p>
          </div>

          {/* Feedback Notices */}
          {resetSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Your password has been successfully updated. You may now sign in.</span>
            </div>
          )}

          {confirmationSent && (
            <div className="p-5 rounded-2xl bg-[#F7F3EB] border border-[#E5DFC0] text-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-playfair text-lg font-medium text-[#1E1C1A]">Check Your Inbox</h3>
              <p className="font-sans text-xs text-[#5A5248] leading-relaxed">
                We sent an activation link to <strong>{email}</strong>. Click the link in the email to activate your sisterhood account.
              </p>
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-xs font-sans text-[#B85233] font-medium hover:underline pt-1 cursor-pointer"
              >
                Return to Sign In
              </button>
            </div>
          )}

          {resetEmailSent && (
            <div className="p-5 rounded-2xl bg-[#F7F3EB] border border-[#E5DFC0] text-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-playfair text-lg font-medium text-[#1E1C1A]">Reset Link Sent</h3>
              <p className="font-sans text-xs text-[#5A5248] leading-relaxed">
                If an account exists for <strong>{email}</strong>, you will receive password reset instructions shortly.
              </p>
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-xs font-sans text-[#B85233] font-medium hover:underline pt-1 cursor-pointer"
              >
                Return to Sign In
              </button>
            </div>
          )}

          {errorMessage && (
            <div
              role="alert"
              className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Social Authentication (Google OAuth) */}
          {(mode === 'login' || mode === 'register') && !confirmationSent && !resetEmailSent && (
            <div className="space-y-5 pt-1">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGooglePending || isPending}
                className="w-full h-11 flex items-center justify-center gap-3 bg-white hover:bg-[#F9F5EC] active:scale-[0.99] border border-[#D8D0C0] text-[#1E1C1A] text-xs sm:text-[13.5px] font-medium rounded-lg transition-all duration-150 shadow-2xs hover:shadow-xs hover:border-[#C9BFAD] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {/* Official Google Multicolor SVG Icon */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>
                  {isGooglePending
                    ? 'Connecting to Google...'
                    : mode === 'login'
                    ? 'Continue with Google'
                    : 'Sign up with Google'}
                </span>
              </button>

              {/* Clean, Non-Wrapping Editorial Divider */}
              <div className="flex items-center gap-3 w-full" aria-hidden="true">
                <div className="flex-1 h-[1px] bg-[#DDD5C5]" />
                <span className="shrink-0 font-sans text-[11px] uppercase tracking-wider text-[#8C8275] whitespace-nowrap px-1">
                  or continue with email
                </span>
                <div className="flex-1 h-[1px] bg-[#DDD5C5]" />
              </div>
            </div>
          )}

          {/* The Active Form */}
          {!confirmationSent && !resetEmailSent && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name (Register Only) */}
              {mode === 'register' && (
                <div>
                  <label htmlFor="auth-fullName" className="block text-xs font-sans font-medium text-[#4A433A] mb-1">
                    Full Name <span className="text-[#B85233]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="auth-fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Fatima Ali"
                      className="w-full font-sans text-xs sm:text-sm text-[#1E1C1A] bg-white border border-[#DDD5C5] rounded-lg py-2.5 ps-10 pe-4 placeholder:text-[#9C9489] focus:outline-none focus:border-[#B85233] focus:ring-2 focus:ring-[#B85233]/15 transition-all"
                    />
                    <User className="w-4 h-4 text-[#9C9489] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {fieldErrors.fullName && (
                    <p className="text-[11px] text-red-600 mt-1">{fieldErrors.fullName[0]}</p>
                  )}
                </div>
              )}

              {/* Email Address (Login, Register, Forgot Password) */}
              {mode !== 'reset-password' && (
                <div>
                  <label htmlFor="auth-email" className="block text-xs font-sans font-medium text-[#4A433A] mb-1">
                    Email Address <span className="text-[#B85233]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="auth-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full font-sans text-xs sm:text-sm text-[#1E1C1A] bg-white border border-[#DDD5C5] rounded-lg py-2.5 ps-10 pe-4 placeholder:text-[#9C9489] focus:outline-none focus:border-[#B85233] focus:ring-2 focus:ring-[#B85233]/15 transition-all"
                    />
                    <Mail className="w-4 h-4 text-[#9C9489] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-[11px] text-red-600 mt-1">{fieldErrors.email[0]}</p>
                  )}
                </div>
              )}

              {/* Password (Login, Register, Reset Password) */}
              {mode !== 'forgot-password' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="auth-password" className="text-xs font-sans font-medium text-[#4A433A]">
                      {mode === 'reset-password' ? 'New Password' : 'Password'}{' '}
                      <span className="text-[#B85233]">*</span>
                    </label>

                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => switchMode('forgot-password')}
                        className="text-[11px] font-sans text-[#B85233] hover:underline font-medium cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full font-sans text-xs sm:text-sm text-[#1E1C1A] bg-white border border-[#DDD5C5] rounded-lg py-2.5 ps-10 pe-10 placeholder:text-[#9C9489] focus:outline-none focus:border-[#B85233] focus:ring-2 focus:ring-[#B85233]/15 transition-all"
                    />
                    <Lock className="w-4 h-4 text-[#9C9489] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-[#9C9489] hover:text-[#1E1C1A] transition-colors p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-[11px] text-red-600 mt-1">{fieldErrors.password[0]}</p>
                  )}
                </div>
              )}

              {/* Confirm Password (Register, Reset Password) */}
              {(mode === 'register' || mode === 'reset-password') && (
                <div>
                  <label htmlFor="auth-confirmPassword" className="block text-xs font-sans font-medium text-[#4A433A] mb-1">
                    Confirm Password <span className="text-[#B85233]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="auth-confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full font-sans text-xs sm:text-sm text-[#1E1C1A] bg-white border border-[#DDD5C5] rounded-lg py-2.5 ps-10 pe-10 placeholder:text-[#9C9489] focus:outline-none focus:border-[#B85233] focus:ring-2 focus:ring-[#B85233]/15 transition-all"
                    />
                    <Lock className="w-4 h-4 text-[#9C9489] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-[#9C9489] hover:text-[#1E1C1A] transition-colors p-1 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-[11px] text-red-600 mt-1">{fieldErrors.confirmPassword[0]}</p>
                  )}
                </div>
              )}

              {/* Checkboxes for Login / Register */}
              {mode === 'login' && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#DDD5C5] text-[#B85233] focus:ring-[#B85233] cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="text-xs font-sans text-[#6B6155] cursor-pointer">
                    Remember this device for 30 days
                  </label>
                </div>
              )}

              {mode === 'register' && (
                <div className="space-y-2 pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketingConsent}
                      onChange={(e) => setMarketingConsent(e.target.checked)}
                      className="w-4 h-4 rounded border-[#DDD5C5] text-[#B85233] focus:ring-[#B85233] mt-0.5 cursor-pointer shrink-0"
                    />
                    <span className="text-[11.5px] font-sans text-[#6B6155] leading-snug">
                      Send me weekly guided journal prompts, community workshop invitations, and reflections.
                    </span>
                  </label>
                  <p className="text-[10.5px] font-sans text-[#8C8275] leading-relaxed">
                    By signing up, you agree to our{' '}
                    <Link href="/terms" className="underline hover:text-[#B85233]">Terms</Link> and{' '}
                    <Link href="/privacy" className="underline hover:text-[#B85233]">Privacy Policy</Link>.
                  </p>
                </div>
              )}

              {/* Primary Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#B85233] hover:bg-[#A34327] disabled:opacity-60 text-white py-3 px-6 rounded-lg text-xs sm:text-sm font-medium transition-all shadow-sm hover:shadow active:scale-[0.99] cursor-pointer"
                >
                  {isPending ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <span>
                        {mode === 'login' && 'Sign In to Your Space'}
                        {mode === 'register' && 'Create Your Account'}
                        {mode === 'forgot-password' && 'Send Reset Link'}
                        {mode === 'reset-password' && 'Save New Password'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Bottom Back Button for Forgot Password / Reset */}
          {(mode === 'forgot-password' || mode === 'reset-password') && !resetEmailSent && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="inline-flex items-center gap-1.5 text-xs font-sans text-[#6B6155] hover:text-[#1E1C1A] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </div>
          )}

          {/* Alternative Quick Mode Jump */}
          {mode === 'login' && (
            <p className="text-center text-xs font-sans text-[#6B6155] pt-3">
              Don&apos;t have an account yet?{' '}
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="text-[#B85233] font-semibold hover:underline cursor-pointer"
              >
                Create one now
              </button>
            </p>
          )}

          {mode === 'register' && (
            <p className="text-center text-xs font-sans text-[#6B6155] pt-3">
              Already a sister in the circle?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-[#B85233] font-semibold hover:underline cursor-pointer"
              >
                Sign in here
              </button>
            </p>
          )}

          {/* Privacy & Encryption Guarantee Badge */}
          <div className="pt-6 border-t border-[#EAE4D8] flex items-center justify-center gap-2 text-[#8C8275] text-[11px] font-sans">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4D5844] shrink-0" />
            <span>Encrypted & Private. Your journal thoughts remain sacred and confidential.</span>
          </div>
        </div>

        {/* Bottom copyright / footer note */}
        <div className="pt-8 text-center text-[11px] font-sans text-[#9C9489]">
          © {new Date().getFullYear()} Naag Nool UP. All rights reserved.
        </div>
      </div>
    </div>
  );
}
