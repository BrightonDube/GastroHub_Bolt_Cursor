import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
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

  it('should render with neon styles', () => {
    render(<Button variant="solid">Neon Button</Button>);
    
    const button = screen.getByRole('button', { name: /neon button/i });
    expect(button).toHaveClass('bg-neon-500', 'text-white');
  });

  it('should render with different variants', () => {
    render(
      <>
        <Button variant="solid">Solid</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </>
    );
    
    expect(screen.getByRole('button', { name: /solid/i })).toHaveClass('bg-primary-600');
    expect(screen.getByRole('button', { name: /outline/i })).toHaveClass('border-2', 'border-primary-600');
    expect(screen.getByRole('button', { name: /ghost/i })).toHaveClass('bg-transparent');
  });
});