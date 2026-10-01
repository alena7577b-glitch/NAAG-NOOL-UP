'use client';

import { Minus, Plus } from 'lucide-react';

export interface QuantityStepperProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  size = 'md',
  className = '',
}: QuantityStepperProps) {
  const handleDecrement = () => {
    if (value > min && !disabled) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max && !disabled) {
      onChange(value + 1);
    }
  };

  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
  }[size];

  return (
    <div
      className={`inline-flex items-center rounded-md border border-[#E5DFC0] bg-white overflow-hidden select-none ${sizeClasses} ${className}`}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
        className="flex items-center justify-center px-3 h-full text-[#1E1C1A] hover:bg-[#F9F6F0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span
        aria-live="polite"
        className="flex items-center justify-center px-3 min-w-[36px] font-sans font-medium text-[#1E1C1A] text-center"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
        className="flex items-center justify-center px-3 h-full text-[#1E1C1A] hover:bg-[#F9F6F0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
