import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'inStock' | 'outOfStock' | 'terracotta' | 'sage' | 'amber' | 'neutral';
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  }[size];

  const variantStyles = {
    inStock: 'bg-[#2E6F40]/10 text-[#2E6F40] border border-[#2E6F40]/20 rounded-full inline-flex items-center gap-1.5',
    outOfStock: 'bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20 rounded-full inline-flex items-center gap-1.5',
    terracotta: 'bg-[#B85233] text-white rounded-full',
    sage: 'bg-[#4D5844] text-white rounded-full',
    amber: 'bg-[#D49B4B]/20 text-[#1E1C1A] border border-[#D49B4B]/40 rounded-full',
    neutral: 'bg-[#EAE5DC] text-[#1E1C1A] rounded-full',
  }[variant];

  return (
    <span
      className={`inline-flex items-center justify-center font-sans ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {variant === 'inStock' && <span className="h-1.5 w-1.5 rounded-full bg-[#2E6F40]" />}
      {variant === 'outOfStock' && <span className="h-1.5 w-1.5 rounded-full bg-[#DC2626]" />}
      <span>{children}</span>
    </span>
  );
}
