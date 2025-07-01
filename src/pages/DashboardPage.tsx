import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../App';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { getStats } from '../utils/dashboardUtils';
import ProgressiveLoading from '../components/ui/ProgressiveLoading';
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




// Dashboard component for GastroHub_Bolt platform
export default function DashboardPage() {
  const { user, loading: authLoading, error: authError } = useAuthContext();
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch dashboard stats when user is authenticated
  useEffect(() => {
    async function fetchDashboardStats() {
      if (!user) return;
      
      try {
        setLoading(true);
        const dashboardStats = await getStats(user);
        setStats(dashboardStats);
        setError(null);
      } catch (err) {
        console.error('[Dashboard] Error fetching stats:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardStats();
  }, [user]);

  // Show appropriate loading or error states
  if (authLoading) {
    return (
      <ProgressiveLoading 
        fallback={
          <DashboardLayout>
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-lg text-muted-foreground">Loading your dashboard data...</div>
            </div>
          </DashboardLayout>
        }
        recoveryTimeout={15000}
      />
    );
  }
  
  // Show auth error
  if (authError) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg max-w-md">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Authentication Error</h3>
            <p className="text-red-700 mb-4">{authError instanceof Error ? authError.message : 'Failed to authenticate'}</p>
            <Button onClick={() => window.location.href = '/login'}>Go to Login</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Guard: Show loading or fallback if user/profile is missing
  if (!user || !user.profile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-lg text-muted-foreground">User profile not found. Please login again.</div>
        </div>
      </DashboardLayout>
    );
  }

  const getWelcomeMessage = () => {
    const timeOfDay = new Date().getHours() < 12 ? 'morning' : 
                     new Date().getHours() < 18 ? 'afternoon' : 'evening';
    const name = user?.profile?.full_name || user?.profile?.username || 'there';
    return `Good ${timeOfDay}, ${name}!`;
  };

  const getQuickActions = () => {
    switch (user?.role) {
      case 'buyer':
        return [
          { label: 'Browse Marketplace', href: '/marketplace', icon: <ShoppingCart className="w-4 h-4 text-primary-600" /> },
          { label: 'View Orders', href: '/orders', icon: <Eye className="w-4 h-4 text-primary-600" /> },
          { label: 'Find Suppliers', href: '/suppliers', icon: <Users className="w-4 h-4 text-primary-600" /> },
        ];
      case 'supplier':
        return [
          { label: 'Add New Listing', href: '/add-listing', icon: <Plus className="w-4 h-4 text-primary-600" /> },
          { label: 'Manage Listings', href: '/my-listings', icon: <Package className="w-4 h-4 text-primary-600" /> },
          { label: 'View Analytics', href: '/analytics', icon: <TrendingUp className="w-4 h-4 text-primary-600" /> },
        ];
      case 'delivery_partner':
        return [
          { label: 'Available Deliveries', href: '/deliveries/available', icon: <Package className="w-4 h-4 text-primary-600" /> },
          { label: 'My Deliveries', href: '/deliveries', icon: <Truck className="w-4 h-4 text-primary-600" /> },
          { label: 'View Earnings', href: '/earnings', icon: <DollarSign className="w-4 h-4 text-primary-600" /> },
        ];
      default:
        return [];
    }
  };

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
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-neutral-900">{getWelcomeMessage()}</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your account today.
          </p>
                key={index}
                variant={index === 0 ? 'primary' : 'outline'}
                size="sm"
                className="transition-all duration-200"
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
                  <div key={order.id} className="flex items-center justify-between p-4 bg-card rounded-xl">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-neutral-900">{order.id}</span>
                        <Badge variant={getStatusColor(order.status) as any} size="sm">
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-600 mb-1">{order.supplier}</p>
                      <p className="text-xs text-muted-foreground">{order.items}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-neutral-900">{order.amount}</p>
                      <p className="text-xs text-muted-foreground">{order.date}</p>
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