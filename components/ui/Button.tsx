import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'dark' | 'light' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium font-sans transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta';

    const variantStyles = {
      primary: 'bg-[#B85233] text-white hover:bg-[#A64426] border border-transparent shadow-xs',
      secondary: 'bg-[#4D5844] text-white hover:bg-[#3B4734] border border-transparent shadow-xs',
      outline: 'bg-transparent text-[#1E1C1A] border border-[#1E1C1A]/30 hover:border-[#1E1C1A] hover:bg-[#1E1C1A]/5',
      dark: 'bg-[#1E1C1A] text-white hover:bg-[#141312] border border-transparent shadow-xs',
      light: 'bg-white text-[#1E1C1A] hover:bg-[#F9F6F0] border border-[#E5DFC0] shadow-xs',
      ghost: 'bg-transparent text-[#1E1C1A] hover:bg-[#EAE5DC]/50 border border-transparent',
    }[variant];

    const sizeStyles = {
      sm: 'text-xs px-3.5 py-1.5 rounded-sm gap-1.5 min-h-[34px]',
      md: 'text-sm px-5 py-2.5 rounded-md gap-2 min-h-[42px]',
      lg: 'text-base px-7 py-3 rounded-md gap-2.5 min-h-[48px]',
    }[size];

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="inline-flex shrink-0 rtl:rotate-180">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
