import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { OrderUpdateForm } from '../../components/orders/OrderUpdateForm';
import { Button } from '../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export function OrderUpdatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleUpdateComplete = (result: any) => {
    if (result.success) {
      // Navigate back to order details
      navigate(`/orders/${id}`);
    }
  };

  const handleCancel = () => {
    navigate(id ? `/orders/${id}` : '/orders');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(id ? `/orders/${id}` : '/orders')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {id ? 'Order Details' : 'Orders'}
          </Button>
        </div>

        {/* Update Form */}
        <OrderUpdateForm
          orderId={id}
          onUpdateComplete={handleUpdateComplete}
          onCancel={handleCancel}
        />
      </div>
    </DashboardLayout>
  );
}

export default OrderUpdatePage;