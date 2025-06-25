import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { CreateOrderForm } from '../../components/orders/CreateOrderForm';
import { Button } from '../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export function CreateOrderPage() {
  const navigate = useNavigate();

  const handleOrderCreated = (orderId: string) => {
    // Navigate to order details page after successful creation
    navigate(`/orders/${orderId}`);
  };

  const handleCancel = () => {
    navigate('/orders');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/orders')}
            className="neon-button"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </div>

        {/* Form */}
        <CreateOrderForm
          onOrderCreated={handleOrderCreated}
          onCancel={handleCancel}
        />
      </div>
    </DashboardLayout>
  );
}

export default CreateOrderPage;