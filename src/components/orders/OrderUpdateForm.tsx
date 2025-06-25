import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { OrderService } from '../../services/orderService';
import { OrderUpdate } from '../../types/order';
import { 
  Edit, 
  AlertCircle, 
  CheckCircle,
  Package,
  CreditCard,
  Truck,
  XCircle
} from 'lucide-react';

const updateSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  updateType: z.enum(['status', 'shipping', 'payment', 'cancel']),
  newValue: z.any(),
  reason: z.string().optional(),
  notifyCustomer: z.boolean().default(true),
});

type UpdateFormData = z.infer<typeof updateSchema>;

interface OrderUpdateFormProps {
  orderId?: string;
  currentOrder?: {
    id: string;
    status: string;
    paymentStatus: string;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
  onUpdateComplete?: (result: {
    success: boolean;
    data?: {
      orderId: string;
      previousValue: string | Record<string, unknown>;
      newValue: string | Record<string, unknown>;
    };
    error?: { message: string };
  }) => void;
  onCancel?: () => void;
}

export function OrderUpdateForm({ 
  orderId, 
  currentOrder, 
  onUpdateComplete, 
  onCancel 
}: OrderUpdateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateResult, setUpdateResult] = useState<{
    success: boolean;
    data?: {
      orderId: string;
      previousValue: string | Record<string, unknown>;
      newValue: string | Record<string, unknown>;
    };
    error?: { message: string };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<UpdateFormData>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      orderId: orderId || '',
      updateType: 'status',
      notifyCustomer: true,
    },
  });

  const watchedUpdateType = watch('updateType');

  const updateTypes = [
    { value: 'status', label: 'Order Status', icon: Package },
    { value: 'shipping', label: 'Shipping Address', icon: Truck },
    { value: 'payment', label: 'Payment Status', icon: CreditCard },
    { value: 'cancel', label: 'Cancel Order', icon: XCircle },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready_for_pickup', label: 'Ready for Pickup' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
  ];

  const renderUpdateFields = () => {
    switch (watchedUpdateType) {
      case 'status':
        return (
          <Select
            label="New Status"
            options={statusOptions}
            {...register('newValue')}
            error={errors.newValue?.message}
          />
        );

      case 'payment':
        return (
          <Select
            label="Payment Status"
            options={paymentStatusOptions}
            {...register('newValue')}
            error={errors.newValue?.message}
          />
        );

      case 'shipping':
        return (
          <div className="space-y-4">
            <Input
              label="Street Address"
              {...register('newValue.street')}
              placeholder="123 Main Street"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                {...register('newValue.city')}
                placeholder="New York"
              />
              <Input
                label="State"
                {...register('newValue.state')}
                placeholder="NY"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Postal Code"
                {...register('newValue.postalCode')}
                placeholder="10001"
              />
              <Input
                label="Country"
                {...register('newValue.country')}
                placeholder="US"
              />
            </div>
          </div>
        );

      case 'cancel':
        return (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <XCircle className="w-5 h-5 text-error-600" />
              <h3 className="font-medium text-error-800">Cancel Order</h3>
            </div>
            <p className="text-sm text-error-700">
              This action will cancel the order and cannot be undone. Please provide a reason for cancellation.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const onSubmit = async (data: UpdateFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare the update request
      let updateRequest: OrderUpdate = {
        orderId: data.orderId,
        updateType: data.updateType,
        newValue: data.newValue,
        reason: data.reason,
        notifyCustomer: data.notifyCustomer,
      };

      // Special handling for cancel type
      if (data.updateType === 'cancel') {
        updateRequest.newValue = 'cancelled';
      }

      const result = await OrderService.updateOrder(updateRequest);
      
      if (result.success) {
        setUpdateResult(result);
        onUpdateComplete?.(result);
      } else {
        setError(result.error?.message || 'Failed to update order');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (updateResult?.success) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Order Updated Successfully!
          </h2>
          <p className="text-neutral-600 mb-6">
            The order has been updated and the customer has been notified.
          </p>
          
          <div className="bg-neutral-50 rounded-lg p-6 mb-6 text-left">
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-neutral-700">Order ID:</span>
                <p className="text-neutral-900">{updateResult.data.orderId}</p>
              </div>
              <div>
                <span className="font-medium text-neutral-700">Previous Value:</span>
                <p className="text-neutral-900">
                  {typeof updateResult.data.previousValue === 'object' 
                    ? JSON.stringify(updateResult.data.previousValue)
                    : updateResult.data.previousValue}
                </p>
              </div>
              <div>
                <span className="font-medium text-neutral-700">New Value:</span>
                <p className="text-neutral-900">
                  {typeof updateResult.data.newValue === 'object' 
                    ? JSON.stringify(updateResult.data.newValue)
                    : updateResult.data.newValue}
                </p>
              </div>
              <div>
                <span className="font-medium text-neutral-700">Updated At:</span>
                <p className="text-neutral-900">
                  {new Date(updateResult.data.updateTimestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 justify-center">
            <Button onClick={() => reset()}>
              Make Another Update
            </Button>
            <Button onClick={() => window.location.href = `/orders/${updateResult.data.orderId}`}>
              View Order Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-2">
          Update Order
        </h1>
        <p className="text-neutral-600">
          Make changes to an existing order
        </p>
      </div>

      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-error-600 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-error-800">Error Updating Order</h3>
            <p className="text-sm text-error-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Order ID */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Edit className="w-5 h-5" />
              <span>Order Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              label="Order ID"
              {...register('orderId')}
              error={errors.orderId?.message}
              placeholder="Enter order ID"
              disabled={!!orderId}
            />
          </CardContent>
        </Card>

        {/* Update Type */}
        <Card>
          <CardHeader>
            <CardTitle>Update Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {updateTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <label
                    key={type.value}
                    className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      watchedUpdateType === type.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={type.value}
                      {...register('updateType')}
                      className="sr-only"
                    />
                    <Icon className={`w-5 h-5 ${
                      watchedUpdateType === type.value ? 'text-primary-600' : 'text-neutral-400'
                    }`} />
                    <span className={`font-medium ${
                      watchedUpdateType === type.value ? 'text-primary-900' : 'text-neutral-700'
                    }`}>
                      {type.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Update Fields */}
        <Card>
          <CardHeader>
            <CardTitle>Update Details</CardTitle>
          </CardHeader>
          <CardContent>
            {renderUpdateFields()}
          </CardContent>
        </Card>

        {/* Reason */}
        <Card>
          <CardHeader>
            <CardTitle>Reason for Update</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              {...register('reason')}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              placeholder="Provide a reason for this update (optional)"
            />
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('notifyCustomer')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              />
              <span className="text-sm font-medium text-neutral-700">
                Notify customer about this update
              </span>
            </label>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button type="button" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            loading={isSubmitting}
          >
            {watchedUpdateType === 'cancel' ? 'Cancel Order' : 'Update Order'}
          </Button>
        </div>
      </form>
    </div>
  );
}