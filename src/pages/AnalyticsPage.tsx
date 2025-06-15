import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
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
  Target
} from 'lucide-react';

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [metric, setMetric] = useState('revenue');

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' },
  ];

  const metrics = [
    { value: 'revenue', label: 'Revenue' },
    { value: 'orders', label: 'Orders' },
    { value: 'customers', label: 'Customers' },
    { value: 'products', label: 'Products' },
  ];

  const kpiData = [
    {
      title: 'Total Revenue',
      value: '$284,750',
      change: { value: 12.5, type: 'increase' },
      icon: <DollarSign className="w-6 h-6" />,
      color: 'success'
    },
    {
      title: 'Total Orders',
      value: '1,247',
      change: { value: 8.2, type: 'increase' },
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'primary'
    },
    {
      title: 'Active Products',
      value: '456',
      change: { value: -2.1, type: 'decrease' },
      icon: <Package className="w-6 h-6" />,
      color: 'warning'
    },
    {
      title: 'New Customers',
      value: '89',
      change: { value: 15.7, type: 'increase' },
      icon: <Users className="w-6 h-6" />,
      color: 'secondary'
    }
  ];

  const topProducts = [
    { name: 'Organic Tomatoes', sales: 234, revenue: '$5,850', growth: 12.5 },
    { name: 'Premium Olive Oil', sales: 189, revenue: '$4,725', growth: 8.3 },
    { name: 'Fresh Salmon', sales: 156, revenue: '$2,925', growth: -3.2 },
    { name: 'Artisan Bread', sales: 145, revenue: '$942', growth: 22.1 },
    { name: 'Organic Milk', sales: 134, revenue: '$536', growth: 5.7 }
  ];

  const customerSegments = [
    { segment: 'Restaurants', percentage: 45, value: '$128,250', color: 'bg-primary-500' },
    { segment: 'Cafes', percentage: 28, value: '$79,650', color: 'bg-secondary-400' },
    { segment: 'Hotels', percentage: 18, value: '$51,255', color: 'bg-success-500' },
    { segment: 'Catering', percentage: 9, value: '$25,595', color: 'bg-warning-500' }
  ];

  const getChangeIcon = (type: string) => {
    return type === 'increase' ? 
      <TrendingUp className="w-4 h-4 text-success-600" /> : 
      <TrendingDown className="w-4 h-4 text-error-600" />;
  };

  const getChangeColor = (type: string) => {
    return type === 'increase' ? 'var(--success-600)' : 'var(--error-600)';
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold" style={{ color: 'var(--foreground)' }}>
              Analytics Dashboard
            </h1>
            <p className="mt-1" style={{ color: 'var(--muted-foreground, #6b7280)' }}>
              Track your business performance and gain insights
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Select
              options={timeRanges}
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            />
            <Button variant="outline" size="sm" style={{ borderColor: 'var(--stroke)', color: 'var(--foreground)' }}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm" style={{ borderColor: 'var(--stroke)', color: 'var(--foreground)' }}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <Card key={index} padding="md" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--stroke)' }}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{kpi.title}</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{kpi.value}</p>
                  <div className="flex items-center mt-2 space-x-1">
                    {getChangeIcon(kpi.change.type)}
                    <span className={`text-sm font-medium` + (kpi.change.type === 'increase' ? ' text-success-600' : ' text-error-600')} style={{ color: getChangeColor(kpi.change.type) }}>
                      {kpi.change.value > 0 ? '+' : ''}{kpi.change.value}%
                    </span>
                    <span className="text-sm" style={{ color: 'var(--muted-foreground, #6b7280)' }}>vs last period</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${kpi.color === 'success' ? 'bg-success-100 text-success-600' :
                  kpi.color === 'primary' ? 'bg-primary-100 text-primary-600' :
                  kpi.color === 'warning' ? 'bg-warning-100 text-warning-600' :
                  'bg-secondary-100 text-secondary-600'}`} style={{ backgroundColor: 'var(--' + kpi.color + '-100)', color: 'var(--' + kpi.color + '-600)' }}>
                  {kpi.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <Card style={{ backgroundColor: 'var(--card)', borderColor: 'var(--stroke)' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <LineChart className="w-5 h-5" />
                  <span style={{ color: 'var(--foreground)' }}>Revenue Trend</span>
                </CardTitle>
                <Select
                  options={metrics}
                  value={metric}
                  onChange={(e) => setMetric(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64" style={{ backgroundColor: 'var(--neutral-50)' }}>
                <div className="text-center">
                  <BarChart3 className="w-12 h-12" style={{ color: 'var(--neutral-400)' }} />
                  <p style={{ color: 'var(--neutral-500)' }}>Chart visualization would go here</p>
                  <p className="text-sm" style={{ color: 'var(--neutral-400)' }}>Revenue trend over {timeRange}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Segments */}
          <Card style={{ backgroundColor: 'var(--card)', borderColor: 'var(--stroke)' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-5 h-5" />
                <span style={{ color: 'var(--foreground)' }}>Customer Segments</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerSegments.map((segment, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${segment.color}`} style={{ backgroundColor: 'var(--' + segment.color + ')' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{segment.segment}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{segment.percentage}%</p>
                      <p className="text-xs" style={{ color: 'var(--neutral-500)' }}>{segment.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 h-32" style={{ backgroundColor: 'var(--neutral-50)' }}>
                <div className="text-center">
                  <PieChart className="w-8 h-8" style={{ color: 'var(--neutral-400)' }} />
                  <p className="text-sm" style={{ color: 'var(--neutral-500)' }}>Pie chart visualization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <Card style={{ backgroundColor: 'var(--card)', borderColor: 'var(--stroke)' }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span style={{ color: 'var(--foreground)' }}>Top Performing Products</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--stroke)' }}>
                    <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--foreground)' }}>Product</th>
                    <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--foreground)' }}>Sales</th>
                    <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--foreground)' }}>Revenue</th>
                    <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--foreground)' }}>Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid var(--neutral-100)' }}>
                      <td className="py-3 px-4">
                        <span className="font-medium" style={{ color: 'var(--foreground)' }}>{product.name}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span style={{ color: 'var(--neutral-700)' }}>{product.sales}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{product.revenue}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          {product.growth > 0 ? 
                            <TrendingUp className="w-4 h-4" style={{ color: 'var(--success-600)' }} /> : 
                            <TrendingDown className="w-4 h-4" style={{ color: 'var(--error-600)' }} />
                          }
                          <span className={`text-sm font-medium` + (product.growth > 0 ? ' text-success-600' : ' text-error-600')} style={{ color: product.growth > 0 ? 'var(--success-600)' : 'var(--error-600)' }}>
                            {product.growth > 0 ? '+' : ''}{product.growth}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card padding="lg" style={{ background: 'linear-gradient(90deg, var(--primary-50), var(--secondary-50))' }}>
          <div className="text-center">
            <h2 className="text-xl font-heading font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              Key Insights & Recommendations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-success-100 text-success-600 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'var(--success-100)', color: 'var(--success-600)' }}>
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Revenue Growth</h3>
                <p className="text-sm" style={{ color: 'var(--neutral-600)' }}>
                <h3 className="font-semibold text-neutral-900 mb-2">Revenue Growth</h3>
                <p className="text-sm text-neutral-600">
                  Your revenue has increased by 12.5% this month. Consider expanding your top-performing product lines.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-warning-100 text-warning-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">Customer Retention</h3>
                <p className="text-sm text-neutral-600">
                  Focus on restaurant segment as they represent 45% of your revenue and show strong loyalty.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">Optimization</h3>
                <p className="text-sm text-neutral-600">
                  Artisan bread shows 22% growth. Consider increasing inventory and marketing for this category.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default AnalyticsPage;