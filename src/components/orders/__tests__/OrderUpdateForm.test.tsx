import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OrderUpdateForm } from '../OrderUpdateForm';
import { OrderService } from '../../../services/orderService';

// Mock OrderService
vi.mock('../../../services/orderService');

// Mock react-hook-form
vi.mock('react-hook-form', async () => {
  const actual = await vi.importActual('react-hook-form');
  return {
    ...actual,
    useForm: () => ({
      register: vi.fn(() => ({})),
      handleSubmit: vi.fn((fn) => (e) => {
        e.preventDefault();
        fn({
          orderId: 'test-order-123',
          updateType: 'status',
          newValue: 'confirmed',
          reason: 'Payment verified',
          notifyCustomer: true,
        });
      }),
      watch: vi.fn((field) => {
        if (field === 'updateType') return 'status';
        return undefined;
      }),
      setValue: vi.fn(),
      formState: { errors: {} },
      reset: vi.fn(),
    }),
  };
});

describe('OrderUpdateForm', () => {
  const mockOnUpdateComplete = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form fields correctly', () => {
    render(
      <OrderUpdateForm 
        orderId="test-order-123"
        onUpdateComplete={mockOnUpdateComplete}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Update Order')).toBeInTheDocument();
    expect(screen.getByText('Order Information')).toBeInTheDocument();
    expect(screen.getByText('Update Type')).toBeInTheDocument();
    expect(screen.getByText('Update Details')).toBeInTheDocument();
    expect(screen.getByText('Reason for Update')).toBeInTheDocument();
    expect(screen.getByText('Notification Settings')).toBeInTheDocument();
  });

  it('should handle successful order update', async () => {
    const mockUpdateResponse = {
      success: true,
      statusCode: 200,
      data: {
        orderId: 'test-order-123',
        previousValue: 'pending',
        newValue: 'confirmed',
        updateTimestamp: new Date(),
        modificationHistory: [],
      },
    };

    vi.mocked(OrderService.updateOrder).mockResolvedValue(mockUpdateResponse);

    render(
      <OrderUpdateForm 
        orderId="test-order-123"
        onUpdateComplete={mockOnUpdateComplete}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByRole('button', { name: /update order/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Order Updated Successfully!')).toBeInTheDocument();
    });

    expect(mockOnUpdateComplete).toHaveBeenCalledWith(mockUpdateResponse);
  });

  it('should handle update errors', async () => {
    const mockErrorResponse = {
      success: false,
      statusCode: 404,
      error: {
        code: 'ORDER_NOT_FOUND',
        message: 'Order not found',
      },
    };

    vi.mocked(OrderService.updateOrder).mockResolvedValue(mockErrorResponse);

    render(
      <OrderUpdateForm 
        orderId="test-order-123"
        onUpdateComplete={mockOnUpdateComplete}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByRole('button', { name: /update order/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error Updating Order')).toBeInTheDocument();
      expect(screen.getByText('Order not found')).toBeInTheDocument();
    });

    expect(mockOnUpdateComplete).not.toHaveBeenCalled();
  });

  it('should show different fields based on update type', () => {
    const updateTypes = ['status', 'payment', 'shipping', 'cancel'];

    updateTypes.forEach(updateType => {
      // Mock watch to return different update types
      vi.mocked(require('react-hook-form').useForm).mockReturnValue({
        register: vi.fn(() => ({})),
        handleSubmit: vi.fn(),
        watch: vi.fn((field) => field === 'updateType' ? updateType : undefined),
        setValue: vi.fn(),
        formState: { errors: {} },
        reset: vi.fn(),
      });

      const { rerender } = render(
        <OrderUpdateForm 
          orderId="test-order-123"
          onUpdateComplete={mockOnUpdateComplete}
          onCancel={mockOnCancel}
        />
      );

      switch (updateType) {
        case 'status':
          expect(screen.getByText('New Status')).toBeInTheDocument();
          break;
        case 'payment':
          expect(screen.getByText('Payment Status')).toBeInTheDocument();
          break;
        case 'shipping':
          expect(screen.getByText('Street Address')).toBeInTheDocument();
          expect(screen.getByText('City')).toBeInTheDocument();
          break;
        case 'cancel':
          expect(screen.getByText('Cancel Order')).toBeInTheDocument();
          expect(screen.getByText('This action will cancel the order and cannot be undone')).toBeInTheDocument();
          break;
      }

      // Clean up for next iteration
      rerender(<div />);
    });
  });

  it('should show cancel button variant for cancel update type', () => {
    // Mock watch to return 'cancel' update type
    vi.mocked(require('react-hook-form').useForm).mockReturnValue({
      register: vi.fn(() => ({})),
      handleSubmit: vi.fn(),
      watch: vi.fn((field) => field === 'updateType' ? 'cancel' : undefined),
      setValue: vi.fn(),
      formState: { errors: {} },
      reset: vi.fn(),
    });

    render(
      <OrderUpdateForm 
        orderId="test-order-123"
        onUpdateComplete={mockOnUpdateComplete}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByRole('button', { name: /cancel order/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveClass('bg-error-600'); // Danger variant
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(
      <OrderUpdateForm 
        orderId="test-order-123"
        onUpdateComplete={mockOnUpdateComplete}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should show loading state during submission', async () => {
    // Mock a delayed response
    vi.mocked(OrderService.updateOrder).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        success: true,
        statusCode: 200,
        data: {
          orderId: 'test-order-123',
          previousValue: 'pending',
          newValue: 'confirmed',
          updateTimestamp: new Date(),
          modificationHistory: [],
        },
      }), 100))
    );

    render(
      <OrderUpdateForm 
        orderId="test-order-123"
        onUpdateComplete={mockOnUpdateComplete}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByRole('button', { name: /update order/i });
    fireEvent.click(submitButton);

    // Should show loading state
    expect(submitButton).toBeDisabled();
  });

  it('should handle network errors gracefully', async () => {
    vi.mocked(OrderService.updateOrder).mockRejectedValue(
      new Error('Network connection failed')
    );

    render(
      <OrderUpdateForm 
        orderId="test-order-123"
        onUpdateComplete={mockOnUpdateComplete}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByRole('button', { name: /update order/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error Updating Order')).toBeInTheDocument();
      expect(screen.getByText('Network connection failed')).toBeInTheDocument();
    });
  });

  it('should display success details correctly', async () => {
    const mockUpdateResponse = {
      success: true,
      statusCode: 200,
      data: {
        orderId: 'test-order-123',
        previousValue: 'pending',
        newValue: 'confirmed',
        updateTimestamp: new Date('2024-01-01T12:00:00Z'),
        modificationHistory: [
          {
            timestamp: new Date('2024-01-01T11:00:00Z'),
            updateType: 'status',
            oldValue: 'pending',
            newValue: 'confirmed',
            reason: 'Payment verified',
            userId: 'user-123',
          },
        ],
      },
    };

    vi.mocked(OrderService.updateOrder).mockResolvedValue(mockUpdateResponse);

    render(
      <OrderUpdateForm 
        orderId="test-order-123"
        onUpdateComplete={mockOnUpdateComplete}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByRole('button', { name: /update order/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Order Updated Successfully!')).toBeInTheDocument();
      expect(screen.getByText('test-order-123')).toBeInTheDocument();
      expect(screen.getByText('pending')).toBeInTheDocument();
      expect(screen.getByText('confirmed')).toBeInTheDocument();
    });
  });

  it('should validate form fields', () => {
    // Mock form with validation errors
    vi.mocked(require('react-hook-form').useForm).mockReturnValue({
      register: vi.fn(() => ({})),
      handleSubmit: vi.fn(),
      watch: vi.fn(() => 'status'),
      setValue: vi.fn(),
      formState: { 
        errors: {
          orderId: { message: 'Order ID is required' },
          newValue: { message: 'New value is required' },
        }
      },
      reset: vi.fn(),
    });

    render(
      <OrderUpdateForm 
        onUpdateComplete={mockOnUpdateComplete}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Order ID is required')).toBeInTheDocument();
    expect(screen.getByText('New value is required')).toBeInTheDocument();
  });
});