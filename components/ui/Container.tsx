import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'narrow' | 'wide' | 'full';
  as?: React.ElementType;
}

export function Container({
  children,
  size = 'default',
  as: Component = 'div',
  className = '',
  ...props
}: ContainerProps) {
  const sizeClasses = {
    narrow: 'max-w-4xl',
    default: 'max-w-7xl', // 1280px
    wide: 'max-w-[1440px]',
    full: 'max-w-full',
  }[size];

  return (
    <Component
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
