import React from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({
  children,
  required = false,
  className = '',
  ...props
}: LabelProps) {
  return (
    <label
      className={`block font-sans text-xs sm:text-sm font-medium text-[#1E1C1A] select-none ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-[#B85233] ms-1">*</span>}
    </label>
  );
}
