export interface OrderRequest {
  buyerId: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentDetails: {
    method: 'credit_card' | 'bank_transfer' | 'digital_wallet';
    currency: string;
  };
  specialInstructions?: string;
}

export interface OrderProcessing {
  orderId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  currentStep: number;
  estimatedDeliveryDate: Date;
  trackingNumber?: string;
  handlingInstructions?: string;
}

export interface OrderUpdate {
  orderId: string;
  updateType: 'status' | 'shipping' | 'payment' | 'cancel';
  newValue: any;
  reason?: string;
  notifyCustomer: boolean;
}

export interface OrderResponse {
  success: boolean;
  statusCode: number;
  data?: {
    orderId: string;
    orderNumber: string;
    totalAmount: number;
    subtotal: number;
    taxes: number;
    shippingCost: number;
    discountAmount: number;
    estimatedDeliveryDate: Date;
    trackingNumber?: string;
    paymentStatus: string;
    items: Array<{
      productId: string;
      productName: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      availability: boolean;
    }>;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface ProcessingStep {
  stepNumber: number;
  stepName: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  timestamp?: Date;
  details?: string;
  error?: string;
}

export interface OrderProcessingResponse {
  success: boolean;
  statusCode: number;
  data?: {
    orderId: string;
    currentStatus: string;
    currentStep: number;
    totalSteps: number;
    steps: ProcessingStep[];
    estimatedDeliveryDate: Date;
    trackingNumber?: string;
  };
  error?: {
    code: string;
    message: string;
    step?: number;
  };
}

export interface OrderUpdateResponse {
  success: boolean;
  statusCode: number;
  data?: {
    orderId: string;
    previousValue: any;
    newValue: any;
    updateTimestamp: Date;
    modificationHistory: Array<{
      timestamp: Date;
      updateType: string;
      oldValue: any;
      newValue: any;
      reason?: string;
      userId: string;
    }>;
  };
  error?: {
    code: string;
    message: string;
    conflicts?: any[];
  };
}