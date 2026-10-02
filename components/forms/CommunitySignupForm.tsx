'use client';

import { useActionState } from 'react';
import { submitCommunitySignup, FormActionResult } from '@/lib/actions/public';
import { ArrowRight, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

const initialState: FormActionResult = {
  success: false,
};

export function CommunitySignupForm({ className = '' }: { className?: string }) {
  const [state, formAction, isPending] = useActionState(submitCommunitySignup, initialState);

  if (state.success) {
    return (
      <div className="rounded-xl bg-[#4D5844]/15 border border-[#4D5844]/30 p-6 sm:p-8 text-center space-y-3 animate-in fade-in duration-300">
        <div className="mx-auto w-12 h-12 rounded-full bg-[#4D5844] text-white flex items-center justify-center shadow-sm">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="font-playfair text-xl sm:text-2xl font-normal text-[#1E1C1A]">
          {state.message || "You belong here. Welcome to Naag Nool UP."}
        </h3>
        <p className="font-sans text-xs sm:text-sm text-[#6B655B] max-w-md mx-auto">
          We are honored to have you in our circle. Check your inbox soon for reflections and community updates.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className={`space-y-4 ${className}`}>
      {state.error && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-1.5 text-start">
        <label htmlFor="fullName" className="block text-xs font-semibold text-[#1E1C1A]">
          Full Name *
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Your name"
          required
          disabled={isPending}
          className="w-full rounded-md bg-[#FAF8F5] border border-[#E5DFC0] px-4 py-2.5 text-xs sm:text-sm text-[#1E1C1A] placeholder:text-[#6B655B] focus:outline-none focus:border-[#B85233]"
        />
        {state.errors?.fullName?.[0] && (
          <p className="text-[11px] text-red-600">{state.errors.fullName[0]}</p>
        )}
      </div>

      {/* Email Address */}
      <div className="space-y-1.5 text-start">
        <label htmlFor="email" className="block text-xs font-semibold text-[#1E1C1A]">
          Email Address *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          disabled={isPending}
          className="w-full rounded-md bg-[#FAF8F5] border border-[#E5DFC0] px-4 py-2.5 text-xs sm:text-sm text-[#1E1C1A] placeholder:text-[#6B655B] focus:outline-none focus:border-[#B85233]"
        />
        {state.errors?.email?.[0] && (
          <p className="text-[11px] text-red-600">{state.errors.email[0]}</p>
        )}
      </div>

      {/* Consent Checkbox */}
      <div className="flex items-start gap-2.5 pt-1 text-start">
        <input
          type="checkbox"
          id="marketingConsent"
          name="marketingConsent"
          defaultChecked
          disabled={isPending}
          className="mt-0.5 h-4 w-4 rounded border-[#E5DFC0] text-[#B85233] focus:ring-[#B85233] cursor-pointer"
        />
        <label htmlFor="marketingConsent" className="text-[11px] sm:text-xs text-[#6B655B] cursor-pointer">
          I agree to receive updates, resources and news from Naag Nool UP. You can unsubscribe at any time.
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 px-6 rounded-md bg-[#B85233] text-white text-xs sm:text-sm font-medium hover:bg-[#A64426] transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
        >
          <span>{isPending ? 'Joining...' : 'Join the Community'}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </button>
      </div>

      {/* Privacy Guarantee */}
      <div className="flex items-center justify-center gap-1.5 pt-2 text-[11px] text-[#6B655B]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#4D5844]" />
        <span>Your information is safe and secure. We respect your privacy.</span>
      </div>
    </form>
  );
}
