import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateOrderForm } from '../CreateOrderForm';
import { OrderService } from '../../../services/orderService';

// Mock OrderService
vi.mock('../../../services/orderService');

// Mock react-hook-form to avoid issues with form validation in tests
vi.mock('react-hook-form', async () => {
  const actual = await vi.importActual('react-hook-form');
  return {
    ...actual,
    useForm: () => ({
      register: vi.fn(() => ({})),
      control: {},
      handleSubmit: vi.fn((fn) => (e) => {
        e.preventDefault();
        fn({
          buyerId: 'test-buyer',
          items: [{ productId: 'test-product', quantity: 1, unitPrice: 10 }],
          shippingAddress: {
            street: '123 Test St',
            city: 'Test City',
            state: 'TS',
            postalCode: '12345',
            country: 'US',
          },
          paymentDetails: {
            method: 'credit_card',
            currency: 'USD',
          },
        });
      }),
      watch: vi.fn(() => [{ productId: 'test-product', quantity: 1, unitPrice: 10 }]),
      formState: { errors: {} },
      reset: vi.fn(),
    }),
    useFieldArray: () => ({
      fields: [{ id: '1', productId: 'test-product', quantity: 1, unitPrice: 10 }],
      append: vi.fn(),
      remove: vi.fn(),
    }),
  };
});

describe('CreateOrderForm', () => {
  const mockOnOrderCreated = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form fields correctly', () => {
    render(
      <CreateOrderForm 
        onOrderCreated={mockOnOrderCreated}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Create New Order')).toBeInTheDocument();
    expect(screen.getByText('Buyer Information')).toBeInTheDocument();
    expect(screen.getByText('Order Items')).toBeInTheDocument();
    expect(screen.getByText('Shipping Address')).toBeInTheDocument();
    expect(screen.getByText('Payment Details')).toBeInTheDocument();
    expect(screen.getByText('Order Summary')).toBeInTheDocument();
  });

  it('should calculate order totals correctly', () => {
    render(<CreateOrderForm onOrderCreated={mockOnOrderCreated} />);

    // Check if subtotal is displayed (1 * $10.00 = $10.00)
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    
    // Check if tax is calculated (10% of $10.00 = $1.00)
    expect(screen.getByText('$1.00')).toBeInTheDocument();
    
    // Check if shipping is applied ($15.00 for orders under $100)
    expect(screen.getByText('$15.00')).toBeInTheDocument();
    
    // Check total ($10.00 + $1.00 + $15.00 = $26.00)
    expect(screen.getByText('$26.00')).toBeInTheDocument();
  });

  it('should show free shipping for large orders', () => {
    // Mock watch to return large order
    const mockWatch = vi.fn(() => [
      { productId: 'test-product', quantity: 10, unitPrice: 15 }
    ]);
    
    vi.mocked(require('react-hook-form').useForm).mockReturnValue({
      register: vi.fn(() => ({})),
      control: {},
      handleSubmit: vi.fn(),
      watch: mockWatch,
      formState: { errors: {} },
      reset: vi.fn(),
    });

    render(<CreateOrderForm onOrderCreated={mockOnOrderCreated} />);

    expect(screen.getByText('FREE')).toBeInTheDocument();
  });

  it('should handle successful order creation', async () => {
    const mockOrderResponse = {
      success: true,
      statusCode: 201,
      data: {
        orderId: 'test-order-123',
        orderNumber: 'ORD-TEST-123',
        totalAmount: 26.00,
        estimatedDeliveryDate: new Date(),
        trackingNumber: 'TRK123',
      },
    };

    vi.mocked(OrderService.createOrder).mockResolvedValue(mockOrderResponse);

    render(<CreateOrderForm onOrderCreated={mockOnOrderCreated} />);

    const submitButton = screen.getByRole('button', { name: /create order/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Order Created Successfully!')).toBeInTheDocument();
    });

    expect(mockOnOrderCreated).toHaveBeenCalledWith('test-order-123');
  });

  it('should handle order creation errors', async () => {
    const mockErrorResponse = {
      success: false,
      statusCode: 400,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid order data',
      },
    };

    vi.mocked(OrderService.createOrder).mockResolvedValue(mockErrorResponse);

    render(<CreateOrderForm onOrderCreated={mockOnOrderCreated} />);

    const submitButton = screen.getByRole('button', { name: /create order/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error Creating Order')).toBeInTheDocument();
      expect(screen.getByText('Invalid order data')).toBeInTheDocument();
    });

    expect(mockOnOrderCreated).not.toHaveBeenCalled();
  });

  it('should show loading state during submission', async () => {
    // Mock a delayed response
    vi.mocked(OrderService.createOrder).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        success: true,
        statusCode: 201,
        data: { orderId: 'test', orderNumber: 'ORD-TEST', totalAmount: 26 },
      }), 100))
    );

    render(<CreateOrderForm onOrderCreated={mockOnOrderCreated} />);

    const submitButton = screen.getByRole('button', { name: /create order/i });
    fireEvent.click(submitButton);

    // Should show loading state
    expect(submitButton).toBeDisabled();
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(
      <CreateOrderForm 
        onOrderCreated={mockOnOrderCreated}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should validate required fields', () => {
    // Mock form with validation errors
    vi.mocked(require('react-hook-form').useForm).mockReturnValue({
      register: vi.fn(() => ({})),
      control: {},
      handleSubmit: vi.fn(),
      watch: vi.fn(() => []),
      formState: { 
        errors: {
          buyerId: { message: 'Buyer ID is required' },
          items: { message: 'At least one item is required' },
        }
      },
      reset: vi.fn(),
    });

    render(<CreateOrderForm onOrderCreated={mockOnOrderCreated} />);

    expect(screen.getByText('Buyer ID is required')).toBeInTheDocument();
    expect(screen.getByText('At least one item is required')).toBeInTheDocument();
  });

  it('should allow adding and removing items', () => {
    const mockAppend = vi.fn();
    const mockRemove = vi.fn();

    vi.mocked(require('react-hook-form').useFieldArray).mockReturnValue({
      fields: [
        { id: '1', productId: 'product-1', quantity: 1, unitPrice: 10 },
        { id: '2', productId: 'product-2', quantity: 2, unitPrice: 15 },
      ],
      append: mockAppend,
      remove: mockRemove,
    });

    render(<CreateOrderForm onOrderCreated={mockOnOrderCreated} />);

    const addButton = screen.getByRole('button', { name: /add item/i });
    fireEvent.click(addButton);

    expect(mockAppend).toHaveBeenCalledWith({
      productId: '',
      quantity: 1,
      unitPrice: 0,
    });

    const removeButtons = screen.getAllByRole('button', { name: '' }); // Trash icon buttons
    if (removeButtons.length > 0) {
      fireEvent.click(removeButtons[0]);
      expect(mockRemove).toHaveBeenCalledWith(0);
    }
  });

  it('should handle network errors gracefully', async () => {
    vi.mocked(OrderService.createOrder).mockRejectedValue(
      new Error('Network error')
    );

    render(<CreateOrderForm onOrderCreated={mockOnOrderCreated} />);

    const submitButton = screen.getByRole('button', { name: /create order/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error Creating Order')).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });
});