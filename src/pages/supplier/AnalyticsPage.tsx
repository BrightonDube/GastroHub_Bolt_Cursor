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
  Eye,
  Heart,
  RefreshCw
} from 'lucide-react';

export function SupplierAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [metric, setMetric] = useState('revenue');

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' },
  ];

  const metrics = [
    { value: 'revenue', label: 'Revenue Analysis' },
    { value: 'products', label: 'Product Performance' },
    { value: 'customers', label: 'Customer Behavior' },
    { value: 'forecast', label: 'Revenue Forecast' },
  ];

  // Mock data - replace with real API calls
  const supplierKpiData = [
    {
      title: 'Total Revenue',
      value: 'R 284,750',
      change: { value: 12.5, type: 'increase' },
      icon: <DollarSign className="w-6 h-6" />,
      color: 'success',
      description: 'Revenue this month'
    },
    {
      title: 'Orders Received',
      value: '1,247',
      change: { value: 8.2, type: 'increase' },
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'primary',
      description: 'New orders this month'
    },
    {
      title: 'Active Products',
      value: '456',
      change: { value: -2.1, type: 'decrease' },
      icon: <Package className="w-6 h-6" />,
      color: 'warning',
      description: 'Products in catalog'
    },
    {
      title: 'Customer Base',
      value: '189',
      change: { value: 15.7, type: 'increase' },
      icon: <Users className="w-6 h-6" />,
      color: 'secondary',
      description: 'Active customers'
    }
  ];

  const topProducts = [
    {
      name: 'Organic Tomatoes',
      revenue: 18500,
      units: 850,
      views: 2340,
      conversionRate: 36.3,
      trend: 'up',
      stock: 'In Stock'
    },
    {
      name: 'Fresh Atlantic Salmon',
      revenue: 15200,
      units: 320,
      views: 1890,
      conversionRate: 16.9,
      trend: 'up',
      stock: 'Low Stock'
    },
    {
      name: 'Artisan Mozzarella',
      revenue: 12800,
      units: 640,
      views: 1650,
      conversionRate: 38.8,
      trend: 'down',
      stock: 'In Stock'
    },
    {
      name: 'Free-Range Eggs',
      revenue: 9600,
      units: 480,
      views: 1420,
      conversionRate: 33.8,
      trend: 'stable',
      stock: 'In Stock'
    }
  ];

  const customerSegments = [
    {
      segment: 'Premium Restaurants',
      customers: 45,
      avgOrderValue: 2850,
      frequency: 'Weekly',
      retention: 95,
      growth: 12
    },
    {
      segment: 'Cafes & Bistros',
      customers: 78,
      avgOrderValue: 1200,
      frequency: 'Bi-weekly',
      retention: 87,
      growth: 8
    },
    {
      segment: 'Catering Companies',
      customers: 32,
      avgOrderValue: 4500,
      frequency: 'Monthly',
      retention: 92,
      growth: 15
    },
    {
      segment: 'Small Retailers',
      customers: 34,
      avgOrderValue: 800,
      frequency: 'Weekly',
      retention: 78,
      growth: -3
    }
  ];

  const revenueForecasting = [
    { month: 'Current', actual: 284750, forecast: 284750, confidence: 100 },
    { month: 'Next Month', actual: null, forecast: 298000, confidence: 85 },
    { month: 'Month +2', actual: null, forecast: 312000, confidence: 78 },
    { month: 'Month +3', actual: null, forecast: 325000, confidence: 65 }
  ];

  const performanceInsights = [
    {
      type: 'Opportunity',
      title: 'Seasonal Demand Peak',
      description: 'Organic tomatoes showing 40% higher demand. Consider increasing inventory.',
      action: 'Increase Stock',
      priority: 'high',
      impact: 'R 12,000 potential revenue'
    },
    {
      type: 'Alert',
      title: 'Low Stock Warning',
      description: 'Atlantic Salmon running low. 3 pending orders may be affected.',
      action: 'Restock Now',
      priority: 'urgent',
      impact: 'R 8,500 at risk'
    },
    {
      type: 'Insight',
      title: 'Customer Retention',
      description: 'Premium restaurants have 95% retention rate. Focus on similar customer acquisition.',
      action: 'Target Similar',
      priority: 'medium',
      impact: 'R 15,000 growth potential'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Supplier Analytics
            </h1>
            <p className="mt-1 text-muted-foreground">
              Monitor your sales performance and grow your business
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
          {supplierKpiData.map((kpi, index) => (
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
          {/* Top Performing Products */}
          <Card className="p-6">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Top Performing Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{product.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant={product.stock === 'In Stock' ? 'success' : 'warning'}>
                          {product.stock}
                        </Badge>
                        <Badge variant={product.trend === 'up' ? 'success' : product.trend === 'down' ? 'destructive' : 'secondary'}>
                          {product.trend === 'up' ? '↗' : product.trend === 'down' ? '↘' : '→'}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Revenue:</span>
                        <CurrencyDisplay amount={product.revenue} className="ml-2 font-medium" />
                      </div>
                      <div>
                        <span className="text-muted-foreground">Units:</span>
                        <span className="ml-2 font-medium">{product.units}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Views:</span>
                        <span className="ml-2 font-medium">{product.views}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Conv. Rate:</span>
                        <span className="ml-2 font-medium">{product.conversionRate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer Segments */}
          <Card className="p-6">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Customer Segments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerSegments.map((segment, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{segment.segment}</h4>
                      <Badge variant={segment.growth > 0 ? 'success' : segment.growth < 0 ? 'destructive' : 'secondary'}>
                        {segment.growth > 0 ? '+' : ''}{segment.growth}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Customers:</span>
                        <span className="ml-2 font-medium">{segment.customers}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Order:</span>
                        <CurrencyDisplay amount={segment.avgOrderValue} className="ml-2 font-medium" />
                      </div>
                      <div>
                        <span className="text-muted-foreground">Frequency:</span>
                        <span className="ml-2 font-medium">{segment.frequency}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Retention:</span>
                        <span className="ml-2 font-medium">{segment.retention}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Insights */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Performance Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {performanceInsights.map((insight, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {insight.type === 'Alert' && <AlertCircle className="w-4 h-4 text-red-500" />}
                      {insight.type === 'Opportunity' && <TrendingUp className="w-4 h-4 text-green-500" />}
                      {insight.type === 'Insight' && <Eye className="w-4 h-4 text-blue-500" />}
                      <span className="font-medium text-sm">{insight.type}</span>
                    </div>
                    <Badge variant={insight.priority === 'urgent' ? 'destructive' : insight.priority === 'high' ? 'warning' : 'secondary'}>
                      {insight.priority}
                    </Badge>
                  </div>
                  <h4 className="font-semibold mb-2">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {insight.description}
                  </p>
                  <div className="text-sm font-medium text-green-600 mb-3">
                    {insight.impact}
                  </div>
                  <Button size="sm" className="w-full">
                    {insight.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Forecasting */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              Revenue Forecasting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {revenueForecasting.map((period, index) => (
                <div key={index} className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">{period.month}</div>
                  <div className="text-xl font-bold">
                    <CurrencyDisplay amount={period.forecast} />
                  </div>
                  <div className="text-sm">
                    {period.actual ? (
                      <Badge variant="success">Actual</Badge>
                    ) : (
                      <Badge variant="secondary">{period.confidence}% confidence</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="h-48 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
              <div className="text-center">
                <LineChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Interactive forecasting chart will be implemented here</p>
                <p className="text-sm">Showing revenue trends and predictive analytics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default SupplierAnalyticsPage; 