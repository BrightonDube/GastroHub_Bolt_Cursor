import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Truck,
  Users
} from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuth();

  // Fetch buyer dashboard stats from backend
  import { useBuyerDashboardStats } from '../hooks/useDashboardStats';
  const { data: buyerStats = [], isLoading: statsLoading } = useBuyerDashboardStats(user?.id);


  // Fetch supplier dashboard stats from backend
  import { useSupplierDashboardStats } from '../hooks/useDashboardStats';
  const { data: supplierStats = [], isLoading: supplierStatsLoading } = useSupplierDashboardStats(user?.id);

  // Fetch delivery partner dashboard stats from backend
  import { useDeliveryPartnerDashboardStats } from '../hooks/useDashboardStats';
  const { data: deliveryStats = [], isLoading: deliveryStatsLoading } = useDeliveryPartnerDashboardStats(user?.id);

  // Fetch recent orders from backend
  import { useRecentOrders } from '../hooks/useOrders';
  const { data: recentOrders = [], isLoading: recentOrdersLoading } = useRecentOrders(user?.id);

  const getStats = () => {
    switch (user?.role) {
      case 'buyer':
        return buyerStats;
      case 'supplier':
        return getSupplierStats();
      case 'delivery_partner':
        return getDeliveryPartnerStats();
      default:
        return [];
    }
  };

  const getWelcomeMessage = () => {
    const timeOfDay = new Date().getHours() < 12 ? 'morning' : 
                     new Date().getHours() < 18 ? 'afternoon' : 'evening';
    
    return `Good ${timeOfDay}, ${user?.profile.full_name || 'there'}!`;
  };

  const getQuickActions = () => {
    switch (user?.role) {
      case 'buyer':
        return [
          { label: 'Browse Marketplace', href: '/marketplace', icon: <ShoppingCart className="w-4 h-4" /> },
          { label: 'View Orders', href: '/orders', icon: <Eye className="w-4 h-4" /> },
          { label: 'Find Suppliers', href: '/suppliers', icon: <Users className="w-4 h-4" /> },
        ];
      case 'supplier':
        return [
          { label: 'Add New Listing', href: '/add-listing', icon: <Plus className="w-4 h-4" /> },
          { label: 'Manage Listings', href: '/my-listings', icon: <Package className="w-4 h-4" /> },
          { label: 'View Analytics', href: '/analytics', icon: <TrendingUp className="w-4 h-4" /> },
        ];
      case 'delivery_partner':
        return [
          { label: 'Available Deliveries', href: '/deliveries/available', icon: <Package className="w-4 h-4" /> },
          { label: 'My Deliveries', href: '/deliveries', icon: <Truck className="w-4 h-4" /> },
          { label: 'View Earnings', href: '/earnings', icon: <DollarSign className="w-4 h-4" /> },
        ];
      default:
        return [];
    }
  };

  const recentOrders = [
    {
      id: 'ORD-001',
      supplier: 'Fresh Valley Farms',
      items: 'Organic Tomatoes, Fresh Basil',
      amount: '$145.00',
      status: 'delivered',
      date: '2024-01-15',
    },
    {
      id: 'ORD-002',
      supplier: 'Ocean Breeze Seafood',
      items: 'Fresh Salmon, Shrimp',
      amount: '$320.00',
      status: 'in_transit',
      date: '2024-01-14',
    },
    {
      id: 'ORD-003',
      supplier: 'Golden Grain Co.',
      items: 'Premium Flour, Yeast',
      amount: '$89.50',
      status: 'preparing',
      date: '2024-01-13',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'in_transit':
        return 'primary';
      case 'preparing':
        return 'warning';
      case 'pending':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-neutral-900">
              {getWelcomeMessage()}
            </h1>
            <p className="text-neutral-600 mt-1">
              Here's what's happening with your {user?.role?.replace('_', ' ')} account today.
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            {getQuickActions().map((action, index) => (
              <Button
                key={index}
                variant={index === 0 ? 'primary' : 'outline'}
                size="sm"
                onClick={() => window.location.href = action.href}
              >
                {action.icon}
                <span className="ml-2 hidden sm:inline">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <DashboardStats stats={getStats()} />

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-neutral-900">{order.id}</span>
                        <Badge variant={getStatusColor(order.status) as any} size="sm">
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-600 mb-1">{order.supplier}</p>
                      <p className="text-xs text-neutral-500">{order.items}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-neutral-900">{order.amount}</p>
                      <p className="text-xs text-neutral-500">{order.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <Button variant="ghost" className="w-full">
                  View All Orders
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {getQuickActions().map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-12"
                    onClick={() => window.location.href = action.href}
                  >
                    {action.icon}
                    <span className="ml-3">{action.label}</span>
                  </Button>
                ))}
              </div>
              
              {/* Status Indicators */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <h4 className="font-medium text-neutral-900 mb-3">System Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Marketplace</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Payments</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2" style={{ background: 'var(--success-500)' }}></div>
                      <span className="text-xs" style={{ color: 'var(--success-600)' }}>Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Delivery Network</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2" style={{ background: 'var(--success-500)' }}></div>
                      <span className="text-xs" style={{ color: 'var(--success-600)' }}>Operational</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}