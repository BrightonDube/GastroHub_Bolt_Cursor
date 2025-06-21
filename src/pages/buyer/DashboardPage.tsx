import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { DashboardStats } from '../../components/dashboard/DashboardStats';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
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
  // Fetch buyer dashboard stats from backend
  const { data: stats = [], isLoading: statsLoading } = useBuyerDashboardStats();


  const favoriteSuppliers = [
    {
      id: '1',
      name: 'Fresh Valley Farms',
      category: 'Organic Produce',
      rating: 4.9,
      orders: 15,
      lastOrder: '2 days ago'
    },
    {
      id: '2',
      name: 'Ocean Breeze Seafood',
      category: 'Fresh Seafood',
      rating: 4.8,
      orders: 8,
      lastOrder: '1 week ago'
    },
    {
      id: '3',
      name: 'Golden Grain Co.',
      category: 'Bakery Supplies',
      rating: 4.7,
      orders: 12,
      lastOrder: '3 days ago'
    }
  ];

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
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Buyer Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover suppliers and manage your orders.
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <Search className="w-6 h-6 text-primary-600 mr-2" />
              Browse Marketplace
            </Button>
            <Button variant="primary" size="sm">
              <Plus className="w-6 h-6 text-primary-600 mr-2" />
              New Order
            </Button>
          </div>
        </div>

        {/* Stats */}
        <DashboardStats stats={stats} />

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-card rounded-xl">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-foreground">{order.id}</span>
                        <Badge variant={getStatusColor(order.status) as any} size="sm">
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{order.supplier}</p>
                      <p className="text-xs text-muted-foreground">{order.items}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{order.amount}</p>
                      <p className="text-xs text-muted-foreground">{order.date}</p>
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
                {favoriteSuppliers.map((supplier) => (
                  <div key={supplier.id} className="flex items-center justify-between p-4 bg-card rounded-xl">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-foreground">{supplier.name}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-6 h-6 text-primary-600 text-secondary-400 fill-current" />
                          <span className="text-sm text-muted-foreground">{supplier.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{supplier.category}</p>
                      <p className="text-xs text-muted-foreground">{supplier.orders} orders • Last: {supplier.lastOrder}</p>
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