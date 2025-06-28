import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface InteractiveChartProps {
  type: 'line' | 'area' | 'bar' | 'pie';
  data: ChartData[];
  height?: number;
  colors?: string[];
  xAxisKey?: string;
  yAxisKey?: string;
  title?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  currency?: boolean;
}

const DEFAULT_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#84CC16'  // Lime
];

export function InteractiveChart({
  type,
  data,
  height = 300,
  colors = DEFAULT_COLORS,
  xAxisKey = 'name',
  yAxisKey = 'value',
  title,
  showLegend = true,
  showTooltip = true,
  currency = false
}: InteractiveChartProps) {
  const formatTooltipValue = (value: any) => {
    if (currency && typeof value === 'number') {
      return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR'
      }).format(value);
    }
    return value;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-gray-100">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${formatTooltipValue(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey={xAxisKey} 
              className="text-sm text-gray-600 dark:text-gray-400"
            />
            <YAxis 
              className="text-sm text-gray-600 dark:text-gray-400"
              tickFormatter={currency ? (value) => `R${value}` : undefined}
            />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            <Line 
              type="monotone" 
              dataKey={yAxisKey} 
              stroke={colors[0]} 
              strokeWidth={3}
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2 }}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey={xAxisKey} 
              className="text-sm text-gray-600 dark:text-gray-400"
            />
            <YAxis 
              className="text-sm text-gray-600 dark:text-gray-400"
              tickFormatter={currency ? (value) => `R${value}` : undefined}
            />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            <Area 
              type="monotone" 
              dataKey={yAxisKey} 
              stroke={colors[0]} 
              fill={colors[0]}
              fillOpacity={0.3}
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey={xAxisKey} 
              className="text-sm text-gray-600 dark:text-gray-400"
            />
            <YAxis 
              className="text-sm text-gray-600 dark:text-gray-400"
              tickFormatter={currency ? (value) => `R${value}` : undefined}
            />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            <Bar 
              dataKey={yAxisKey} 
              fill={colors[0]}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={yAxisKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            {showTooltip && <Tooltip formatter={(value) => formatTooltipValue(value)} />}
            {showLegend && <Legend />}
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}

// Specialized chart components for common use cases
export function RevenueChart({ data, height = 300 }: { data: ChartData[]; height?: number }) {
  return (
    <InteractiveChart
      type="area"
      data={data}
      height={height}
      currency={true}
      title="Revenue Trends"
      colors={['#10B981']}
    />
  );
}

export function OrdersChart({ data, height = 300 }: { data: ChartData[]; height?: number }) {
  return (
    <InteractiveChart
      type="bar"
      data={data}
      height={height}
      title="Orders Over Time"
      colors={['#3B82F6']}
    />
  );
}

export function CategorySpendingChart({ data, height = 300 }: { data: ChartData[]; height?: number }) {
  return (
    <InteractiveChart
      type="pie"
      data={data}
      height={height}
      currency={true}
      title="Spending by Category"
    />
  );
}

export function PerformanceChart({ data, height = 300 }: { data: ChartData[]; height?: number }) {
  return (
    <InteractiveChart
      type="line"
      data={data}
      height={height}
      title="Performance Metrics"
      colors={['#F59E0B']}
    />
  );
} 