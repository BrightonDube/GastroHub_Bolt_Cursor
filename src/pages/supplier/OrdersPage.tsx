import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSupplierOrders } from '../../hooks/useOrders';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { 
  Eye, 
  Filter, 
  Download,
  Clock,
  CheckCircle,
  Package,
  Truck,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { OrderStatus } from '../../types';

const orderTabs = [
  { id: '', label: 'All Orders', icon: Package },
  { id: 'pending', label: 'Pending', icon: Clock },
  { id: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { id: 'preparing', label: 'Preparing', icon: Package },
  { id: 'ready_for_pickup', label: 'Ready', icon: Truck },
  { id: 'delivered', label: 'Completed', icon: CheckCircle },
  { id: 'cancelled', label: 'Cancelled', icon: XCircle },
];

export function OrdersPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<OrderStatus | ''>('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data: orders, isLoading, error } = useSupplierOrders(
    user?.id || '', 
    activeTab || undefined
  );

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
      case 'preparing':
        return 'primary';
      case 'ready_for_pickup':
        return 'secondary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'preparing':
        return <Package className="w-4 h-4" />;
      case 'ready_for_pickup':
        return <Truck className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const sortedOrders = orders?.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case 'amount':
        comparison = Number(a.total_amount) - Number(b.total_amount);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  const getOrderStats = () => {
    if (!orders) return { total: 0, pending: 0, completed: 0, revenue: 0 };
    
    return {
      total: orders.length,
      pending: orders.filter(o => ['pending', 'confirmed', 'preparing'].includes(o.status)).length,
      completed: orders.filter(o => o.status === 'delivered').length,
      revenue: orders
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + Number(o.total_amount), 0),
    };
  };

  const stats = getOrderStats();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="lg" text="Loading orders..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-error-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Error Loading Orders</h3>
          <p className="text-neutral-600">Please try refreshing the page.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-neutral-900">
              Order Management
            </h1>
            <p className="text-neutral-600 mt-1">
              Track and manage your incoming orders
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Total Orders</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-primary-600" />
            </div>
          </Card>
          <Card padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Pending</p>
                <p className="text-2xl font-bold text-warning-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-warning-600" />
            </div>
          </Card>
          <Card padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Completed</p>
                <p className="text-2xl font-bold text-success-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success-600" />
            </div>
          </Card>
          <Card padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Revenue</p>
                <p className="text-2xl font-bold text-neutral-900">${stats.revenue.toFixed(2)}</p>
              </div>
              <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center">
                <span className="text-secondary-600 font-bold">$</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {orderTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const count = tab.id === '' ? orders?.length : orders?.filter(o => o.status === tab.id).length;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as OrderStatus | '')}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    isActive
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {count !== undefined && (
                    <Badge variant={isActive ? 'primary' : 'default'} size="sm">
                      {count}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Orders Table */}
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    <button
                      onClick={() => {
                        setSortBy('amount');
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      }}
                      className="flex items-center space-x-1 hover:text-neutral-700"
                    >
                      <span>Amount</span>
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    <button
                      onClick={() => {
                        setSortBy('date');
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      }}
                      className="flex items-center space-x-1 hover:text-neutral-700"
                    >
                      <span>Date</span>
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {sortedOrders?.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900">
                        #{order.id.slice(0, 8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">
                        {order.buyer?.first_name} {order.buyer?.last_name}
                      </div>
                      <div className="text-sm text-neutral-500">
                        {order.buyer?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-neutral-900">
                        {order.order_items?.length || 0} items
                      </div>
                      <div className="text-sm text-neutral-500">
                        {order.order_items?.slice(0, 2).map(item => item.product?.name).join(', ')}
                        {(order.order_items?.length || 0) > 2 && '...'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900">
                        ${Number(order.total_amount).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusColor(order.status) as any} className="flex items-center space-x-1">
                        {getStatusIcon(order.status)}
                        <span>{order.status.replace('_', ' ')}</span>
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <Link to={`/supplier/orders/${order.id}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(!sortedOrders || sortedOrders.length === 0) && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                No orders found
              </h3>
              <p className="text-neutral-600">
                {activeTab ? `No ${activeTab.replace('_', ' ')} orders at the moment.` : 'You haven\'t received any orders yet.'}
              </p>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default OrdersPage;