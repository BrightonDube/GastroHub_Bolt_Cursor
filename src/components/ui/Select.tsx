import React from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  options,
  className,
  id,
  ...props
}, ref) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
         className="block text-sm font-medium text-foreground mb-1 dark:text-neutral-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
           'w-full px-3 py-2 border border-input rounded-lg text-sm appearance-none bg-background',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
           'disabled:bg-muted disabled:cursor-not-allowed',
           'disabled:bg-muted disabled:cursor-not-allowed',
           'dark:border-neutral-700',
           error && 'border-error-500 focus:ring-error-500 dark:border-error-700',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
       <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500 pointer-events-none" />
      </div>
      {error && (
       <p className="mt-1 text-sm text-error-600 dark:text-error-400">{error}</p>
      )}
      {helperText && !error && (
       <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{helperText}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';