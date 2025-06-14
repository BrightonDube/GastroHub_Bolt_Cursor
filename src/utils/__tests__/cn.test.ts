import { describe, it, expect } from 'vitest';
import { cn } from '../cn';

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    const result = cn('px-4', 'py-2', 'bg-blue-500');
    expect(result).toBe('px-4 py-2 bg-blue-500');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toBe('base-class active-class');

    const isInactive = false;
    const result2 = cn('base-class', isInactive && 'inactive-class');
    expect(result2).toBe('base-class');
  });

  it('should handle arrays of classes', () => {
    const result = cn(['px-4', 'py-2'], 'bg-blue-500');
    expect(result).toBe('px-4 py-2 bg-blue-500');
  });

  it('should handle objects with boolean values', () => {
    const result = cn({
      'px-4': true,
      'py-2': true,
      'bg-blue-500': false,
      'text-white': true,
    });
    expect(result).toBe('px-4 py-2 text-white');
  });

  it('should merge conflicting Tailwind classes correctly', () => {
    // twMerge should handle conflicting classes
    const result = cn('px-4 px-6', 'py-2 py-4');
    expect(result).toBe('px-6 py-4');
  });

  it('should handle undefined and null values', () => {
    const result = cn('px-4', undefined, null, 'py-2');
    expect(result).toBe('px-4 py-2');
  });

  it('should handle empty strings', () => {
    const result = cn('px-4', '', 'py-2');
    expect(result).toBe('px-4 py-2');
  });

  it('should handle complex combinations', () => {
    const isActive = true;
    const variant = 'primary';
    const size = 'lg';
    
    const result = cn(
      'base-class',
      {
        'active-class': isActive,
        'inactive-class': !isActive,
      },
      variant === 'primary' && 'bg-blue-500',
      variant === 'secondary' && 'bg-gray-500',
      size === 'lg' ? 'text-lg' : 'text-sm'
    );
    
    expect(result).toBe('base-class active-class bg-blue-500 text-lg');
  });

  it('should handle nested arrays and objects', () => {
    const result = cn(
      ['px-4', 'py-2'],
      {
        'bg-blue-500': true,
        'text-white': false,
      },
      [
        'rounded',
        {
          'shadow-lg': true,
        }
      ]
    );
    
    expect(result).toBe('px-4 py-2 bg-blue-500 rounded shadow-lg');
  });

  it('should preserve order for non-conflicting classes', () => {
    const result = cn('first', 'second', 'third');
    expect(result).toBe('first second third');
  });

  it('should handle responsive classes correctly', () => {
    const result = cn('px-4', 'md:px-6', 'lg:px-8');
    expect(result).toBe('px-4 md:px-6 lg:px-8');
  });

  it('should handle hover and focus states', () => {
    const result = cn('bg-blue-500', 'hover:bg-blue-600', 'focus:bg-blue-700');
    expect(result).toBe('bg-blue-500 hover:bg-blue-600 focus:bg-blue-700');
  });

  it('should handle dark mode classes', () => {
    const result = cn('bg-white', 'dark:bg-gray-900', 'text-black', 'dark:text-white');
    expect(result).toBe('bg-white dark:bg-gray-900 text-black dark:text-white');
  });

  it('should merge similar utility classes', () => {
    // Test margin merging
    const result1 = cn('m-4', 'm-6');
    expect(result1).toBe('m-6');

    // Test padding merging
    const result2 = cn('p-2', 'p-4', 'p-6');
    expect(result2).toBe('p-6');

    // Test background color merging
    const result3 = cn('bg-red-500', 'bg-blue-500', 'bg-green-500');
    expect(result3).toBe('bg-green-500');
  });

  it('should handle arbitrary values', () => {
    const result = cn('w-[100px]', 'h-[200px]', 'bg-[#ff0000]');
    expect(result).toBe('w-[100px] h-[200px] bg-[#ff0000]');
  });

  it('should handle important modifiers', () => {
    const result = cn('!important', 'text-red-500', '!text-blue-500');
    expect(result).toBe('!important !text-blue-500');
  });
});