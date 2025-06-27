import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CurrencyDisplay } from '../ui/CurrencyDisplay';
import { DateDisplay } from '../ui/DateDisplay';
import { useLocalization } from '../../context/LocalizationProvider';
import { OrderService } from '../../services/orderService';
import { OrderRequest } from '../../types/order';
import { 
  Plus, 
  Trash2, 
  ShoppingCart, 
  CreditCard, 
  MapPin,
  Package,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const orderSchema = z.object({
  buyerId: z.string().min(1, 'Buyer ID is required'),
  items: z.array(z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    unitPrice: z.number().min(0.01, 'Unit price must be greater than 0'),
  })).min(1, 'At least one item is required'),
  shippingAddress: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  paymentDetails: z.object({
    method: z.enum(['credit_card', 'bank_transfer', 'digital_wallet']),
    currency: z.string().min(1, 'Currency is required'),
  }),
  specialInstructions: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface CreateOrderFormProps {
  onOrderCreated?: (orderId: string) => void;
  onCancel?: () => void;
}

export function CreateOrderForm({ onOrderCreated, onCancel }: CreateOrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isZARMode } = useLocalization();
  const [orderResult, setOrderResult] = useState<{
    success: boolean;
    data?: {
      orderId: string;
      orderNumber: string;
      totalAmount: number;
      estimatedDeliveryDate: string;
      trackingNumber?: string;
    };
    error?: { message: string };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      items: [{ productId: '', quantity: 1, unitPrice: 0 }],
      paymentDetails: {
        method: 'credit_card',
        currency: isZARMode ? 'ZAR' : 'USD',
      },
      shippingAddress: {
        country: isZARMode ? 'ZA' : 'US',
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');

  const paymentMethods = [
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'digital_wallet', label: 'Digital Wallet' },
  ];

  const currencies = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'ZAR', label: 'ZAR - South African Rand' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
  ];

  const calculateSubtotal = () => {
    return watchedItems.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      return sum + (quantity * price);
    }, 0);
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.1; // 10% tax
  };

  const calculateShipping = (subtotal: number) => {
    return subtotal > 100 ? 0 : 15; // Free shipping over $100
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const shipping = calculateShipping(subtotal);
    return subtotal + tax + shipping;
  };

const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const orderRequest: OrderRequest = {
        ...data,
        items: data.items.map(item => ({
          ...item,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
        })),
      };

      const result = await OrderService.createOrder(orderRequest);
      
      if (result.success) {
        setOrderResult(result);
        toast.success('Order placed successfully!');
        onOrderCreated?.(result.data!.orderId);
      } else {
        setError(result.error?.message || 'Failed to create order');
        toast.error(result.error?.message || 'Failed to create order');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderResult?.success) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Order Created Successfully!
          </h2>
          <p className="text-neutral-600 mb-6">
            Your order #{orderResult.data.orderNumber} has been created and is being processed.
          </p>
          
          <div className="bg-neutral-50 rounded-lg p-6 mb-6 text-left">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-neutral-700">Order ID:</span>
                <p className="text-neutral-900">{orderResult.data.orderId}</p>
              </div>
              <div>
                <span className="font-medium text-neutral-700">Order Number:</span>
                <p className="text-neutral-900">{orderResult.data.orderNumber}</p>
              </div>
              <div>
                <span className="font-medium text-neutral-700">Total Amount:</span>
                <p className="text-neutral-900 font-semibold">${orderResult.data.totalAmount.toFixed(2)}</p>
              </div>
              <div>
                <span className="font-medium text-neutral-700">Estimated Delivery:</span>
                <p className="text-neutral-900">
                  {new Date(orderResult.data.estimatedDeliveryDate).toLocaleDateString()}
                </p>
              </div>
              {orderResult.data.trackingNumber && (
                <div className="col-span-2">
                  <span className="font-medium text-neutral-700">Tracking Number:</span>
                  <p className="text-neutral-900 font-mono">{orderResult.data.trackingNumber}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-4 justify-center">
            <Button onClick={() => reset()}>
              Create Another Order
            </Button>
            <Button onClick={() => window.location.href = '/orders'}>
              View All Orders
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-2">
          Create New Order
        </h1>
        <p className="text-neutral-600">
          Fill out the form below to create a new order
        </p>
      </div>

      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-error-600 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-error-800">Error Creating Order</h3>
            <p className="text-sm text-error-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Buyer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Buyer Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              label="Buyer ID"
              {...register('buyerId')}
              error={errors.buyerId?.message}
              placeholder="Enter buyer ID"
            />
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Order Items</span>
              </div>
              <Button
                type="button"
                onClick={() => append({ productId: '', quantity: 1, unitPrice: 0 })}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-neutral-50 rounded-lg">
                  <Input
                    label="Product ID"
                    {...register(`items.${index}.productId`)}
                    error={errors.items?.[index]?.productId?.message}
                    placeholder="Product ID"
                  />
                  <Input
                    label="Quantity"
                    type="number"
                    {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    error={errors.items?.[index]?.quantity?.message}
                    placeholder="1"
                  />
                  <Input
                    label="Unit Price"
                    type="number"
                    step="0.01"
                    {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                    error={errors.items?.[index]?.unitPrice?.message}
                    placeholder="0.00"
                  />
                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      variant="ghost"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {errors.items && (
              <p className="mt-2 text-sm text-error-600">{errors.items.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Shipping Address</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Street Address"
                  {...register('shippingAddress.street')}
                  error={errors.shippingAddress?.street?.message}
                  placeholder="123 Main Street"
                />
              </div>
              <Input
                label="City"
                {...register('shippingAddress.city')}
                error={errors.shippingAddress?.city?.message}
                placeholder="New York"
              />
              <Input
                label="State"
                {...register('shippingAddress.state')}
                error={errors.shippingAddress?.state?.message}
                placeholder="NY"
              />
              <Input
                label="Postal Code"
                {...register('shippingAddress.postalCode')}
                error={errors.shippingAddress?.postalCode?.message}
                placeholder="10001"
              />
              <Input
                label="Country"
                {...register('shippingAddress.country')}
                error={errors.shippingAddress?.country?.message}
                placeholder="US"
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Payment Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Payment Method"
                options={paymentMethods}
                {...register('paymentDetails.method')}
                error={errors.paymentDetails?.method?.message}
              />
              <Select
                label="Currency"
                options={currencies}
                {...register('paymentDetails.currency')}
                error={errors.paymentDetails?.currency?.message}
              />
            </div>
          </CardContent>
        </Card>

        {/* Special Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Special Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              {...register('specialInstructions')}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              placeholder="Any special instructions for this order..."
            />
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal:</span>
                <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Tax (10%):</span>
                <span className="font-medium">${calculateTax(calculateSubtotal()).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Shipping:</span>
                <span className="font-medium">
                  {calculateShipping(calculateSubtotal()) === 0 ? 'FREE' : `$${calculateShipping(calculateSubtotal()).toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-neutral-200 pt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-neutral-900">Total:</span>
                  <span className="text-lg font-bold text-primary-900">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button type="button" onClick={onCancel} variant="ghost">
              Cancel
            </Button>
          )}
          <Button type="submit" loading={isSubmitting} size="lg" variant="solid">
            Create Order
          </Button>
        </div>
      </form>
    </div>
  );
}