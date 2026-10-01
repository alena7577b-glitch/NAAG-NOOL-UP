import React from 'react';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  as?: React.ElementType;
}

export function Heading({
  children,
  level = 2,
  size,
  as,
  className = '',
  ...props
}: HeadingProps) {
  const Component = as || (`h${level}` as React.ElementType);
  const resolvedSize = size || (`h${level}` as const);

  const sizeStyles = {
    display: 'font-playfair text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-dusk leading-[1.15]',
    h1: 'font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-dusk leading-[1.2]',
    h2: 'font-playfair text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-dusk leading-[1.25]',
    h3: 'font-playfair text-xl sm:text-2xl font-normal text-dusk leading-[1.3]',
    h4: 'font-playfair text-lg sm:text-xl font-medium text-dusk leading-[1.35]',
    h5: 'font-playfair text-base sm:text-lg font-medium text-dusk',
    h6: 'font-playfair text-sm sm:text-base font-medium text-dusk',
  }[resolvedSize];

  return (
    <Component className={`${sizeStyles} ${className}`} {...props}>
      {children}
    </Component>
  );
}

export interface EyebrowProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: React.ElementType;
}

export function Eyebrow({
  children,
  as: Component = 'p',
  className = '',
  ...props
}: EyebrowProps) {
  return (
    <Component
      className={`font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#B85233] ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export interface AccentProps extends React.HTMLAttributes<HTMLSpanElement> {
  as?: React.ElementType;
}

export function Accent({
  children,
  as: Component = 'span',
  className = '',
  ...props
}: AccentProps) {
  return (
    <Component
      className={`font-cormorant italic text-lg sm:text-xl text-[#B85233] ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'sm' | 'base' | 'lg' | 'muted';
  as?: React.ElementType;
}

export function Text({
  children,
  size = 'base',
  as: Component = 'p',
  className = '',
  ...props
}: TextProps) {
  const sizeStyles = {
    sm: 'text-xs sm:text-sm text-[#6B655B] leading-relaxed',
    base: 'text-sm sm:text-base text-[#1E1C1A]/85 leading-relaxed',
    lg: 'text-base sm:text-lg text-[#1E1C1A]/90 leading-relaxed',
    muted: 'text-xs sm:text-sm text-[#6B655B]',
  }[size];

  return (
    <Component className={`font-sans ${sizeStyles} ${className}`} {...props}>
      {children}
    </Component>
  );
}
