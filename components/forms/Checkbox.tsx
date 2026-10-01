import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', id, checked, onChange, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <label
        htmlFor={inputId}
        className={`inline-flex items-start gap-2.5 cursor-pointer select-none text-xs sm:text-sm text-[#1E1C1A]/90 ${className}`}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="peer sr-only"
            {...props}
          />
          <div className="h-4 w-4 rounded-xs border border-[#E5DFC0] bg-white transition-colors peer-checked:bg-[#B85233] peer-checked:border-[#B85233] peer-focus-visible:ring-2 peer-focus-visible:ring-[#B85233]/20" />
          <Check className="absolute h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100 pointer-events-none" />
        </div>
        {label && <span className="leading-snug">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
