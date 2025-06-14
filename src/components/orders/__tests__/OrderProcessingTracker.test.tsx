import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OrderProcessingTracker } from '../OrderProcessingTracker';
import { OrderService } from '../../../services/orderService';

// Mock OrderService
vi.mock('../../../services/orderService');

describe('OrderProcessingTracker', () => {
  const mockOrderId = 'test-order-123';
  const mockOnProcessingComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render initial state correctly', () => {
    render(
      <OrderProcessingTracker 
        orderId={mockOrderId}
        onProcessingComplete={mockOnProcessingComplete}
      />
    );

    expect(screen.getByText('Order Processing Tracker')).toBeInTheDocument();
    expect(screen.getByText(`Order ID: ${mockOrderId}`)).toBeInTheDocument();
    expect(screen.getByText('Not Started')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start processing/i })).toBeInTheDocument();
  });

  it('should start processing when button is clicked', async () => {
    const mockProcessingResponse = {
      success: true,
      statusCode: 200,
      data: {
        orderId: mockOrderId,
        currentStatus: 'processing',
        currentStep: 3,
        totalSteps: 6,
        steps: [
          {
            stepNumber: 1,
            stepName: 'Verify Payment',
            status: 'completed',
            timestamp: new Date(),
            details: 'Payment verified successfully',
          },
          {
            stepNumber: 2,
            stepName: 'Check Inventory',
            status: 'completed',
            timestamp: new Date(),
            details: 'Inventory confirmed and reserved',
          },
          {
            stepNumber: 3,
            stepName: 'Pack Items',
            status: 'in_progress',
            timestamp: new Date(),
          },
        ],
        estimatedDeliveryDate: new Date(),
        trackingNumber: 'TRK123456',
      },
    };

    vi.mocked(OrderService.processOrder).mockResolvedValue(mockProcessingResponse);

    render(
      <OrderProcessingTracker 
        orderId={mockOrderId}
        onProcessingComplete={mockOnProcessingComplete}
      />
    );

    const startButton = screen.getByRole('button', { name: /start processing/i });
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });

    expect(screen.getByText('50%')).toBeInTheDocument(); // 3/6 = 50%
    expect(screen.getByText('Verify Payment')).toBeInTheDocument();
    expect(screen.getByText('Check Inventory')).toBeInTheDocument();
    expect(screen.getByText('Pack Items')).toBeInTheDocument();
    expect(screen.getByText('TRK123456')).toBeInTheDocument();

    expect(mockOnProcessingComplete).toHaveBeenCalledWith(mockProcessingResponse);
  });

  it('should handle processing errors', async () => {
    const mockErrorResponse = {
      success: false,
      statusCode: 500,
      error: {
        code: 'PROCESSING_ERROR',
        message: 'Payment verification failed',
        step: 1,
      },
    };

    vi.mocked(OrderService.processOrder).mockResolvedValue(mockErrorResponse);

    render(
      <OrderProcessingTracker 
        orderId={mockOrderId}
        onProcessingComplete={mockOnProcessingComplete}
      />
    );

    const startButton = screen.getByRole('button', { name: /start processing/i });
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText('Processing Error')).toBeInTheDocument();
      expect(screen.getByText('Payment verification failed')).toBeInTheDocument();
    });
  });

  it('should show loading state during processing', async () => {
    // Mock a delayed response
    vi.mocked(OrderService.processOrder).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        success: true,
        statusCode: 200,
        data: {
          orderId: mockOrderId,
          currentStatus: 'completed',
          currentStep: 6,
          totalSteps: 6,
          steps: [],
          estimatedDeliveryDate: new Date(),
        },
      }), 100))
    );

    render(
      <OrderProcessingTracker 
        orderId={mockOrderId}
        onProcessingComplete={mockOnProcessingComplete}
      />
    );

    const startButton = screen.getByRole('button', { name: /start processing/i });
    fireEvent.click(startButton);

    expect(screen.getByText('Processing Order')).toBeInTheDocument();
    expect(screen.getByText('Please wait while we process your order through all required steps...')).toBeInTheDocument();
  });

  it('should display step status correctly', async () => {
    const mockSteps = [
      {
        stepNumber: 1,
        stepName: 'Verify Payment',
        status: 'completed' as const,
        timestamp: new Date(),
        details: 'Payment verified successfully',
      },
      {
        stepNumber: 2,
        stepName: 'Check Inventory',
        status: 'in_progress' as const,
        timestamp: new Date(),
      },
      {
        stepNumber: 3,
        stepName: 'Pack Items',
        status: 'failed' as const,
        timestamp: new Date(),
        error: 'Insufficient stock',
      },
      {
        stepNumber: 4,
        stepName: 'Generate Shipping Label',
        status: 'pending' as const,
      },
    ];

    const mockResponse = {
      success: true,
      statusCode: 200,
      data: {
        orderId: mockOrderId,
        currentStatus: 'processing',
        currentStep: 2,
        totalSteps: 4,
        steps: mockSteps,
        estimatedDeliveryDate: new Date(),
      },
    };

    vi.mocked(OrderService.processOrder).mockResolvedValue(mockResponse);

    render(
      <OrderProcessingTracker 
        orderId={mockOrderId}
        onProcessingComplete={mockOnProcessingComplete}
      />
    );

    const startButton = screen.getByRole('button', { name: /start processing/i });
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText('Verify Payment')).toBeInTheDocument();
      expect(screen.getByText('Check Inventory')).toBeInTheDocument();
      expect(screen.getByText('Pack Items')).toBeInTheDocument();
      expect(screen.getByText('Generate Shipping Label')).toBeInTheDocument();
    });

    // Check status badges
    expect(screen.getByText('completed')).toBeInTheDocument();
    expect(screen.getByText('in progress')).toBeInTheDocument();
    expect(screen.getByText('failed')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();

    // Check details and errors
    expect(screen.getByText('Payment verified successfully')).toBeInTheDocument();
    expect(screen.getByText('Error: Insufficient stock')).toBeInTheDocument();
  });

  it('should calculate progress percentage correctly', async () => {
    const testCases = [
      { currentStep: 0, totalSteps: 6, expected: '0%' },
      { currentStep: 3, totalSteps: 6, expected: '50%' },
      { currentStep: 6, totalSteps: 6, expected: '100%' },
    ];

    for (const testCase of testCases) {
      const mockResponse = {
        success: true,
        statusCode: 200,
        data: {
          orderId: mockOrderId,
          currentStatus: 'processing',
          currentStep: testCase.currentStep,
          totalSteps: testCase.totalSteps,
          steps: [],
          estimatedDeliveryDate: new Date(),
        },
      };

      vi.mocked(OrderService.processOrder).mockResolvedValue(mockResponse);

      const { rerender } = render(
        <OrderProcessingTracker 
          orderId={mockOrderId}
          onProcessingComplete={mockOnProcessingComplete}
        />
      );

      const startButton = screen.getByRole('button', { name: /start processing/i });
      fireEvent.click(startButton);

      await waitFor(() => {
        expect(screen.getByText(testCase.expected)).toBeInTheDocument();
      });

      // Clean up for next iteration
      rerender(<div />);
      vi.clearAllMocks();
    }
  });

  it('should handle network errors gracefully', async () => {
    vi.mocked(OrderService.processOrder).mockRejectedValue(
      new Error('Network connection failed')
    );

    render(
      <OrderProcessingTracker 
        orderId={mockOrderId}
        onProcessingComplete={mockOnProcessingComplete}
      />
    );

    const startButton = screen.getByRole('button', { name: /start processing/i });
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText('Processing Error')).toBeInTheDocument();
      expect(screen.getByText('Network connection failed')).toBeInTheDocument();
    });
  });

  it('should show completed status when all steps are done', async () => {
    const mockResponse = {
      success: true,
      statusCode: 200,
      data: {
        orderId: mockOrderId,
        currentStatus: 'delivered',
        currentStep: 6,
        totalSteps: 6,
        steps: Array.from({ length: 6 }, (_, i) => ({
          stepNumber: i + 1,
          stepName: `Step ${i + 1}`,
          status: 'completed' as const,
          timestamp: new Date(),
        })),
        estimatedDeliveryDate: new Date(),
        trackingNumber: 'TRK123456',
      },
    };

    vi.mocked(OrderService.processOrder).mockResolvedValue(mockResponse);

    render(
      <OrderProcessingTracker 
        orderId={mockOrderId}
        onProcessingComplete={mockOnProcessingComplete}
      />
    );

    const startButton = screen.getByRole('button', { name: /start processing/i });
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });
});