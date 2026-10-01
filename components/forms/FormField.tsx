import React from 'react';
import { Label } from './Label';

export interface FormFieldProps {
  id?: string;
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  id,
  label,
  required = false,
  error,
  helperText,
  children,
  className = '',
}: FormFieldProps) {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      {children}
      {error && <p className="text-xs text-[#DC2626] font-sans">{error}</p>}
      {!error && helperText && (
        <p className="text-xs text-[#6B655B] font-sans">{helperText}</p>
      )}
    </div>
  );
}
