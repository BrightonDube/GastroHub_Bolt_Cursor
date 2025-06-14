import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../Input';

describe('Input', () => {
  it('should render with default props', () => {
    render(<Input />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('w-full', 'px-3', 'py-2', 'border');
  });

  it('should render with label', () => {
    render(<Input label="Test Label" />);
    
    const label = screen.getByText('Test Label');
    const input = screen.getByRole('textbox');
    
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'test-label');
    expect(input).toHaveAttribute('id', 'test-label');
  });

  it('should show error state', () => {
    render(<Input error="This field is required" />);
    
    const input = screen.getByRole('textbox');
    const errorMessage = screen.getByText('This field is required');
    
    expect(input).toHaveClass('border-error-500');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-error-600');
  });

  it('should show helper text', () => {
    render(<Input helperText="This is helper text" />);
    
    const helperText = screen.getByText('This is helper text');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('text-neutral-500');
  });

  it('should prioritize error over helper text', () => {
    render(
      <Input 
        error="Error message" 
        helperText="Helper text" 
      />
    );
    
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  it('should handle user input', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'Hello World');
    
    expect(input).toHaveValue('Hello World');
    expect(handleChange).toHaveBeenCalled();
  });

  it('should handle different input types', () => {
    const types = ['text', 'email', 'password', 'number', 'tel', 'url'] as const;
    
    types.forEach(type => {
      const { rerender } = render(<Input type={type} />);
      const input = screen.getByRole(type === 'password' ? 'textbox' : type === 'number' ? 'spinbutton' : 'textbox');
      
      expect(input).toHaveAttribute('type', type);
      rerender(<div />);
    });
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:bg-neutral-50');
  });

  it('should apply custom className', () => {
    render(<Input className="custom-class" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('should handle placeholder text', () => {
    render(<Input placeholder="Enter your name" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Enter your name');
  });

  it('should handle required attribute', () => {
    render(<Input required />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('required');
  });

  it('should handle focus and blur events', async () => {
    const user = userEvent.setup();
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />);
    
    const input = screen.getByRole('textbox');
    
    await user.click(input);
    expect(handleFocus).toHaveBeenCalled();
    
    await user.tab();
    expect(handleBlur).toHaveBeenCalled();
  });

  it('should have proper focus styles', () => {
    render(<Input />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-primary-500');
  });

  it('should handle custom id', () => {
    render(<Input id="custom-id" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'custom-id');
  });

  it('should generate id from label when no id provided', () => {
    render(<Input label="Full Name" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'full-name');
  });

  it('should handle number input with step', () => {
    render(<Input type="number" step="0.01" />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('step', '0.01');
  });

  it('should handle min and max attributes', () => {
    render(<Input type="number" min="0" max="100" />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
  });

  it('should handle maxLength attribute', () => {
    render(<Input maxLength={50} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('maxLength', '50');
  });

  it('should handle autoComplete attribute', () => {
    render(<Input autoComplete="email" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('autoComplete', 'email');
  });

  it('should handle readonly attribute', () => {
    render(<Input readOnly value="Read only value" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveValue('Read only value');
  });

  it('should handle controlled input', async () => {
    const user = userEvent.setup();
    let value = '';
    const setValue = vi.fn((newValue) => { value = newValue; });
    
    const { rerender } = render(
      <Input 
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
      />
    );
    
    const input = screen.getByRole('textbox');
    
    await user.type(input, 'test');
    
    expect(setValue).toHaveBeenCalled();
  });

  it('should handle uncontrolled input', async () => {
    const user = userEvent.setup();
    render(<Input defaultValue="initial" />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('initial');
    
    await user.clear(input);
    await user.type(input, 'new value');
    
    expect(input.value).toBe('new value');
  });
});