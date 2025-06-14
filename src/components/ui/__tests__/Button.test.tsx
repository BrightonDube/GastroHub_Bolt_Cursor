import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary-900'); // Primary variant
    expect(button).toHaveClass('px-4', 'py-2'); // Medium size
  });

  it('should render different variants correctly', () => {
    const variants = ['primary', 'secondary', 'ghost', 'outline', 'danger'] as const;
    
    variants.forEach(variant => {
      const { rerender } = render(<Button variant={variant}>Test</Button>);
      const button = screen.getByRole('button');
      
      switch (variant) {
        case 'primary':
          expect(button).toHaveClass('bg-primary-900');
          break;
        case 'secondary':
          expect(button).toHaveClass('bg-secondary-400');
          break;
        case 'ghost':
          expect(button).toHaveClass('text-primary-900', 'hover:bg-primary-50');
          break;
        case 'outline':
          expect(button).toHaveClass('border', 'border-primary-200');
          break;
        case 'danger':
          expect(button).toHaveClass('bg-error-600');
          break;
      }
      
      rerender(<div />);
    });
  });

  it('should render different sizes correctly', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    
    sizes.forEach(size => {
      const { rerender } = render(<Button size={size}>Test</Button>);
      const button = screen.getByRole('button');
      
      switch (size) {
        case 'sm':
          expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
          break;
        case 'md':
          expect(button).toHaveClass('px-4', 'py-2', 'text-sm');
          break;
        case 'lg':
          expect(button).toHaveClass('px-6', 'py-3', 'text-base');
          break;
      }
      
      rerender(<div />);
    });
  });

  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should show loading state', () => {
    render(<Button loading>Loading</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Loading');
    
    // Check for loading spinner
    const spinner = button.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('should be disabled when loading', () => {
    render(<Button loading>Loading</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should not trigger click when disabled', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    render(<Button className="custom-class">Test</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should forward HTML button props', () => {
    render(<Button type="submit" data-testid="submit-btn">Submit</Button>);
    
    const button = screen.getByTestId('submit-btn');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should have proper accessibility attributes', () => {
    render(<Button aria-label="Custom label">Test</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Custom label');
  });

  it('should handle keyboard navigation', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Test</Button>);
    
    const button = screen.getByRole('button');
    
    // Test Enter key
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    fireEvent.keyUp(button, { key: 'Enter', code: 'Enter' });
    
    // Test Space key
    fireEvent.keyDown(button, { key: ' ', code: 'Space' });
    fireEvent.keyUp(button, { key: ' ', code: 'Space' });
    
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('should have focus styles', () => {
    render(<Button>Test</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('focus:outline-none', 'focus:ring-2');
  });

  it('should have hover styles', () => {
    render(<Button>Test</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-primary-800');
  });

  it('should handle long text gracefully', () => {
    const longText = 'This is a very long button text that should be handled gracefully without breaking the layout';
    render(<Button>{longText}</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent(longText);
  });

  it('should render with icons', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;
    render(
      <Button>
        <TestIcon />
        Button with icon
      </Button>
    );
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('Button with icon')).toBeInTheDocument();
  });
});