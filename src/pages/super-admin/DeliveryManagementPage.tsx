import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { 
  useDeliveryStats, 
  useAvailableOrdersForDelivery, 
  useDeliveryZones
} from '../../hooks/useDeliveryStats';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CurrencyDisplay } from '../../components/ui/CurrencyDisplay';
import { DateDisplay } from '../../components/ui/DateDisplay';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { 
  Truck,
  MapPin,
  Package,
  Clock,
  DollarSign,
  Star,
  Users,
  Route,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Settings,
  Navigation,
  Phone,
  Calendar
} from 'lucide-react';

interface DeliveryPartner {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  activeOrders: number;
  totalDeliveries: number;
  avgRating: number;
  isAvailable: boolean;
}

export function DeliveryManagementPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: stats, isLoading: statsLoading } = useDeliveryStats();
  const { data: availableOrders, isLoading: ordersLoading } = useAvailableOrdersForDelivery();
  const { data: deliveryZones, isLoading: zonesLoading } = useDeliveryZones();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);

  // Get all delivery partners
  const { data: deliveryPartners, isLoading: partnersLoading } = useQuery({
    queryKey: ['delivery-partners'],
    queryFn: async () => {
      const { data: partners, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone, email')
        .eq('role', 'delivery_partner');

      if (error) throw error;

      // Get active orders count and stats for each partner
      const partnersWithStats = await Promise.all(
        (partners || []).map(async (partner) => {
          const { count: activeOrders } = await supabase
            .from('order')
            .select('*', { count: 'exact', head: true })
            .eq('delivery_partner_id', partner.id)
            .in('status', ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT']);

          const { count: totalDeliveries } = await supabase
            .from('order')
            .select('*', { count: 'exact', head: true })
            .eq('delivery_partner_id', partner.id)
            .eq('status', 'DELIVERED');

          const { data: ratings } = await supabase
            .from('delivery_ratings')
            .select('rating')
            .eq('delivery_partner_id', partner.id);

          const avgRating = ratings && ratings.length > 0 
            ? ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length 
            : 0;

          return {
            ...partner,
            activeOrders: activeOrders || 0,
            totalDeliveries: totalDeliveries || 0,
            avgRating: Number(avgRating.toFixed(1)),
            isAvailable: (activeOrders || 0) < 5, // Assume max 5 concurrent orders
          };
        })
      );

      return partnersWithStats;
    },
    staleTime: 2 * 60 * 1000,
  });

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (!user || user.role !== 'super_admin') {
    return (
      <DashboardLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-neutral-700">You must be a super admin to access this page.</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleAssignOrder = async (orderId: string, partnerId: string) => {
    try {
      const { error } = await supabase
        .from('order')
        .update({
          delivery_partner_id: partnerId,
          status: 'ASSIGNED',
          assigned_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) throw error;

      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Error assigning order:', error);
      alert('Failed to assign order. Please try again.');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Delivery Management</h1>
            <p className="text-neutral-700">Manage delivery partners and order assignments</p>
          </div>
          <Button className="bg-blue-600 text-white">
            <Settings className="w-4 h-4 mr-2" />
            Delivery Settings
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600">Active Drivers</p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? '--' : stats?.activeDrivers || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600">Deliveries Today</p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? '--' : stats?.deliveriesToday || 0}
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
                    {statsLoading ? '--' : `${stats?.avgRating || 0}/5`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600">On-Time Rate</p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? '--' : `${stats?.onTimeRate || 0}%`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Awaiting Assignment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <span>Orders Awaiting Assignment</span>
              <Badge color="orange">{availableOrders?.length || 0}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : availableOrders && availableOrders.length > 0 ? (
              <div className="space-y-4">
                {availableOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Package className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-neutral-600">
                            {order.buyer?.full_name} ← {order.supplier?.full_name}
                          </p>
                        </div>
                      </div>
                      <Badge color="orange">{order.status.replace('_', ' ')}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-neutral-500" />
                        <div>
                          <p className="font-medium">Order Value</p>
                          <p className="text-neutral-600">
                            <CurrencyDisplay amount={order.total_amount || 0} />
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-neutral-500" />
                        <div>
                          <p className="font-medium">Created</p>
                          <p className="text-neutral-600">
                            <DateDisplay date={order.created_at} />
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-neutral-500" />
                        <div>
                          <p className="font-medium">Contact</p>
                          <p className="text-neutral-600">
                            {order.buyer?.phone || 'No phone'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-neutral-600">
                          Items: {order.order_items?.length || 0}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedOrder(order.id)}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          className="bg-blue-600 text-white"
                          onClick={() => {
                            setSelectedOrder(order.id);
                            // Would open assignment modal
                          }}
                        >
                          Assign Driver
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-neutral-600">All orders have been assigned</p>
                <p className="text-sm text-neutral-500">New orders will appear here automatically</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delivery Partners */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="w-5 h-5" />
              <span>Delivery Partners</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {partnersLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : deliveryPartners && deliveryPartners.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deliveryPartners.map((partner) => (
                  <div key={partner.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          partner.isAvailable ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <p className="font-medium">{partner.full_name}</p>
                          <p className="text-sm text-neutral-600">{partner.phone}</p>
                        </div>
                      </div>
                      <Badge color={partner.isAvailable ? 'green' : 'red'}>
                        {partner.isAvailable ? 'Available' : 'Busy'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div>
                        <p className="text-neutral-600">Active</p>
                        <p className="font-medium">{partner.activeOrders}</p>
                      </div>
                      <div>
                        <p className="text-neutral-600">Total</p>
                        <p className="font-medium">{partner.totalDeliveries}</p>
                      </div>
                      <div>
                        <p className="text-neutral-600">Rating</p>
                        <p className="font-medium">{partner.avgRating}/5</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        View Details
                      </Button>
                      {partner.isAvailable && selectedOrder && (
                        <Button
                          size="sm"
                          className="bg-green-600 text-white flex-1"
                          onClick={() => {
                            if (selectedOrder) {
                              handleAssignOrder(selectedOrder, partner.id);
                            }
                          }}
                        >
                          Assign
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600">No delivery partners found</p>
                <p className="text-sm text-neutral-500">Add delivery partners to start managing deliveries</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delivery Zones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Delivery Zones</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {zonesLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : deliveryZones && deliveryZones.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deliveryZones.map((zone) => (
                  <div key={zone.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{zone.zone_name}</h4>
                      <Badge color="blue">Active</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-neutral-600">Base Fee</p>
                        <p className="font-medium">
                          <CurrencyDisplay amount={zone.base_delivery_fee || 0} />
                        </p>
                      </div>
                      <div>
                        <p className="text-neutral-600">Est. Hours</p>
                        <p className="font-medium">{zone.estimated_delivery_hours || 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-neutral-600 text-xs">Cities</p>
                      <p className="text-sm">{zone.cities?.join(', ') || 'No cities listed'}</p>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      Edit Zone
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Route className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600">No delivery zones configured</p>
                <Button className="mt-2">Add Delivery Zone</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default DeliveryManagementPage; 