import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ hasError = false, leftIcon, rightIcon, className = '', ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-[#6B655B]">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full font-sans text-sm text-[#1E1C1A] bg-white border rounded-md py-2.5 px-3.5 transition-colors duration-150 placeholder:text-[#6B655B]/70 focus:outline-none focus:ring-2 disabled:bg-[#EAE5DC]/50 disabled:cursor-not-allowed ${
            leftIcon ? 'ps-10' : ''
          } ${rightIcon ? 'pe-10' : ''} ${
            hasError
              ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20'
              : 'border-[#E5DFC0] focus:border-[#B85233] focus:ring-[#B85233]/20'
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-[#6B655B]">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
