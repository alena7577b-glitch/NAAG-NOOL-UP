import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ hasError = false, className = '', rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full font-sans text-sm text-[#1E1C1A] bg-white border rounded-md py-2.5 px-3.5 transition-colors duration-150 placeholder:text-[#6B655B]/70 focus:outline-none focus:ring-2 disabled:bg-[#EAE5DC]/50 disabled:cursor-not-allowed resize-y ${
          hasError
            ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20'
            : 'border-[#E5DFC0] focus:border-[#B85233] focus:ring-[#B85233]/20'
        } ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
