import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrder, useUpdateOrderStatus } from '../../hooks/useOrders';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Truck,
  FileText,
  Download
} from 'lucide-react';
import { OrderStatus } from '../../types';

const statusFlow: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready_for_pickup', 'cancelled'],
  ready_for_pickup: ['out_for_delivery'],
  out_for_delivery: ['delivered'],
  delivered: [],
  cancelled: [],
};

export function OrderDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useOrder(id!);
  const updateStatusMutation = useUpdateOrderStatus();
  const [showConfirmDialog, setShowConfirmDialog] = useState<{
    action: OrderStatus;
    show: boolean;
  }>({ action: 'pending', show: false });

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!id) return;

    try {
      await updateStatusMutation.mutateAsync({
        orderId: id,
        status: newStatus,
      });
      setShowConfirmDialog({ action: 'pending', show: false });
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
      case 'preparing':
        return 'primary';
      case 'ready_for_pickup':
      case 'out_for_delivery':
        return 'secondary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'preparing':
        return <Package className="w-4 h-4" />;
      case 'ready_for_pickup':
      case 'out_for_delivery':
        return <Truck className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getActionLabel = (action: OrderStatus) => {
    switch (action) {
      case 'confirmed':
        return 'Approve Order';
      case 'preparing':
        return 'Start Preparing';
      case 'ready_for_pickup':
        return 'Mark as Ready';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Mark as Delivered';
      case 'cancelled':
        return 'Cancel Order';
      default:
        return action;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="lg" text="Loading order details..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !order) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <AlertTriangle className="w-16 h-16 text-error-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Order Not Found
          </h1>
          <p className="text-neutral-600 mb-6">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate('/supplier/orders')}>
            Back to Orders
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const availableActions = statusFlow[order.status] || [];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/supplier/orders')}
              variant="ghost"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
            <div>
              <h1 className="text-3xl font-heading font-bold text-neutral-900">
                Order #{order.id.slice(0, 8)}
              </h1>
              <p className="text-neutral-600 mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant={getStatusColor(order.status) as any} className="flex items-center space-x-1">
              {getStatusIcon(order.status)}
              <span>{order.status.replace('_', ' ')}</span>
            </Badge>
            <Button variant="solid">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.order_items?.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-lg">
                      <img
                        src={item.product?.images?.[0] || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100'}
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900">{item.product?.name}</h3>
                        <p className="text-sm text-neutral-600">
                          Quantity: {item.quantity} {item.product?.unit}
                        </p>
                        <p className="text-sm text-neutral-600">
                          Unit Price: ${Number(item.unit_price).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-neutral-900">
                          ${Number(item.total_price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-neutral-900">Total Amount</span>
                    <span className="text-2xl font-bold text-primary-900">
                      ${Number(order.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">Payment Method</p>
                    <p className="text-neutral-900">{order.payment_method}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-600">Payment Status</p>
                    <Badge variant={order.payment_status === 'paid' ? 'success' : 'warning'}>
                      {order.payment_status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-600">Subtotal</p>
                    <p className="text-neutral-900">${Number(order.total_amount).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-600">Delivery Fee</p>
                    <p className="text-neutral-900">${Number(order.delivery_fee || 0).toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Customer Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {order.buyer?.first_name} {order.buyer?.last_name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-neutral-600">
                    <Mail className="w-4 h-4" />
                    <span>{order.buyer?.email}</span>
                  </div>
                  {order.buyer?.phone && (
                    <div className="flex items-center space-x-2 text-sm text-neutral-600">
                      <Phone className="w-4 h-4" />
                      <span>{order.buyer.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Delivery Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">Delivery Address</p>
                    <p className="text-neutral-900">
                      {typeof order.delivery_address === 'string' 
                        ? order.delivery_address 
                        : JSON.stringify(order.delivery_address)
                      }
                    </p>
                  </div>
                  {order.special_instructions && (
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Special Instructions</p>
                      <p className="text-neutral-900">{order.special_instructions}</p>
                    </div>
                  )}
                  {order.estimated_delivery_time && (
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Estimated Delivery</p>
                      <p className="text-neutral-900">
                        {new Date(order.estimated_delivery_time).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {availableActions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {availableActions.map((action) => (
                      <Button
                        key={action}
                        className="w-full"
                        onClick={() => setShowConfirmDialog({ action, show: true })}
                        loading={updateStatusMutation.isPending}
                      >
                        {getActionLabel(action)}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmDialog.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Confirm Action
              </h3>
              <p className="text-neutral-600 mb-6">
                Are you sure you want to {getActionLabel(showConfirmDialog.action).toLowerCase()}? 
                This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowConfirmDialog({ action: 'pending', show: false })}
                >
                  Cancel
                </Button>
                <Button
                  variant={showConfirmDialog.action === 'cancelled' ? 'danger' : 'primary'}
                  className="flex-1"
                  onClick={() => handleStatusUpdate(showConfirmDialog.action)}
                  loading={updateStatusMutation.isPending}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default OrderDetailPage;