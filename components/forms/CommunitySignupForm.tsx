'use client';

import { useActionState } from 'react';
import { submitCommunitySignup, FormActionResult } from '@/lib/actions/public';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/forms/Input';
import { Checkbox } from '@/components/forms/Checkbox';
import { FormField } from '@/components/forms/FormField';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const initialState: FormActionResult = {
  success: false,
};

export function CommunitySignupForm({ className = '' }: { className?: string }) {
  const [state, formAction, isPending] = useActionState(submitCommunitySignup, initialState);

  if (state.success) {
    return (
      <div className="rounded-2xl bg-[#4D5844]/15 border border-[#4D5844]/30 p-6 sm:p-8 text-center space-y-3 animate-in fade-in duration-300">
        <div className="mx-auto w-12 h-12 rounded-full bg-[#4D5844] text-white flex items-center justify-center shadow-sm">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="font-playfair text-xl sm:text-2xl font-normal text-[#1E1C1A]">
          {state.message || "You're in. Welcome to Naag Nool UP."}
        </h3>
        <p className="font-sans text-xs sm:text-sm text-[#6B655B] max-w-md mx-auto">
          We are honored to have you with us. Check your inbox soon for movement insights and journal inspiration.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className={`space-y-4 ${className}`}>
      {state.error && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <span>{state.error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField id="fullName" label="Full Name" required error={state.errors?.fullName?.[0]}>
          <Input
            id="fullName"
            name="fullName"
            placeholder="e.g. Ayan Mohamed"
            required
            hasError={Boolean(state.errors?.fullName?.[0])}
            disabled={isPending}
          />
        </FormField>

        <FormField id="email" label="Email Address" required error={state.errors?.email?.[0]}>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="e.g. ayan@example.com"
            required
            hasError={Boolean(state.errors?.email?.[0])}
            disabled={isPending}
          />
        </FormField>
      </div>

      <div className="pt-1">
        <Checkbox
          id="marketingConsent"
          name="marketingConsent"
          defaultChecked
          label="I would like to receive reflections, guided prompts, and brand updates from Naag Nool UP."
          disabled={isPending}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isPending}
        className="w-full sm:w-auto"
      >
        Join the Movement
      </Button>
    </form>
  );
}
