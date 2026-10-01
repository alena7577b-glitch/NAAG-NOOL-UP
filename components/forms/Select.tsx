import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  hasError?: boolean;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, hasError = false, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={`w-full appearance-none font-sans text-sm text-[#1E1C1A] bg-white border rounded-md py-2.5 ps-3.5 pe-10 transition-colors duration-150 focus:outline-none focus:ring-2 disabled:bg-[#EAE5DC]/50 disabled:cursor-not-allowed ${
            hasError
              ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20'
              : 'border-[#E5DFC0] focus:border-[#B85233] focus:ring-[#B85233]/20'
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none text-[#6B655B]">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';
