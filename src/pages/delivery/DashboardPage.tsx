import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CurrencyDisplay } from '../../components/ui/CurrencyDisplay';
import { DateDisplay } from '../../components/ui/DateDisplay';
import { 
  Truck, 
  MapPin,
  DollarSign,
  Clock,
  Package,
  Star,
  Route,
  CheckCircle,
  AlertTriangle,
  Navigation,
  Users,
  BarChart3,
  TrendingUp,
  Globe,
  MessageSquare,
  Calendar,
  Timer,
  Map,
  Award
} from 'lucide-react';

import { 
  useDeliveryPartnerOrders, 
  useDeliveryPartnerAnalytics,
  useAvailableOrdersForDelivery 
} from '../../hooks/useDeliveryStats';
import { useAuthContext } from '../../App';
import { Link } from 'react-router-dom';

export function DeliveryDashboard() {
  console.log('[DeliveryDashboard] Render');
  
  const { user } = useAuthContext();
  
  // Fetch delivery partner specific data
  const { data: assignedOrders, isLoading: ordersLoading, error: ordersError } = useDeliveryPartnerOrders(user?.id);
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useDeliveryPartnerAnalytics(user?.id);
  const { data: availableOrders, isLoading: availableLoading } = useAvailableOrdersForDelivery();

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'success';
      case 'IN_TRANSIT':
        return 'primary';
      case 'READY_FOR_PICKUP':
        return 'warning';
      case 'ASSIGNED':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle className="w-4 h-4" />;
      case 'IN_TRANSIT':
        return <Truck className="w-4 h-4" />;
      case 'READY_FOR_PICKUP':
        return <Package className="w-4 h-4" />;
      case 'ASSIGNED':
        return <Clock className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getDeliveryPriority = (order: any) => {
    if (!order.estimated_delivery_date) return 'normal';
    const deliveryDate = new Date(order.estimated_delivery_date);
    const now = new Date();
    const hoursUntilDelivery = (deliveryDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilDelivery < 2) return 'urgent';
    if (hoursUntilDelivery < 6) return 'high';
    return 'normal';
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Delivery Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage deliveries, track earnings, and optimize your routes.
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <Link to="/marketplace">
              <Button variant="default" size="sm">
                <Globe className="w-4 h-4 mr-2" />
                View Marketplace
              </Button>
            </Link>
            <Button variant="solid" size="sm">
              <Route className="w-4 h-4 mr-2" />
              Optimize Route
            </Button>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600">Total Deliveries</p>
                  <p className="text-2xl font-bold">{analytics?.totalDeliveries || 0}</p>
                  <p className="text-xs text-green-600">{analytics?.completedDeliveries || 0} completed</p>
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
                    <CurrencyDisplay amount={analytics?.totalEarnings || 0} />
                  </p>
                  <p className="text-xs text-neutral-600">This period</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600">Average Rating</p>
                  <div className="flex items-center space-x-1">
                    <p className="text-2xl font-bold">{analytics?.avgRating || 0}</p>
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  </div>
                  <p className="text-xs text-neutral-600">Customer feedback</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Timer className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600">On-Time Rate</p>
                  <p className="text-2xl font-bold">{analytics?.onTimeRate || 0}%</p>
                  <p className="text-xs text-green-600">Excellent performance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Deliveries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Truck className="w-5 h-5" />
                  <span>My Deliveries</span>
                </div>
                <Badge variant="primary" size="sm">
                  {assignedOrders?.filter((o: any) => o.status !== 'DELIVERED').length || 0} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ordersLoading && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                )}
                
                {ordersError && (
                  <div className="text-center py-4 text-red-500">
                    Error loading orders: {ordersError.message}
                  </div>
                )}

                {!ordersLoading && !ordersError && (!assignedOrders || assignedOrders.length === 0) ? (
                  <div className="text-center py-8">
                    <Truck className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                    <div className="text-muted-foreground">No assigned deliveries.</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Check available orders to pick up new deliveries.
                    </p>
                  </div>
                ) : (
                  assignedOrders?.slice(0, 5).map((order: any) => {
                    const priority = getDeliveryPriority(order);
                    return (
                      <div key={order.id} className={`p-4 rounded-xl border transition-colors hover:bg-muted/50 ${
                        priority === 'urgent' ? 'border-red-300 bg-red-50' :
                        priority === 'high' ? 'border-orange-300 bg-orange-50' : 'bg-card'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-foreground">#{order.id?.slice(0, 8)}</span>
                            <Badge variant={getOrderStatusColor(order.status) as any} size="sm">
                              <span className="flex items-center space-x-1">
                                {getOrderStatusIcon(order.status)}
                                <span>{order.status?.replace('_', ' ')}</span>
                              </span>
                            </Badge>
                            {priority === 'urgent' && (
                              <Badge variant="error" size="sm">URGENT</Badge>
                            )}
                          </div>
                          <CurrencyDisplay amount={parseFloat(order.delivery_fee) || 0} />
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>From: {order.pickup_address || 'Supplier location'}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <Navigation className="w-4 h-4" />
                            <span>To: {order.delivery_address || 'Customer location'}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>Expected: <DateDisplay date={order.estimated_delivery_date} format="short" /></span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                          <div className="text-xs text-muted-foreground">
                            Customer: {order.buyer?.full_name || 'Unknown'}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Map className="w-4 h-4" />
                            </Button>
                            <Button variant="default" size="sm">
                              Update Status
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Button variant="ghost" className="w-full">
                  View All Deliveries
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Available Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Available Orders</span>
                </div>
                <Badge variant="secondary" size="sm">
                  {availableOrders?.length || 0} Available
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableLoading && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                )}

                {!availableLoading && (!availableOrders || availableOrders.length === 0) ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                    <div className="text-muted-foreground">No available orders.</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      New delivery requests will appear here.
                    </p>
                  </div>
                ) : (
                  availableOrders?.slice(0, 5).map((order: any) => (
                    <div key={order.id} className="p-4 bg-card rounded-xl border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-foreground">#{order.id?.slice(0, 8)}</span>
                          <Badge variant={getOrderStatusColor(order.status) as any} size="sm">
                            {order.status?.replace('_', ' ')}
                          </Badge>
                        </div>
                        <CurrencyDisplay amount={parseFloat(order.delivery_fee) || 25} />
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>Distance: ~5km</span>
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Requested: <DateDisplay date={order.created_at} format="short" /></span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                        <div className="text-xs text-muted-foreground">
                          Value: <CurrencyDisplay amount={parseFloat(order.total_amount) || 0} />
                        </div>
                        <Button variant="default" size="sm">
                          Accept Order
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Button variant="ghost" className="w-full">
                  View All Available
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance & Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Ratings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>Recent Ratings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics?.recentRatings?.length === 0 ? (
                  <div className="text-center py-4">
                    <Star className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm">No ratings yet</p>
                  </div>
                ) : (
                  analytics?.recentRatings?.slice(0, 3).map((rating: any) => (
                    <div key={rating.id || Math.random()} className="p-3 bg-neutral-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < (rating.rating || 0) ? 'text-yellow-500 fill-current' : 'text-neutral-300'
                              }`} 
                            />
                          ))}
                        </div>
                        <DateDisplay date={rating.created_at} format="short" />
                      </div>
                      {rating.comment && (
                        <p className="text-sm text-muted-foreground">{rating.comment}</p>
                      )}
                    </div>
                  ))
                )}
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
                <Button variant="ghost" className="justify-start h-10 w-full">
                  <Route className="w-4 h-4 mr-3" />
                  Optimize Route
                </Button>
                <Button variant="ghost" className="justify-start h-10 w-full">
                  <Calendar className="w-4 h-4 mr-3" />
                  Set Availability
                </Button>
                <Link to="/MessagingPage">
                  <Button variant="ghost" className="justify-start h-10 w-full">
                    <MessageSquare className="w-4 h-4 mr-3" />
                    Messages
                  </Button>
                </Link>
                <Button variant="ghost" className="justify-start h-10 w-full">
                  <BarChart3 className="w-4 h-4 mr-3" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Achievement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Achievement</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <Award className="w-12 h-12 text-gold-500 mx-auto mb-4" />
                <h4 className="font-semibold text-foreground mb-2">Reliable Partner</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  You've maintained a {analytics?.onTimeRate || 95}% on-time delivery rate!
                </p>
                <Badge variant="success" size="sm">Gold Status</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DeliveryDashboard;
