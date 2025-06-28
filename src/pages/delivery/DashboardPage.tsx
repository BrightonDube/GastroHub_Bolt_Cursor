import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { useDeliveryPartnerOrders, useDeliveryPartnerAnalytics } from '../../hooks/useDeliveryStats';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CurrencyDisplay } from '../../components/ui/CurrencyDisplay';
import { 
  Package,
  MapPin,
  Clock,
  DollarSign,
  Star,
  TrendingUp,
  CheckCircle,
  Truck,
  Navigation,
  Phone
} from 'lucide-react';

export function DeliveryDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { data: orders, isLoading: ordersLoading } = useDeliveryPartnerOrders(user?.id);
  const { data: analytics, isLoading: analyticsLoading } = useDeliveryPartnerAnalytics(user?.id);

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (!user || user.role !== 'delivery_partner') {
    return (
      <DashboardLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-neutral-700">You must be a delivery partner to access this page.</p>
        </div>
      </DashboardLayout>
    );
  }

  const activeOrders = orders?.filter(order => ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'].includes(order.status)) || [];
  const pendingOrders = orders?.filter(order => order.status === 'READY_FOR_PICKUP') || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ASSIGNED': return 'blue';
      case 'PICKED_UP': return 'orange';
      case 'IN_TRANSIT': return 'purple';
      case 'DELIVERED': return 'green';
      case 'READY_FOR_PICKUP': return 'yellow';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ASSIGNED': return <Clock className="w-4 h-4" />;
      case 'PICKED_UP': return <Package className="w-4 h-4" />;
      case 'IN_TRANSIT': return <Truck className="w-4 h-4" />;
      case 'DELIVERED': return <CheckCircle className="w-4 h-4" />;
      case 'READY_FOR_PICKUP': return <Navigation className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Delivery Partner Dashboard</h1>
          <p className="text-neutral-700">Welcome back, {user.full_name || 'Delivery Partner'}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600">Active Orders</p>
                  <p className="text-2xl font-bold">{activeOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600">Total Earnings</p>
                  <p className="text-2xl font-bold">
                    {analyticsLoading ? '--' : <CurrencyDisplay amount={analytics?.totalEarnings || 0} />}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600">Average Rating</p>
                  <p className="text-2xl font-bold">
                    {analyticsLoading ? '--' : `${analytics?.avgRating || 0}/5`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600">On-Time Rate</p>
                  <p className="text-2xl font-bold">
                    {analyticsLoading ? '--' : `${analytics?.onTimeRate || 0}%`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="w-5 h-5" />
              <span>Active Deliveries</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : activeOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600">No active deliveries</p>
                <p className="text-sm text-neutral-500">New orders will appear here when assigned</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-neutral-600">
                            {order.buyer?.full_name} • {order.supplier?.full_name}
                          </p>
                        </div>
                      </div>
                      <Badge color={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-neutral-500" />
                        <div>
                          <p className="font-medium">Pickup</p>
                          <p className="text-neutral-600">{order.pickup_address || 'Address not set'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-neutral-500" />
                        <div>
                          <p className="font-medium">Delivery</p>
                          <p className="text-neutral-600">{order.delivery_address || 'Address not set'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-neutral-500" />
                        <div>
                          <p className="font-medium">Fee</p>
                          <p className="text-neutral-600">
                            <CurrencyDisplay amount={order.delivery_fee || 0} />
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-600">
                        Buyer: {order.buyer?.phone || 'No phone'} | 
                        Supplier: {order.supplier?.phone || 'No phone'}
                      </span>
                    </div>

                    {order.delivery_notes && (
                      <div className="bg-neutral-50 p-3 rounded">
                        <p className="text-sm">
                          <span className="font-medium">Notes:</span> {order.delivery_notes}
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      {order.status === 'ASSIGNED' && (
                        <Button size="sm" className="bg-blue-600 text-white">
                          Mark as Picked Up
                        </Button>
                      )}
                      {order.status === 'PICKED_UP' && (
                        <Button size="sm" className="bg-purple-600 text-white">
                          Mark in Transit
                        </Button>
                      )}
                      {order.status === 'IN_TRANSIT' && (
                        <Button size="sm" className="bg-green-600 text-white">
                          Mark as Delivered
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Orders */}
        {pendingOrders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Navigation className="w-5 h-5" />
                <span>Available for Pickup</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Navigation className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-neutral-600">
                            {order.buyer?.full_name} • {order.supplier?.full_name}
                          </p>
                        </div>
                      </div>
                      <Badge color="yellow">Ready for Pickup</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-neutral-600">
                        Delivery fee: <CurrencyDisplay amount={order.delivery_fee || 0} />
                      </div>
                      <Button size="sm" className="bg-blue-600 text-white">
                        Accept Delivery
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

export default DeliveryDashboard;
