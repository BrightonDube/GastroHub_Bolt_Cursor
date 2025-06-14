import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { DashboardStats } from '../../components/dashboard/DashboardStats';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Package, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react';

export function SupplierDashboard() {
  const stats = [
    {
      title: 'Active Listings',
      value: '156',
      change: { value: 8, type: 'increase' as const },
      icon: <Package className="w-6 h-6" />,
      color: 'primary' as const,
    },
    {
      title: 'Total Orders',
      value: '89',
      change: { value: 15, type: 'increase' as const },
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'secondary' as const,
    },
    {
      title: 'Monthly Revenue',
      value: '$28,750',
      change: { value: 22, type: 'increase' as const },
      icon: <DollarSign className="w-6 h-6" />,
      color: 'success' as const,
    },
    {
      title: 'Growth Rate',
      value: '12.5%',
      change: { value: 3, type: 'increase' as const },
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'warning' as const,
    },
  ];

  const recentListings = [
    {
      id: '1',
      name: 'Organic Tomatoes',
      category: 'Fresh Produce',
      price: '$4.50/kg',
      status: 'active',
      orders: 12
    },
    {
      id: '2',
      name: 'Fresh Salmon Fillets',
      category: 'Seafood',
      price: '$18.00/kg',
      status: 'active',
      orders: 8
    },
    {
      id: '3',
      name: 'Premium Olive Oil',
      category: 'Pantry Staples',
      price: '$12.00/bottle',
      status: 'low_stock',
      orders: 5
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'low_stock':
        return 'warning';
      case 'out_of_stock':
        return 'error';
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
              Supplier Dashboard
            </h1>
            <p className="text-neutral-600 mt-1">
              Manage your listings and track your business performance.
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Listing
            </Button>
          </div>
        </div>

        {/* Stats */}
        <DashboardStats stats={stats} />

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Listings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentListings.map((listing) => (
                  <div key={listing.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-neutral-900">{listing.name}</span>
                        <Badge variant={getStatusColor(listing.status) as any} size="sm">
                          {listing.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-600 mb-1">{listing.category}</p>
                      <p className="text-xs text-neutral-500">{listing.orders} orders this month</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-neutral-900">{listing.price}</p>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <Button variant="ghost" className="w-full">
                  View All Listings
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
                <Button variant="outline" className="justify-start h-12">
                  <Plus className="w-4 h-4 mr-3" />
                  Create New Listing
                </Button>
                <Button variant="outline" className="justify-start h-12">
                  <Package className="w-4 h-4 mr-3" />
                  Manage Inventory
                </Button>
                <Button variant="outline" className="justify-start h-12">
                  <ShoppingCart className="w-4 h-4 mr-3" />
                  View Orders
                </Button>
                <Button variant="outline" className="justify-start h-12">
                  <TrendingUp className="w-4 h-4 mr-3" />
                  Analytics & Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SupplierDashboard;