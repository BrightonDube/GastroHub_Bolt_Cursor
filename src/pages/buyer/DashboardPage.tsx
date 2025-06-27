import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { DashboardStats } from '../../components/dashboard/DashboardStats';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CurrencyDisplay } from '../../components/ui/CurrencyDisplay';
import { DateDisplay } from '../../components/ui/DateDisplay';
import { useLocalization } from '../../context/LocalizationProvider';
import { 
  ShoppingCart, 
  Users, 
  DollarSign,
  Clock,
  Search,
  Eye,
  Plus,
  Star
} from 'lucide-react';

import { useBuyerDashboardStats } from '../../hooks/useDashboardStats';

export function BuyerDashboard() {
  console.log('[BuyerDashboard] Render');
  // Fetch all dashboard data from backend
  const { data, isLoading, error } = useBuyerDashboardStats();
  const { isZARMode } = useLocalization();

  // Defensive null checks
  const stats = data?.stats || [];
  const recentOrders = data?.recentOrders || [];
  const favoriteSuppliers = data?.favoriteSuppliers || [];

  const getOrderStatusColor = (status: string) => {
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
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Buyer Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover suppliers and manage your orders.
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Button variant="default" size="sm">
              <Search className="w-6 h-6 text-primary-600 mr-2" />
              Browse Marketplace
            </Button>
            <Button variant="solid" size="sm">
              <Plus className="w-6 h-6 text-primary-600 mr-2" />
              New Order
            </Button>
          </div>
        </div>

        {/* Loading/Error States */}
        {isLoading && <div>Loading dashboard...</div>}
        {error && <div className="text-red-500">Error loading dashboard: {error.message}</div>}

        {/* Stats */}
        {!isLoading && !error && <DashboardStats stats={stats} />}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.length === 0 && <div className="text-muted-foreground">No recent orders.</div>}
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-card rounded-xl">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-foreground">{order.id}</span>
                        <Badge variant={getOrderStatusColor(order.status) as any} size="sm">
                          {order.status?.replace('_', ' ') || 'unknown'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">Supplier: {order.supplier_id}</p>
                      <p className="text-xs text-muted-foreground">
                        Amount: <CurrencyDisplay 
                          amount={parseFloat(order.amount) || 0} 
                          showBothCurrencies={isZARMode}
                        />
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Date: <DateDisplay date={order.created_at} format="short" />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Button variant="ghost" className="w-full">
                  View All Orders
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Favorite Suppliers */}
          <Card>
            <CardHeader>
              <CardTitle>Favorite Suppliers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {favoriteSuppliers.length === 0 && <div className="text-muted-foreground">No favorite suppliers.</div>}
                {favoriteSuppliers.map((supplier: any) => (
                  <div key={supplier.id} className="flex items-center justify-between p-4 bg-card rounded-xl">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-foreground">{supplier.business_name}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-6 h-6 text-primary-600 text-secondary-400 fill-current" />
                          <span className="text-sm text-muted-foreground">{supplier.rating ?? '-'}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{supplier.category}</p>
                    </div>
                    <div className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-6 h-6 text-primary-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Button variant="ghost" className="w-full">
                  Find More Suppliers
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default BuyerDashboard;