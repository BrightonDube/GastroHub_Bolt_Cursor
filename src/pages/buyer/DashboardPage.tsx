import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { DashboardStats } from '../../components/dashboard/DashboardStats';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CurrencyDisplay } from '../../components/ui/CurrencyDisplay';
import { DateDisplay } from '../../components/ui/DateDisplay';
import { 
  ShoppingCart, 
  Users, 
  DollarSign,
  Clock,
  Search,
  Eye,
  Plus,
  Star,
  Heart,
  Package,
  TrendingUp,
  MapPin,
  Filter
} from 'lucide-react';

import { useBuyerDashboardStats } from '../../hooks/useDashboardStats';
import { Link } from 'react-router-dom';

export function BuyerDashboard() {
  console.log('[BuyerDashboard] Render');
  // Fetch all dashboard data from backend
  const { data, isLoading, error } = useBuyerDashboardStats();

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

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Package className="w-4 h-4" />;
      case 'in_transit':
        return <Clock className="w-4 h-4" />;
      case 'preparing':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
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
              Discover suppliers and manage your orders with ease.
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Link to="/marketplace">
              <Button variant="default" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Browse Marketplace
              </Button>
            </Link>
            <Link to="/orders/create">
              <Button variant="solid" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Order
              </Button>
            </Link>
          </div>
        </div>

        {/* Loading/Error States */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800">Error loading dashboard: {error.message}</div>
          </div>
        )}

        {/* Enhanced Stats */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      stat.color === 'primary' ? 'bg-blue-100' :
                      stat.color === 'success' ? 'bg-green-100' :
                      stat.color === 'secondary' ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                      {stat.title === 'Total Orders' && <ShoppingCart className="w-6 h-6 text-blue-600" />}
                      {stat.title === 'Total Spent' && <DollarSign className="w-6 h-6 text-green-600" />}
                      {stat.title === 'Completed Deliveries' && <Package className="w-6 h-6 text-purple-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-600">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Recent Orders</span>
                </div>
                <Button variant="ghost" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                    <div className="text-muted-foreground">No recent orders.</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Start shopping to see your orders here.
                    </p>
                    <Link to="/marketplace">
                      <Button variant="default" size="sm" className="mt-3">
                        <Search className="w-4 h-4 mr-2" />
                        Browse Products
                      </Button>
                    </Link>
                  </div>
                ) : (
                  recentOrders.map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-card rounded-xl border hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-foreground">#{order.id?.slice(0, 8) || 'N/A'}</span>
                          <Badge variant={getOrderStatusColor(order.status) as any} size="sm">
                            <span className="flex items-center space-x-1">
                              {getOrderStatusIcon(order.status)}
                              <span>{order.status?.replace('_', ' ') || 'unknown'}</span>
                            </span>
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Supplier: {order.supplier_id || 'Unknown'}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>
                            Amount: <CurrencyDisplay 
                              amount={parseFloat(order.amount) || 0}
                            />
                          </span>
                          <span>
                            <DateDisplay date={order.created_at} format="short" />
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Link to="/orders">
                  <Button variant="ghost" className="w-full">
                    View All Orders
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Favorite Suppliers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Favorite Suppliers</span>
                </div>
                <Button variant="ghost" size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {favoriteSuppliers.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                    <div className="text-muted-foreground">No favorite suppliers yet.</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Discover and save your preferred suppliers.
                    </p>
                    <Link to="/marketplace">
                      <Button variant="default" size="sm" className="mt-3">
                        <Search className="w-4 h-4 mr-2" />
                        Find Suppliers
                      </Button>
                    </Link>
                  </div>
                ) : (
                  favoriteSuppliers.map((supplier: any) => (
                    <div key={supplier.id} className="flex items-center justify-between p-4 bg-card rounded-xl border hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-foreground">
                            {supplier.business_name || 'Unnamed Supplier'}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-muted-foreground">
                              {supplier.rating ?? '-'}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {supplier.category || 'General'}
                        </p>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>Local supplier</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Link to="/suppliers">
                  <Button variant="ghost" className="w-full">
                    <Search className="w-4 h-4 mr-2" />
                    Find More Suppliers
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <Link to="/marketplace">
                  <Button variant="ghost" className="justify-start h-12 w-full">
                    <Search className="w-5 h-5 mr-3" />
                    Browse Marketplace
                  </Button>
                </Link>
                <Link to="/orders/create">
                  <Button variant="ghost" className="justify-start h-12 w-full">
                    <Plus className="w-5 h-5 mr-3" />
                    Create New Order
                  </Button>
                </Link>
                <Link to="/orders">
                  <Button variant="ghost" className="justify-start h-12 w-full">
                    <Package className="w-5 h-5 mr-3" />
                    Track Orders
                  </Button>
                </Link>
                <Link to="/messaging">
                  <Button variant="ghost" className="justify-start h-12 w-full">
                    <Users className="w-5 h-5 mr-3" />
                    Contact Suppliers
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Shopping Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Shopping Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-1">💡 Best Deals</h4>
                  <p className="text-sm text-blue-700">
                    Check out our featured suppliers for the best prices and quality.
                  </p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-1">🚚 Free Delivery</h4>
                  <p className="text-sm text-green-700">
                    Many suppliers offer free delivery on orders over a certain amount.
                  </p>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-1">⭐ Reviews</h4>
                  <p className="text-sm text-purple-700">
                    Check supplier ratings and reviews before placing orders.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default BuyerDashboard;