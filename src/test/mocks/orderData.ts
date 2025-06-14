import { OrderRequest, ProcessingStep } from '../../types/order';

export const mockOrderRequest: OrderRequest = {
  buyerId: 'buyer-123',
  items: [
    {
      productId: 'product-1',
      quantity: 2,
      unitPrice: 25.50,
    },
    {
      productId: 'product-2',
      quantity: 1,
      unitPrice: 15.00,
    },
  ],
  shippingAddress: {
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'US',
  },
  paymentDetails: {
    method: 'credit_card',
    currency: 'USD',
  },
  specialInstructions: 'Handle with care',
};

export const mockInvalidOrderRequest: Partial<OrderRequest> = {
  buyerId: '',
  items: [],
  shippingAddress: {
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  },
  paymentDetails: {
    method: 'credit_card',
    currency: '',
  },
};

export const mockProducts = [
  {
    id: 'product-1',
    name: 'Organic Tomatoes',
    availability: 'available',
    price: 25.50,
  },
  {
    id: 'product-2',
    name: 'Fresh Basil',
    availability: 'available',
    price: 15.00,
  },
];

export const mockUnavailableProducts = [
  {
    id: 'product-1',
    name: 'Organic Tomatoes',
    availability: 'out_of_stock',
    price: 25.50,
  },
];

export const mockOrder = {
  id: 'order-123',
  buyer_id: 'buyer-123',
  supplier_id: 'supplier-123',
  status: 'pending',
  total_amount: 66.00,
  delivery_address: mockOrderRequest.shippingAddress,
  payment_method: 'credit_card',
  payment_status: 'pending',
  special_instructions: 'Handle with care',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockProcessingSteps: ProcessingStep[] = [
  {
    stepNumber: 1,
    stepName: 'Verify Payment',
    status: 'completed',
    timestamp: new Date('2024-01-01T00:00:00Z'),
    details: 'Payment verified successfully',
  },
  {
    stepNumber: 2,
    stepName: 'Check Inventory',
    status: 'completed',
    timestamp: new Date('2024-01-01T00:01:00Z'),
    details: 'Inventory confirmed and reserved',
  },
  {
    stepNumber: 3,
    stepName: 'Pack Items',
    status: 'in_progress',
    timestamp: new Date('2024-01-01T00:02:00Z'),
  },
];