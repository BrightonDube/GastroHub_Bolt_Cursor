import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { CurrencyDisplay } from '../../components/ui/CurrencyDisplay';
import { InteractiveChart, RevenueChart, CategorySpendingChart } from '../../components/ui/InteractiveChart';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  Download,
  Target,
  Star,
  BarChart3,
  PieChart,
  LineChart,
  Eye,
  Clock
} from 'lucide-react';

export function BuyerAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [metric, setMetric] = useState('spending');

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' },
  ];

  const metrics = [
    { value: 'spending', label: 'Spending Analysis' },
    { value: 'orders', label: 'Order Patterns' },
    { value: 'suppliers', label: 'Supplier Performance' },
    { value: 'savings', label: 'Cost Savings' },
  ];

  // Mock data - replace with real API calls
  const buyerKpiData = [
    {
      title: 'Total Spent',
      value: 'R 45,250',
      change: { value: 8.5, type: 'increase' },
      icon: <DollarSign className="w-6 h-6" />,
      color: 'primary',
      description: 'Total spending this month'
    },
    {
      title: 'Orders Placed',
      value: '127',
      change: { value: 12.3, type: 'increase' },
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'success',
      description: 'Orders completed this month'
    },
    {
      title: 'Active Suppliers',
      value: '18',
      change: { value: 2, type: 'increase' },
      icon: <Users className="w-6 h-6" />,
      color: 'secondary',
      description: 'Suppliers you\'ve ordered from'
    },
    {
      title: 'Cost Savings',
      value: 'R 3,420',
      change: { value: 15.7, type: 'increase' },
      icon: <Target className="w-6 h-6" />,
      color: 'warning',
      description: 'Saved vs market prices'
    }
  ];

  const topSuppliers = [
    {
      name: 'Fresh Farm Produce',
      orders: 24,
      totalSpent: 12450,
      avgRating: 4.8,
      onTimeDelivery: 96,
      lastOrder: '2 days ago'
    },
    {
      name: 'Ocean Fresh Seafood',
      orders: 18,
      totalSpent: 8920,
      avgRating: 4.9,
      onTimeDelivery: 98,
      lastOrder: '1 week ago'
    },
    {
      name: 'Artisan Dairy Co.',
      orders: 15,
      totalSpent: 6780,
      avgRating: 4.7,
      onTimeDelivery: 94,
      lastOrder: '3 days ago'
    }
  ];

  const spendingCategories = [
    { category: 'Fresh Produce', amount: 18500, percentage: 41, trend: 'up' },
    { category: 'Meat & Seafood', amount: 12300, percentage: 27, trend: 'down' },
    { category: 'Dairy & Eggs', amount: 8900, percentage: 20, trend: 'up' },
    { category: 'Beverages', amount: 5550, percentage: 12, trend: 'stable' }
  ];

  const costSavingOpportunities = [
    {
      type: 'Bulk Ordering',
      potential: 850,
      description: 'Order 20% more fresh produce to qualify for bulk discounts',
      action: 'Increase order size',
      priority: 'high'
    },
    {
      type: 'Seasonal Planning',
      potential: 620,
      description: 'Switch to seasonal vegetables for 15% savings',
      action: 'Update menu planning',
      priority: 'medium'
    },
    {
      type: 'Alternative Suppliers',
      potential: 480,
      description: 'Compare prices with 3 new verified suppliers',
      action: 'Explore options',
      priority: 'low'
    }
  ];

  // Chart data
  const spendingTrendData = [
    { name: 'Jan', value: 32400 },
    { name: 'Feb', value: 35600 },
    { name: 'Mar', value: 38200 },
    { name: 'Apr', value: 41800 },
    { name: 'May', value: 39500 },
    { name: 'Jun', value: 45250 }
  ];

  const categoryChartData = spendingCategories.map(cat => ({
    name: cat.category,
    value: cat.amount
  }));

  const orderFrequencyData = [
    { name: 'Week 1', value: 8 },
    { name: 'Week 2', value: 12 },
    { name: 'Week 3', value: 15 },
    { name: 'Week 4', value: 18 },
    { name: 'Week 5', value: 14 }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Buyer Analytics
            </h1>
            <p className="mt-1 text-muted-foreground">
              Track your purchasing patterns and optimize your spending
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
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {buyerKpiData.map((kpi, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900">
                  <div className="text-primary-600 dark:text-primary-400">
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
          {/* Spending by Category */}
          <Card className="p-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Spending by Category
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <CategorySpendingChart data={categoryChartData} height={250} />
              <div className="space-y-2 mt-4">
                {spendingCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{category.category}</span>
                    <div className="flex items-center gap-2">
                      <CurrencyDisplay amount={category.amount} />
                      <Badge variant={category.trend === 'up' ? 'default' : category.trend === 'down' ? 'error' : 'secondary'}>
                        {category.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Suppliers Performance */}
          <Card className="p-6">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Top Supplier Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSuppliers.map((supplier, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{supplier.name}</h4>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{supplier.avgRating}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Orders:</span>
                        <span className="ml-2 font-medium">{supplier.orders}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">On-time:</span>
                        <span className="ml-2 font-medium">{supplier.onTimeDelivery}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total:</span>
                        <CurrencyDisplay amount={supplier.totalSpent} className="ml-2 font-medium" />
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last order:</span>
                        <span className="ml-2 font-medium">{supplier.lastOrder}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cost Saving Opportunities */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Cost Saving Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {costSavingOpportunities.map((opportunity, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{opportunity.type}</h4>
                    <Badge variant={opportunity.priority === 'high' ? 'error' : opportunity.priority === 'medium' ? 'warning' : 'secondary'}>
                      {opportunity.priority}
                    </Badge>
                  </div>
                  <div className="text-lg font-bold text-green-600 mb-2">
                    <CurrencyDisplay amount={opportunity.potential} /> potential savings
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {opportunity.description}
                  </p>
                  <Button size="sm" className="w-full">
                    {opportunity.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Spending Trends & Order Frequency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                Spending Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart data={spendingTrendData} height={250} />
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Order Frequency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InteractiveChart 
                type="bar" 
                data={orderFrequencyData} 
                height={250}
                colors={['#3B82F6']}
                yAxisKey="value"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default BuyerAnalyticsPage; 