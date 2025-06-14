import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from '../RegisterForm';
import { useAuth } from '../../../hooks/useAuth';

// Mock useAuth hook
vi.mock('../../../hooks/useAuth');

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  };
});

describe('RegisterForm', () => {
  const mockSignUp = vi.fn();
  const mockUseAuth = {
    signUp: mockSignUp,
    user: null,
    loading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue(mockUseAuth);
  });

  it('should render registration form correctly', () => {
    render(<RegisterForm />);

    expect(screen.getByText('Join GastroHub')).toBeInTheDocument();
    expect(screen.getByText('Create your account to get started')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('should handle successful registration', async () => {
    const user = userEvent.setup();
    mockSignUp.mockResolvedValue({ error: null });

    render(<RegisterForm />);

    await user.type(screen.getByPlaceholderText('Full name'), 'John Doe');
    await user.type(screen.getByPlaceholderText('Email address'), 'john@example.com');
    await user.selectOptions(screen.getByDisplayValue('Buyer - I want to purchase food products'), 'buyer');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.type(screen.getByPlaceholderText('Confirm password'), 'password123');
    await user.click(screen.getByRole('checkbox', { name: /terms/i }));
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(mockSignUp).toHaveBeenCalledWith('john@example.com', 'password123', {
      fullName: 'John Doe',
      role: 'buyer',
      companyName: undefined,
      phone: undefined,
    });
  });

  it('should validate password confirmation', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByPlaceholderText('Full name'), 'John Doe');
    await user.type(screen.getByPlaceholderText('Email address'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.type(screen.getByPlaceholderText('Confirm password'), 'differentpassword');
    await user.click(screen.getByRole('checkbox', { name: /terms/i }));
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });

    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('should validate password length', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByPlaceholderText('Full name'), 'John Doe');
    await user.type(screen.getByPlaceholderText('Email address'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Password'), '123');
    await user.type(screen.getByPlaceholderText('Confirm password'), '123');
    await user.click(screen.getByRole('checkbox', { name: /terms/i }));
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters long')).toBeInTheDocument();
    });

    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('should show role-specific fields', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    // Test supplier role
    await user.selectOptions(screen.getByDisplayValue('Buyer - I want to purchase food products'), 'supplier');
    
    expect(screen.getByPlaceholderText('Business type (e.g., Farm, Restaurant, Distributor)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tell us about your business and products')).toBeInTheDocument();

    // Test delivery partner role
    await user.selectOptions(screen.getByDisplayValue('Supplier - I want to sell food products'), 'delivery_partner');
    
    expect(screen.getByPlaceholderText('Vehicle type (e.g., Car, Motorcycle, Bicycle)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Service area')).toBeInTheDocument();
  });

  it('should display error message on registration failure', async () => {
    const user = userEvent.setup();
    mockSignUp.mockResolvedValue({ error: 'Email already exists' });

    render(<RegisterForm />);

    await user.type(screen.getByPlaceholderText('Full name'), 'John Doe');
    await user.type(screen.getByPlaceholderText('Email address'), 'existing@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.type(screen.getByPlaceholderText('Confirm password'), 'password123');
    await user.click(screen.getByRole('checkbox', { name: /terms/i }));
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });

  it('should show loading state during submission', async () => {
    const user = userEvent.setup();
    mockSignUp.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ error: null }), 100))
    );

    render(<RegisterForm />);

    await user.type(screen.getByPlaceholderText('Full name'), 'John Doe');
    await user.type(screen.getByPlaceholderText('Email address'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.type(screen.getByPlaceholderText('Confirm password'), 'password123');
    await user.click(screen.getByRole('checkbox', { name: /terms/i }));
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should require terms acceptance', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByPlaceholderText('Full name'), 'John Doe');
    await user.type(screen.getByPlaceholderText('Email address'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.type(screen.getByPlaceholderText('Confirm password'), 'password123');
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);

    // HTML5 validation should prevent submission
    const termsCheckbox = screen.getByRole('checkbox', { name: /terms/i });
    expect(termsCheckbox).toHaveAttribute('required');
  });

  it('should have sign in link', () => {
    render(<RegisterForm />);

    const signInLink = screen.getByText('Sign in');
    expect(signInLink).toBeInTheDocument();
    expect(signInLink.closest('a')).toHaveAttribute('href', '/login');
  });

  it('should handle optional fields correctly', async () => {
    const user = userEvent.setup();
    mockSignUp.mockResolvedValue({ error: null });

    render(<RegisterForm />);

    await user.type(screen.getByPlaceholderText('Full name'), 'John Doe');
    await user.type(screen.getByPlaceholderText('Email address'), 'john@example.com');
    await user.selectOptions(screen.getByDisplayValue('Buyer - I want to purchase food products'), 'buyer');
    await user.type(screen.getByPlaceholderText('Company name (optional)'), 'Test Company');
    await user.type(screen.getByPlaceholderText('Phone number (optional)'), '+1234567890');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.type(screen.getByPlaceholderText('Confirm password'), 'password123');
    await user.click(screen.getByRole('checkbox', { name: /terms/i }));
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(mockSignUp).toHaveBeenCalledWith('john@example.com', 'password123', {
      fullName: 'John Doe',
      role: 'buyer',
      companyName: 'Test Company',
      phone: '+1234567890',
    });
  });

  it('should validate required fields', () => {
    render(<RegisterForm />);

    const requiredFields = [
      screen.getByPlaceholderText('Full name'),
      screen.getByPlaceholderText('Email address'),
      screen.getByPlaceholderText('Password'),
      screen.getByPlaceholderText('Confirm password'),
      screen.getByRole('checkbox', { name: /terms/i }),
    ];

    requiredFields.forEach(field => {
      expect(field).toHaveAttribute('required');
    });
  });

  it('should have proper input types', () => {
    render(<RegisterForm />);

    expect(screen.getByPlaceholderText('Full name')).toHaveAttribute('type', 'text');
    expect(screen.getByPlaceholderText('Email address')).toHaveAttribute('type', 'email');
    expect(screen.getByPlaceholderText('Phone number (optional)')).toHaveAttribute('type', 'tel');
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');
    expect(screen.getByPlaceholderText('Confirm password')).toHaveAttribute('type', 'password');
  });

  it('should handle network errors gracefully', async () => {
    const user = userEvent.setup();
    mockSignUp.mockRejectedValue(new Error('Network error'));

    render(<RegisterForm />);

    await user.type(screen.getByPlaceholderText('Full name'), 'John Doe');
    await user.type(screen.getByPlaceholderText('Email address'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.type(screen.getByPlaceholderText('Confirm password'), 'password123');
    await user.click(screen.getByRole('checkbox', { name: /terms/i }));
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });
});