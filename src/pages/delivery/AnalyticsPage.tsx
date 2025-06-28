import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { CurrencyDisplay } from '../../components/ui/CurrencyDisplay';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Star,
  Clock,
  Percent,
  AlertCircle,
  Truck,
  MapPin,
  Route,
  Timer,
  Fuel,
  CheckCircle,
  XCircle
} from 'lucide-react';

export function DeliveryAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [metric, setMetric] = useState('performance');

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

  // Mock data - replace with real API calls
  const deliveryKpiData = [
    {
      title: 'Total Earnings',
      value: 'R 18,450',
      change: { value: 15.2, type: 'increase' },
      icon: <DollarSign className="w-6 h-6" />,
      color: 'success',
      description: 'Earnings this month'
    },
    {
      title: 'Deliveries Made',
      value: '347',
      change: { value: 12.8, type: 'increase' },
      icon: <Package className="w-6 h-6" />,
      color: 'primary',
      description: 'Completed deliveries'
    },
    {
      title: 'On-Time Rate',
      value: '96.5%',
      change: { value: 2.1, type: 'increase' },
      icon: <Clock className="w-6 h-6" />,
      color: 'secondary',
      description: 'On-time delivery rate'
    },
    {
      title: 'Customer Rating',
      value: '4.8',
      change: { value: 0.3, type: 'increase' },
      icon: <Star className="w-6 h-6" />,
      color: 'warning',
      description: 'Average customer rating'
    }
  ];

  const routeEfficiency = [
    {
      route: 'Johannesburg CBD',
      deliveries: 45,
      avgTime: 28,
      distance: 120,
      fuelCost: 450,
      efficiency: 92,
      trend: 'up'
    },
    {
      route: 'Sandton Area',
      deliveries: 38,
      avgTime: 35,
      distance: 95,
      fuelCost: 380,
      efficiency: 88,
      trend: 'stable'
    },
    {
      route: 'Cape Town Central',
      deliveries: 42,
      avgTime: 32,
      distance: 110,
      fuelCost: 420,
      efficiency: 90,
      trend: 'up'
    },
    {
      route: 'Durban Coastal',
      deliveries: 29,
      avgTime: 40,
      distance: 85,
      fuelCost: 320,
      efficiency: 85,
      trend: 'down'
    }
  ];

  const performanceMetrics = [
    { metric: 'Successful Deliveries', value: 347, total: 360, percentage: 96.4, status: 'excellent' },
    { metric: 'On-Time Deliveries', value: 335, total: 347, percentage: 96.5, status: 'excellent' },
    { metric: 'Customer Satisfaction', value: 4.8, total: 5.0, percentage: 96.0, status: 'excellent' },
    { metric: 'Route Optimization', value: 89, total: 100, percentage: 89.0, status: 'good' }
  ];

  const earningsBreakdown = [
    { source: 'Standard Deliveries', amount: 12800, percentage: 69, count: 280 },
    { source: 'Express Deliveries', amount: 3200, percentage: 17, count: 32 },
    { source: 'Weekend Premium', amount: 1850, percentage: 10, count: 25 },
    { source: 'Long Distance', amount: 600, percentage: 4, count: 10 }
  ];

  const customerFeedback = [
    {
      rating: 5,
      count: 245,
      percentage: 70.6,
      feedback: 'Excellent service, always on time!'
    },
    {
      rating: 4,
      count: 78,
      percentage: 22.5,
      feedback: 'Good delivery, minor delays occasionally'
    },
    {
      rating: 3,
      count: 18,
      percentage: 5.2,
      feedback: 'Average service, room for improvement'
    },
    {
      rating: 2,
      count: 4,
      percentage: 1.2,
      feedback: 'Below expectations, late delivery'
    },
    {
      rating: 1,
      count: 2,
      percentage: 0.5,
      feedback: 'Poor service, damaged items'
    }
  ];

  const improvementAreas = [
    {
      area: 'Route Optimization',
      current: 89,
      target: 95,
      impact: 'R 850/month fuel savings',
      action: 'Use GPS optimization tools',
      priority: 'high'
    },
    {
      area: 'Delivery Speed',
      current: 28,
      target: 25,
      impact: '15% more deliveries/day',
      action: 'Optimize loading process',
      priority: 'medium'
    },
    {
      area: 'Customer Communication',
      current: 85,
      target: 95,
      impact: 'Higher satisfaction scores',
      action: 'Implement real-time updates',
      priority: 'medium'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Delivery Analytics
            </h1>
            <p className="mt-1 text-muted-foreground">
              Track your delivery performance and optimize your routes
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Select
              options={timeRanges}
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            />
            <Select
              options={metrics}
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
            />
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {deliveryKpiData.map((kpi, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg bg-${kpi.color}-100 dark:bg-${kpi.color}-900`}>
                  <div className={`text-${kpi.color}-600 dark:text-${kpi.color}-400`}>
                    {kpi.icon}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                  <div className={`flex items-center text-sm ${
                    kpi.change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.change.type === 'increase' ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {kpi.change.value}%
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="font-medium text-foreground">{kpi.title}</div>
                <div className="text-sm text-muted-foreground">{kpi.description}</div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Route Efficiency */}
          <Card className="p-6">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Route className="w-5 h-5" />
                Route Efficiency Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routeEfficiency.map((route, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{route.route}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant={route.efficiency >= 90 ? 'success' : route.efficiency >= 85 ? 'warning' : 'destructive'}>
                          {route.efficiency}% efficient
                        </Badge>
                        <Badge variant={route.trend === 'up' ? 'success' : route.trend === 'down' ? 'destructive' : 'secondary'}>
                          {route.trend === 'up' ? '↗' : route.trend === 'down' ? '↘' : '→'}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Deliveries:</span>
                        <span className="ml-2 font-medium">{route.deliveries}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Time:</span>
                        <span className="ml-2 font-medium">{route.avgTime}min</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Distance:</span>
                        <span className="ml-2 font-medium">{route.distance}km</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Fuel Cost:</span>
                        <CurrencyDisplay amount={route.fuelCost} className="ml-2 font-medium" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="p-6">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{metric.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {metric.value}{typeof metric.total === 'number' && metric.total !== 100 ? `/${metric.total}` : ''}
                        </span>
                        <Badge variant={metric.status === 'excellent' ? 'success' : metric.status === 'good' ? 'warning' : 'secondary'}>
                          {metric.percentage.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          metric.status === 'excellent' ? 'bg-green-500' : 
                          metric.status === 'good' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}
                        style={{ width: `${metric.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Earnings Breakdown */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Earnings Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {earningsBreakdown.map((earning, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    <CurrencyDisplay amount={earning.amount} />
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">{earning.source}</div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Badge variant="secondary">{earning.percentage}%</Badge>
                    <span className="text-muted-foreground">{earning.count} deliveries</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Satisfaction */}
          <Card className="p-6">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Customer Satisfaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerFeedback.map((feedback, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="font-medium">{feedback.rating}</span>
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">{feedback.count} reviews</span>
                        <span className="text-sm font-medium">{feedback.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${feedback.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 italic">
                        "{feedback.feedback}"
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Improvement Areas */}
          <Card className="p-6">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Improvement Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {improvementAreas.map((area, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{area.area}</h4>
                      <Badge variant={area.priority === 'high' ? 'destructive' : 'warning'}>
                        {area.priority}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Current: {area.current}{area.area === 'Delivery Speed' ? ' min' : '%'}</span>
                        <span className="text-muted-foreground">Target: {area.target}{area.area === 'Delivery Speed' ? ' min' : '%'}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(area.current / area.target) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-green-600 font-medium">{area.impact}</div>
                      <Button size="sm" className="w-full mt-2">
                        {area.action}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Trends */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Interactive performance charts will be implemented here</p>
                <p className="text-sm">Showing delivery trends, route optimization, and earnings over time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default DeliveryAnalyticsPage; 