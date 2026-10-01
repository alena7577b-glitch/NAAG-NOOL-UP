'use client';

import { useActionState } from 'react';
import { submitContactInquiry, FormActionResult } from '@/lib/actions/public';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/forms/Input';
import { Textarea } from '@/components/forms/Textarea';
import { FormField } from '@/components/forms/FormField';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const initialState: FormActionResult = {
  success: false,
};

export function ContactInquiryForm({ className = '' }: { className?: string }) {
  const [state, formAction, isPending] = useActionState(submitContactInquiry, initialState);

  if (state.success) {
    return (
      <div className="rounded-2xl bg-[#4D5844]/15 border border-[#4D5844]/30 p-8 text-center space-y-4 animate-in fade-in duration-300">
        <div className="mx-auto w-14 h-14 rounded-full bg-[#4D5844] text-white flex items-center justify-center shadow-sm">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="font-playfair text-2xl font-normal text-[#1E1C1A]">
          Message Sent Successfully
        </h3>
        <p className="font-sans text-sm text-[#6B655B] max-w-md mx-auto leading-relaxed">
          {state.message || 'Thank you for reaching out. We have received your inquiry and will be in touch shortly.'}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className={`space-y-5 ${className}`}>
      {state.error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <span>{state.error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField id="name" label="Your Name" required error={state.errors?.name?.[0]}>
          <Input
            id="name"
            name="name"
            placeholder="e.g. Nimco Ali"
            required
            hasError={Boolean(state.errors?.name?.[0])}
            disabled={isPending}
          />
        </FormField>

        <FormField id="email" label="Your Email Address" required error={state.errors?.email?.[0]}>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="e.g. nimco@example.com"
            required
            hasError={Boolean(state.errors?.email?.[0])}
            disabled={isPending}
          />
        </FormField>
      </div>

      <FormField id="subject" label="Subject / Topic" required error={state.errors?.subject?.[0]}>
        <Input
          id="subject"
          name="subject"
          placeholder="e.g. Partnership Inquiry / Journal Question"
          required
          hasError={Boolean(state.errors?.subject?.[0])}
          disabled={isPending}
        />
      </FormField>

      <FormField id="message" label="Your Message" required error={state.errors?.message?.[0]}>
        <Textarea
          id="message"
          name="message"
          rows={5}
          placeholder="How can we assist you or collaborate?"
          required
          hasError={Boolean(state.errors?.message?.[0])}
          disabled={isPending}
        />
      </FormField>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isPending}
        className="w-full sm:w-auto"
      >
        Send Inquiry
      </Button>
    </form>
  );
}
