import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { useDeliveryPartnerAnalytics, useDeliveryZones } from '../../hooks/useDeliveryStats';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { CurrencyDisplay } from '../../components/ui/CurrencyDisplay';
import { DateDisplay } from '../../components/ui/DateDisplay';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Calendar,
  Download,
  Filter,
  BarChart3,
  Star,
  Clock,
  Percent,
  Truck,
  MapPin,
  Route,
  Timer,
  CheckCircle,
  Target
} from 'lucide-react';

export function DeliveryAnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: analytics, isLoading: analyticsLoading } = useDeliveryPartnerAnalytics(user?.id);
  const { data: deliveryZones, isLoading: zonesLoading } = useDeliveryZones();
  const [timeRange, setTimeRange] = useState('30d');
  const [metric, setMetric] = useState('performance');

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (!user || user.role !== 'delivery_partner') {
    return (
      <DashboardLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-neutral-700">You must be a delivery partner to access this page.</p>
        </div>
      </DashboardLayout>
    );
  }

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' },
  ];

  const metrics = [
    { value: 'performance', label: 'Delivery Performance' },
    { value: 'routes', label: 'Route Efficiency' },
    { value: 'earnings', label: 'Earnings Analysis' },
    { value: 'satisfaction', label: 'Customer Satisfaction' },
  ];

  const kpiData = [
    {
      title: 'Total Earnings',
      value: analytics ? <CurrencyDisplay amount={analytics.totalEarnings} /> : '--',
      change: { value: 15.2, type: 'increase' }, // Mock change for now
      icon: <DollarSign className="w-6 h-6" />,
      color: 'success',
      description: 'Total earnings to date'
    },
    {
      title: 'Deliveries Made',
      value: analytics?.totalDeliveries?.toString() || '0',
      change: { value: 12.8, type: 'increase' }, // Mock change for now
      icon: <Package className="w-6 h-6" />,
      color: 'primary',
      description: 'Total completed deliveries'
    },
    {
      title: 'On-Time Rate',
      value: analytics ? `${analytics.onTimeRate}%` : '0%',
      change: { value: 2.1, type: 'increase' }, // Mock change for now
      icon: <Clock className="w-6 h-6" />,
      color: 'secondary',
      description: 'On-time delivery rate'
    },
    {
      title: 'Customer Rating',
      value: analytics ? `${analytics.avgRating}/5` : '0/5',
      change: { value: 0.3, type: 'increase' }, // Mock change for now
      icon: <Star className="w-6 h-6" />,
      color: 'warning',
      description: 'Average customer rating'
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Delivery Analytics</h1>
            <p className="text-neutral-700">Track your performance and earnings</p>
          </div>
          
          <div className="flex gap-2">
            <Select
              value={timeRange}
              onValueChange={setTimeRange}
              options={timeRanges}
              placeholder="Select time range"
            />
            <Select
              value={metric}
              onValueChange={setMetric}
              options={metrics}
              placeholder="Select metric"
            />
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${
                        kpi.color === 'success' ? 'bg-green-100' :
                        kpi.color === 'primary' ? 'bg-blue-100' :
                        kpi.color === 'secondary' ? 'bg-purple-100' :
                        'bg-yellow-100'
                      }`}>
                        <div className={
                          kpi.color === 'success' ? 'text-green-600' :
                          kpi.color === 'primary' ? 'text-blue-600' :
                          kpi.color === 'secondary' ? 'text-purple-600' :
                          'text-yellow-600'
                        }>
                          {kpi.icon}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-600">{kpi.title}</p>
                      <p className="text-2xl font-bold">
                        {analyticsLoading ? <LoadingSpinner /> : kpi.value}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {kpi.change.type === 'increase' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      kpi.change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.change.value}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-2">{kpi.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Delivery Zones Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Delivery Zones Coverage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {zonesLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : deliveryZones && deliveryZones.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deliveryZones.slice(0, 6).map((zone) => (
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600">No delivery zones available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Customer Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span>Recent Customer Feedback</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : analytics?.recentRatings && analytics.recentRatings.length > 0 ? (
              <div className="space-y-4">
                {analytics.recentRatings.map((rating, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < (rating.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{rating.rating}/5</span>
                      </div>
                      <span className="text-sm text-neutral-500">
                        <DateDisplay date={rating.created_at} />
                      </span>
                    </div>
                    {rating.comment && (
                      <p className="text-sm text-neutral-700">"{rating.comment}"</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600">No customer feedback yet</p>
                <p className="text-sm text-neutral-500">Complete deliveries to receive ratings</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Performance Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Successful Deliveries</span>
                  <span className="text-sm text-neutral-600">
                    {analytics?.completedDeliveries || 0} / {analytics?.totalDeliveries || 0}
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: analytics?.totalDeliveries ? 
                        `${((analytics.completedDeliveries || 0) / analytics.totalDeliveries) * 100}%` : 
                        '0%'
                    }}
                  ></div>
                </div>
                <span className="text-xs text-green-600 font-medium">
                  {analytics?.totalDeliveries ? 
                    Math.round(((analytics.completedDeliveries || 0) / analytics.totalDeliveries) * 100) : 
                    0}% Success Rate
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">On-Time Deliveries</span>
                  <span className="text-sm text-neutral-600">{analytics?.onTimeRate || 0}%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${analytics?.onTimeRate || 0}%` }}
                  ></div>
                </div>
                <span className="text-xs text-blue-600 font-medium">Target: 95%</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Customer Satisfaction</span>
                  <span className="text-sm text-neutral-600">{analytics?.avgRating || 0}/5</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full"
                    style={{ width: `${((analytics?.avgRating || 0) / 5) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-yellow-600 font-medium">
                  {Math.round(((analytics?.avgRating || 0) / 5) * 100)}% Satisfaction
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default DeliveryAnalyticsPage; 