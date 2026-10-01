import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'sage' | 'terracotta';
}

export function Card({
  children,
  variant = 'default',
  className = '',
  ...props
}: CardProps) {
  const variantStyles = {
    default: 'bg-white border border-[#E5DFC0]/70 shadow-xs',
    elevated: 'bg-white border border-[#E5DFC0] shadow-sm hover:shadow-md transition-shadow duration-200',
    bordered: 'bg-transparent border border-[#E5DFC0]',
    sage: 'bg-[#4D5844] text-white border border-[#3B4734]',
    terracotta: 'bg-[#B85233] text-white border border-[#A64426]',
  }[variant];

  return (
    <div
      className={`rounded-lg overflow-hidden transition-all duration-200 ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 sm:p-6 pb-2 sm:pb-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 sm:p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 sm:p-6 pt-2 sm:pt-3 flex items-center gap-3 ${className}`} {...props}>
      {children}
    </div>
  );
}
