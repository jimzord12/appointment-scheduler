import React from 'react';

import { cn } from './utils.js';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', fullWidth, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
      default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      outline: 'border border-gray-300 text-gray-900 hover:bg-gray-50',
      ghost: 'text-gray-900 hover:bg-gray-100',
    };
    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: 'h-8 px-2 text-sm',
      md: 'h-9 px-3 text-sm',
      lg: 'h-10 px-4 text-base',
    };
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], fullWidth ? 'w-full' : '', className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
