import React from 'react';
import { Container } from '@/components/ui/Container';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'sand' | 'white' | 'sage' | 'dusk' | 'terracotta';
  containerSize?: 'default' | 'narrow' | 'wide' | 'full';
  as?: React.ElementType;
}

export function Section({
  children,
  variant = 'sand',
  containerSize = 'default',
  as: Component = 'section',
  className = '',
  ...props
}: SectionProps) {
  const variantStyles = {
    sand: 'bg-[#F9F6F0] text-[#1E1C1A]',
    white: 'bg-white text-[#1E1C1A]',
    sage: 'bg-[#4D5844] text-white',
    dusk: 'bg-[#1E1C1A] text-white',
    terracotta: 'bg-[#B85233] text-white',
  }[variant];

  return (
    <Component
      className={`py-12 sm:py-16 lg:py-20 ${variantStyles} ${className}`}
      {...props}
    >
      <Container size={containerSize}>{children}</Container>
    </Component>
  );
}

export function SectionHeader({
  children,
  align = 'center',
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { align?: 'start' | 'center' | 'end' }) {
  const alignStyles = {
    start: 'text-start items-start',
    center: 'text-center items-center mx-auto',
    end: 'text-end items-end ms-auto',
  }[align];

  return (
    <div
      className={`flex flex-col max-w-2xl mb-8 sm:mb-12 space-y-3 ${alignStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function SectionEyebrow({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#B85233] ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function SectionTitle({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={`font-playfair text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight leading-snug ${className}`}
      {...props}
    >
      {children}
    </h2>
  );
}

export function SectionDescription({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`font-sans text-sm sm:text-base text-[#6B655B] leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function SectionActions({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex flex-wrap items-center gap-3 sm:gap-4 pt-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
