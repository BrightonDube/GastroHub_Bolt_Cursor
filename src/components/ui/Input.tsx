import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
         className="block text-sm font-medium text-foreground mb-1 dark:text-neutral-300"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
         'w-full px-3 py-2 border border-input rounded-lg text-sm placeholder-neutral-500 bg-background',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
         'disabled:bg-muted disabled:cursor-not-allowed',
         'disabled:bg-muted disabled:cursor-not-allowed',
         'dark:border-neutral-700 dark:placeholder-neutral-400',
         error && 'border-error-500 focus:ring-error-500 dark:border-error-700',
          className
        )}
        {...props}
      />
      {error && (
       <p className="mt-1 text-sm text-error-600 dark:text-error-400">{error}</p>
      )}
      {helperText && !error && (
       <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';