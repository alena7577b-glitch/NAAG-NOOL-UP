'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/logger';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('Unhandled application error', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <h2 className="font-playfair text-2xl font-bold text-dusk">
          Something went wrong
        </h2>
        <p className="text-sm text-mutedText">
          We encountered an unexpected error. Please try again or return to the homepage.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-md bg-terracotta px-5 py-2.5 text-sm font-medium text-white shadow transition-colors hover:bg-terracotta-hover focus-visible:outline-none"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
