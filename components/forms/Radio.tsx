import React from 'react';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className = '', id, checked, onChange, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <label
        htmlFor={inputId}
        className={`inline-flex items-center gap-2.5 cursor-pointer select-none text-xs sm:text-sm text-[#1E1C1A]/90 ${className}`}
      >
        <div className="relative flex items-center justify-center">
          <input
            ref={ref}
            id={inputId}
            type="radio"
            checked={checked}
            onChange={onChange}
            className="peer sr-only"
            {...props}
          />
          <div className="h-4 w-4 rounded-full border border-[#E5DFC0] bg-white transition-colors peer-checked:border-[#B85233] peer-focus-visible:ring-2 peer-focus-visible:ring-[#B85233]/20" />
          <div className="absolute h-2 w-2 rounded-full bg-[#B85233] opacity-0 transition-opacity peer-checked:opacity-100 pointer-events-none" />
        </div>
        {label && <span className="leading-snug">{label}</span>}
      </label>
    );
  }
);

Radio.displayName = 'Radio';
