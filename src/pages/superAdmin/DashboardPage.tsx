import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CurrencyDisplay } from '../../components/ui/CurrencyDisplay';
import { DateDisplay } from '../../components/ui/DateDisplay';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { 
  Users, 
  Store, 
  ShoppingCart, 
  Truck,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Eye,
  Settings,
  UserPlus,
  BarChart3,
  Globe,
  MessageSquare,
  Bell
} from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

// Super Admin Stats Hook
function useSuperAdminStats() {
  return useQuery({
    queryKey: ['super-admin-stats'],
    queryFn: async () => {
      // Get total users by role
      const { data: profiles } = await supabase
        .from('profiles')
        .select('role, created_at, id');

      const totalUsers = profiles?.length || 0;
      const buyers = profiles?.filter(p => p.role === 'buyer').length || 0;
      const suppliers = profiles?.filter(p => p.role === 'supplier').length || 0;
      const deliveryPartners = profiles?.filter(p => p.role === 'delivery_partner').length || 0;

      // Get total listings
      const { count: totalListings } = await supabase
        .from('listing')
        .select('*', { count: 'exact', head: true });

      // Get total orders and revenue
      const { data: orders } = await supabase
        .from('order')
        .select('total_amount, status, created_at');

      const totalOrders = orders?.length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) || 0;
      const completedOrders = orders?.filter(order => order.status === 'delivered').length || 0;

      // Get recent activity (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentUsers = profiles?.filter(p => new Date(p.created_at) > thirtyDaysAgo).length || 0;
      const recentOrders = orders?.filter(o => new Date(o.created_at) > thirtyDaysAgo).length || 0;

      // Get notifications
      const { data: notifications } = await supabase
        .from('notification')
        .select('*')
        .eq('read', false)
        .order('created_at', { ascending: false })
        .limit(5);

      // Get recent orders with details
      const { data: recentOrdersDetailed } = await supabase
        .from('order')
        .select(`
          id,
          status,
          total_amount,
          created_at,
          buyer:profiles!buyer_id(full_name),
          supplier:profiles!supplier_id(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      return {
        totalUsers,
        buyers,
        suppliers,
        deliveryPartners,
        totalListings,
        totalOrders,
        totalRevenue,
        completedOrders,
        recentUsers,
        recentOrders,
        notifications: notifications || [],
        recentOrdersDetailed: recentOrdersDetailed || []
      };
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function SuperAdminDashboard() {
  const { data: stats, isLoading, error } = useSuperAdminStats();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-red-500">Error loading dashboard: {error.message}</div>
        </div>
      </DashboardLayout>
    );
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'in_transit': return 'primary';
      case 'preparing': return 'warning';
      case 'pending': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Super Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Platform overview and management center
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <Link to="/marketplace">
              <Button variant="default" size="sm">
                <Globe className="w-4 h-4 mr-2" />
                View Marketplace
              </Button>
            </Link>
            <Link to="/super-admin/delivery-management">
              <Button variant="default" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Manage Delivery
              </Button>
            </Link>
            <Button variant="solid" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600">Total Users</p>
                  <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
                  <p className="text-xs text-green-600">+{stats?.recentUsers || 0} this month</p>
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
                  <p className="text-sm font-medium text-neutral-600">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    <CurrencyDisplay amount={stats?.totalRevenue || 0} />
                  </p>
                  <p className="text-xs text-green-600">From {stats?.completedOrders || 0} orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600">Total Orders</p>
                  <p className="text-2xl font-bold">{stats?.totalOrders || 0}</p>
                  <p className="text-xs text-green-600">+{stats?.recentOrders || 0} this month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Store className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600">Active Listings</p>
                  <p className="text-2xl font-bold">{stats?.totalListings || 0}</p>
                  <p className="text-xs text-neutral-600">Platform products</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>User Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">Buyers</span>
                  </div>
                  <span className="font-bold text-blue-600">{stats?.buyers || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Suppliers</span>
                  </div>
                  <span className="font-bold text-green-600">{stats?.suppliers || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="font-medium">Delivery Partners</span>
                  </div>
                  <span className="font-bold text-orange-600">{stats?.deliveryPartners || 0}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Button variant="ghost" className="w-full">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Recent Orders</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.recentOrdersDetailed?.slice(0, 5).map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">#{order.id.slice(0, 8)}</span>
                        <Badge variant={getOrderStatusColor(order.status) as any} size="sm">
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {order.buyer?.full_name} → {order.supplier?.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <DateDisplay date={order.created_at} format="short" />
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        <CurrencyDisplay amount={parseFloat(order.total_amount) || 0} />
                      </p>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
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
        </div>

        {/* Notifications & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>System Notifications</span>
                {stats?.notifications && stats.notifications.length > 0 && (
                  <Badge variant="error" size="sm">{stats.notifications.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.notifications?.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No unread notifications</p>
                ) : (
                  stats?.notifications?.map((notification: any) => (
                    <div key={notification.id} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-amber-800">{notification.type}</p>
                          <p className="text-xs text-amber-700">{notification.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <Link to="/dashboard/category-management">
                  <Button variant="ghost" className="justify-start h-12 w-full">
                    <Settings className="w-5 h-5 mr-3" />
                    Manage Categories
                  </Button>
                </Link>
                                  <Link to="/marketplace">
                    <Button variant="ghost" className="justify-start h-12 w-full">
                      <Globe className="w-5 h-5 mr-3" />
                      View Marketplace
                    </Button>
                  </Link>
                  <Link to="/messaging">
                  <Button variant="ghost" className="justify-start h-12 w-full">
                    <MessageSquare className="w-5 h-5 mr-3" />
                    Platform Messages
                  </Button>
                </Link>
                <Button variant="ghost" className="justify-start h-12 w-full">
                  <BarChart3 className="w-5 h-5 mr-3" />
                  Advanced Analytics
                </Button>
                <Button variant="ghost" className="justify-start h-12 w-full">
                  <TrendingUp className="w-5 h-5 mr-3" />
                  Financial Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SuperAdminDashboard;
