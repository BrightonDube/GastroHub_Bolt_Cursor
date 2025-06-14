import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { OrderProcessingTracker } from '../../components/orders/OrderProcessingTracker';
import { Button } from '../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export function OrderProcessingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleProcessingComplete = (result: any) => {
    if (result.success) {
      // Optionally navigate to order details or show success message
      console.log('Processing completed successfully:', result);
    }
  };

  if (!id) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Order ID Required
          </h1>
          <p className="text-neutral-600 mb-6">
            Please provide a valid order ID to track processing.
          </p>
          <Button onClick={() => navigate('/orders')}>
            Back to Orders
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/orders')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </div>

        {/* Processing Tracker */}
        <OrderProcessingTracker
          orderId={id}
          autoRefresh={true}
          onProcessingComplete={handleProcessingComplete}
        />
      </div>
    </DashboardLayout>
  );
}

export default OrderProcessingPage;