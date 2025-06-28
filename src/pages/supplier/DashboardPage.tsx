import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CurrencyDisplay } from '../../components/ui/CurrencyDisplay';
import { DateDisplay } from '../../components/ui/DateDisplay';
import { 
  Store, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  Package,
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  Globe,
  Settings,
  MessageSquare,
  MapPin,
  Star
} from 'lucide-react';

import { useSupplierDashboardStats } from '../../hooks/useSupplierDashboardStats';
import { Link } from 'react-router-dom';

export function SupplierDashboard() {
  console.log('[SupplierDashboard] Render');
  
  // Fetch supplier dashboard data
  const { data, isLoading, error } = useSupplierDashboardStats();

  // Defensive null checks
  const stats = data?.stats || [];
  const recentListings = data?.recentListings || [];

  const getListingStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'secondary';
      case 'out_of_stock':
        return 'warning';
      case 'draft':
        return 'default';
      default:
        return 'default';
    }
  };

  const getListingStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'inactive':
        return <Clock className="w-4 h-4" />;
      case 'out_of_stock':
        return <AlertTriangle className="w-4 h-4" />;
      case 'draft':
        return <Edit className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Supplier Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your inventory, orders, and grow your business.
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <Link to="/marketplace">
              <Button variant="default" size="sm">
                <Globe className="w-4 h-4 mr-2" />
                View Marketplace
              </Button>
            </Link>
            <Link to="/supplier/new-listing">
              <Button variant="solid" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Loading/Error States */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      stat.color === 'primary' ? 'bg-blue-100' :
                      stat.color === 'success' ? 'bg-green-100' :
                      stat.color === 'secondary' ? 'bg-purple-100' :
                      stat.color === 'warning' ? 'bg-orange-100' : 'bg-gray-100'
                    }`}>
                      {stat.title === 'Total Listings' && <Store className="w-6 h-6 text-blue-600" />}
                      {stat.title === 'Total Orders' && <ShoppingCart className="w-6 h-6 text-purple-600" />}
                      {stat.title === 'Total Revenue' && <DollarSign className="w-6 h-6 text-green-600" />}
                      {stat.title === 'Completed Deliveries' && <Package className="w-6 h-6 text-orange-600" />}
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
          {/* Recent Listings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Store className="w-5 h-5" />
                  <span>Recent Listings</span>
                </div>
                <Link to="/supplier/new-listing">
                  <Button variant="ghost" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentListings.length === 0 ? (
                  <div className="text-center py-8">
                    <Store className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                    <div className="text-muted-foreground">No listings yet.</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Start by adding your first product to the marketplace.
                    </p>
                    <Link to="/supplier/new-listing">
                      <Button variant="default" size="sm" className="mt-3">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                      </Button>
                    </Link>
                  </div>
                ) : (
                  recentListings.map((listing: any) => (
                    <div key={listing.id} className="flex items-center justify-between p-4 bg-card rounded-xl border hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-foreground">
                            {listing.name || listing.title || 'Unnamed Product'}
                          </span>
                          <Badge variant={getListingStatusColor(listing.status) as any} size="sm">
                            <span className="flex items-center space-x-1">
                              {getListingStatusIcon(listing.status)}
                              <span>{listing.status?.replace('_', ' ') || 'active'}</span>
                            </span>
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Category: {listing.category || 'General'}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>
                            Price: <CurrencyDisplay 
                              amount={parseFloat(listing.price) || 0}
                            />
                          </span>
                          <span>
                            <DateDisplay date={listing.created_at} format="short" />
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link to={`/supplier/listings/${listing.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Link to="/supplier/listings">
                  <Button variant="ghost" className="w-full">
                    View All Listings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Incoming Orders</span>
                </div>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <div className="text-muted-foreground">No new orders.</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Orders from buyers will appear here.
                  </p>
                  <Link to="/supplier/orders">
                    <Button variant="default" size="sm" className="mt-3">
                      <Eye className="w-4 h-4 mr-2" />
                      View Order History
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Link to="/supplier/orders">
                  <Button variant="ghost" className="w-full">
                    View All Orders
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Insights & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Business Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Business Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-green-800">Revenue This Month</h4>
                      <p className="text-2xl font-bold text-green-600">
                        <CurrencyDisplay amount={0} />
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-blue-800">Active Products</h4>
                      <p className="text-2xl font-bold text-blue-600">
                        {recentListings.filter(l => l.status === 'active').length}
                      </p>
                    </div>
                    <Store className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-purple-800">Customer Rating</h4>
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="text-2xl font-bold text-purple-600">4.8</span>
                      </div>
                    </div>
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
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
                <Link to="/supplier/new-listing">
                  <Button variant="ghost" className="justify-start h-12 w-full">
                    <Plus className="w-5 h-5 mr-3" />
                    Add New Product
                  </Button>
                </Link>
                <Link to="/supplier/listings">
                  <Button variant="ghost" className="justify-start h-12 w-full">
                    <Store className="w-5 h-5 mr-3" />
                    Manage Inventory
                  </Button>
                </Link>
                <Link to="/supplier/orders">
                  <Button variant="ghost" className="justify-start h-12 w-full">
                    <ShoppingCart className="w-5 h-5 mr-3" />
                    Process Orders
                  </Button>
                </Link>
                <Link to="/messaging">
                  <Button variant="ghost" className="justify-start h-12 w-full">
                    <MessageSquare className="w-5 h-5 mr-3" />
                    Customer Messages
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button variant="ghost" className="justify-start h-12 w-full">
                    <Globe className="w-5 h-5 mr-3" />
                    View Marketplace
                  </Button>
                </Link>
                <Button variant="ghost" className="justify-start h-12 w-full">
                  <BarChart3 className="w-5 h-5 mr-3" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <span>Inventory Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-muted-foreground text-sm">
                  No low stock alerts at the moment.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span>Growth Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 text-sm mb-1">💡 Optimize Listings</h4>
                  <p className="text-xs text-blue-700">
                    Add high-quality images and detailed descriptions to attract more buyers.
                  </p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 text-sm mb-1">🚀 Expand Range</h4>
                  <p className="text-xs text-green-700">
                    Consider adding complementary products to increase order value.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-purple-500" />
                <span>Delivery Zones</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm text-green-800">Local Area</span>
                  <Badge variant="success" size="sm">Active</Badge>
                </div>
                <Button variant="ghost" size="sm" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Zones
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