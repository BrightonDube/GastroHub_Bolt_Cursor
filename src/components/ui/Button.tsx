import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-500 text-primary-foreground hover:bg-primary-600 focus:ring-primary-500 shadow-sm hover:shadow-md dark:bg-primary-600 dark:hover:bg-primary-700',
    secondary: 'bg-secondary-500 text-secondary-foreground hover:bg-secondary-600 focus:ring-secondary-500 shadow-sm hover:shadow-md dark:bg-secondary-600 dark:hover:bg-secondary-700',
    ghost: 'text-foreground hover:bg-muted focus:ring-primary-500 dark:hover:bg-neutral-800',
    outline: 'border border-input text-foreground hover:bg-muted focus:ring-primary-500 dark:border-neutral-700 dark:hover:bg-neutral-800',
    danger: 'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500 shadow-sm hover:shadow-md dark:bg-error-600 dark:hover:bg-error-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
}