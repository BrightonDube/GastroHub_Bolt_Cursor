import { supabase } from '../lib/supabase';
import { AuthUser } from '../types';
import { ShoppingCart, Package, DollarSign, Truck, TrendingUp, Users } from 'lucide-react';
import React from 'react';

/**
 * Fetches dashboard statistics for a user based on their role
 * Falls back to default stats if there's an error or no data
 * 
 * @param user The authenticated user
 * @returns Promise resolving to stats array for dashboard
 */
export async function getStats(user: AuthUser) {
  if (!user) {
    console.error('[Dashboard] No user provided to getStats');
    return getDefaultStats('authenticated');
  }
  
  // Use the business role from profiles if available
  const role = user.profiles?.role || user.role;
  
  try {
    // Role-specific data fetching from appropriate tables
    switch(role) {
      case 'buyer':
        return await getBuyerStats(user.id);
      case 'supplier':
        return await getSupplierStats(user.id);
      case 'delivery_partner':
        return await getDeliveryStats(user.id);
      case 'super_admin':
        return await getSuperAdminStats();
      default:
        return getDefaultStats(role);
    }
  } catch (error) {
    console.error('[Dashboard] Error fetching stats:', error);
    return getDefaultStats(role);
  }
}

/**
 * Gets default statistics when real data can't be fetched
 * Provides role-appropriate mock data
 * 
 * @param role User role
 * @returns Array of dashboard stat objects
 */
export function getDefaultStats(role: string) {
  // Default mock data for when DB fetch fails or user is new
  switch(role) {
    case 'buyer':
      return [
        {
          title: 'Total Orders',
          value: '0',
          change: { value: 0, type: 'neutral' },
          icon: React.createElement(ShoppingCart, { className: "w-6 h-6 text-primary-600" }),
          color: 'primary',
        },
        {
          title: 'Recent Purchases',
          value: '0',
          change: { value: 0, type: 'neutral' },
          icon: React.createElement(Package, { className: "w-6 h-6 text-primary-600" }),
          color: 'secondary',
        },
        {
          title: 'Total Spent',
          value: '$0',
          change: { value: 0, type: 'neutral' },
          icon: React.createElement(DollarSign, { className: "w-6 h-6 text-primary-600" }),
          color: 'success',
        },
        {
          title: 'Active Carts',
          value: '0',
          change: { value: 0, type: 'neutral' },
          icon: React.createElement(ShoppingCart, { className: "w-6 h-6 text-primary-600" }),
          color: 'warning',
        },
      ];
    case 'supplier':
      return [
        {
          title: 'Active Listings',
          value: '0',
          change: { value: 0, type: 'neutral' },
          icon: React.createElement(Package, { className: "w-6 h-6 text-primary-600" }),
          color: 'primary',
        },
        {
          title: 'Orders Received',
          value: '0',
          change: { value: 0, type: 'neutral' },
          icon: React.createElement(ShoppingCart, { className: "w-6 h-6 text-primary-600" }),
          color: 'secondary',
        },
        {
          title: 'Total Revenue',
          value: '$0',
          change: { value: 0, type: 'neutral' },
          icon: React.createElement(DollarSign, { className: "w-6 h-6 text-primary-600" }),
          color: 'success',
        },
        {
          title: 'Buyer Views',
          value: '0',
          change: { value: 0, type: 'neutral' },
          icon: React.createElement(Users, { className: "w-6 h-6 text-primary-600" }),
          color: 'warning',
        },
      ];
    case 'delivery_partner':
      return [
        {
          title: 'Active Deliveries',
          value: '0',
          change: { value: 0, type: 'neutral' },
          icon: React.createElement(Truck, { className: "w-6 h-6 text-primary-600" }),
          color: 'primary',
        },
        {
          title: 'Completed Deliveries',
          value: '0',
          change: { value: 0, type: 'neutral' },
          icon: React.createElement(Package, { className: "w-6 h-6 text-primary-600" }),
          color: 'secondary',
        },
        {
          title: 'Total Earnings',
          value: '$0',
          change: { value: 0, type: 'neutral' },
          icon: React.createElement(DollarSign, { className: "w-6 h-6 text-primary-600" }),
          color: 'success',
        },
        {
          title: 'Rating',
          value: '0.0',
          change: { value: 0, type: 'neutral' },
          icon: React.createElement(TrendingUp, { className: "w-6 h-6 text-primary-600" }),
          color: 'warning',
        },
      ];
    case 'super_admin':
      return [
        {
          title: 'Total Users',
          value: '0',
          change: { value: 0, type: 'neutral' },
          icon: React.createElement(Users, { className: "w-6 h-6 text-primary-600" }),
          color: 'primary',
        },
        {
          title: 'Total Orders',
          value: '0',
          change: { value: 0, type: 'neutral' },
          icon: React.createElement(ShoppingCart, { className: "w-6 h-6 text-primary-600" }),
          color: 'secondary',
        },
        {
          title: 'Platform Revenue',
          value: '$0',
          change: { value: 0, type: 'neutral' },
          icon: React.createElement(DollarSign, { className: "w-6 h-6 text-primary-600" }),
          color: 'success',
        },
        {
          title: 'Active Deliveries',
          value: '0',
          change: { value: 0, type: 'neutral' },
          icon: React.createElement(Truck, { className: "w-6 h-6 text-primary-600" }),
          color: 'warning',
        },
      ];
    default:
      return [
        {
          title: 'Dashboard Data',
          value: 'Unavailable',
          change: { value: 0, type: 'neutral' },
          icon: React.createElement(Package, { className: "w-6 h-6 text-primary-600" }),
          color: 'primary',
        },
        {
          title: 'Status',
          value: 'Login Required',
          change: { value: 0, type: 'neutral' },
          icon: React.createElement(Users, { className: "w-6 h-6 text-primary-600" }),
          color: 'warning',
        },
      ];
  }
}

/**
 * Fetches buyer-specific statistics
 * @param userId The user ID
 * @returns Array of dashboard stat objects
 */
async function getBuyerStats(userId: string) {
  try {
    // Get basic order stats
    const { data: orderStats, error: orderError } = await supabase.rpc('get_buyer_order_stats', {
      buyer_id: userId
    });
    
    if (orderError) throw orderError;
    
    // Return formatted stats
    return [
      {
        title: 'Total Orders',
        value: orderStats?.total_orders?.toString() || '0',
        change: { value: orderStats?.orders_change || 0, type: getChangeType(orderStats?.orders_change) },
        icon: React.createElement(ShoppingCart, { className: "w-6 h-6 text-primary-600" }),
        color: 'primary',
      },
      {
        title: 'Recent Purchases',
        value: orderStats?.recent_orders?.toString() || '0',
        change: { value: 0, type: 'neutral' },
        icon: React.createElement(Package, { className: "w-6 h-6 text-primary-600" }),
        color: 'secondary',
      },
      {
        title: 'Total Spent',
        value: `$${orderStats?.total_spent?.toFixed(2) || '0.00'}`,
        change: { value: orderStats?.spent_change || 0, type: getChangeType(orderStats?.spent_change) },
        icon: React.createElement(DollarSign, { className: "w-6 h-6 text-primary-600" }),
        color: 'success',
      },
      {
        title: 'Active Carts',
        value: orderStats?.active_carts?.toString() || '0',
        change: { value: 0, type: 'neutral' },
        icon: React.createElement(ShoppingCart, { className: "w-6 h-6 text-primary-600" }),
        color: 'warning',
      },
    ];
  } catch (error) {
    console.error('[Dashboard] Error fetching buyer stats:', error);
    return getDefaultStats('buyer');
  }
}

/**
 * Fetches supplier-specific statistics
 * @param userId The user ID
 * @returns Array of dashboard stat objects
 */
async function getSupplierStats(userId: string) {
  try {
    // Get basic supplier stats
    const { data: supplierStats, error: statsError } = await supabase.rpc('get_supplier_stats', {
      supplier_id: userId
    });
    
    if (statsError) throw statsError;
    
    // Return formatted stats
    return [
      {
        title: 'Active Listings',
        value: supplierStats?.active_listings?.toString() || '0',
        change: { value: supplierStats?.listings_change || 0, type: getChangeType(supplierStats?.listings_change) },
        icon: React.createElement(Package, { className: "w-6 h-6 text-primary-600" }),
        color: 'primary',
      },
      {
        title: 'Orders Received',
        value: supplierStats?.orders_received?.toString() || '0',
        change: { value: supplierStats?.orders_change || 0, type: getChangeType(supplierStats?.orders_change) },
        icon: React.createElement(ShoppingCart, { className: "w-6 h-6 text-primary-600" }),
        color: 'secondary',
      },
      {
        title: 'Total Revenue',
        value: `$${supplierStats?.total_revenue?.toFixed(2) || '0.00'}`,
        change: { value: supplierStats?.revenue_change || 0, type: getChangeType(supplierStats?.revenue_change) },
        icon: React.createElement(DollarSign, { className: "w-6 h-6 text-primary-600" }),
        color: 'success',
      },
      {
        title: 'Buyer Views',
        value: supplierStats?.total_views?.toString() || '0',
        change: { value: supplierStats?.views_change || 0, type: getChangeType(supplierStats?.views_change) },
        icon: React.createElement(Users, { className: "w-6 h-6 text-primary-600" }),
        color: 'warning',
      },
    ];
  } catch (error) {
    console.error('[Dashboard] Error fetching supplier stats:', error);
    return getDefaultStats('supplier');
  }
}

/**
 * Fetches delivery-specific statistics
 * @param userId The user ID
 * @returns Array of dashboard stat objects
 */
async function getDeliveryStats(userId: string) {
  try {
    // Get delivery stats
    const { data: deliveryStats, error: statsError } = await supabase.rpc('get_delivery_stats', {
      delivery_id: userId
    });
    
    if (statsError) throw statsError;
    
    // Return formatted stats
    return [
      {
        title: 'Active Deliveries',
        value: deliveryStats?.active_deliveries?.toString() || '0',
        change: { value: deliveryStats?.active_change || 0, type: getChangeType(deliveryStats?.active_change) },
        icon: React.createElement(Truck, { className: "w-6 h-6 text-primary-600" }),
        color: 'primary',
      },
      {
        title: 'Completed Deliveries',
        value: deliveryStats?.completed_deliveries?.toString() || '0',
        change: { value: deliveryStats?.completed_change || 0, type: getChangeType(deliveryStats?.completed_change) },
        icon: React.createElement(Package, { className: "w-6 h-6 text-primary-600" }),
        color: 'secondary',
      },
      {
        title: 'Total Earnings',
        value: `$${deliveryStats?.total_earnings?.toFixed(2) || '0.00'}`,
        change: { value: deliveryStats?.earnings_change || 0, type: getChangeType(deliveryStats?.earnings_change) },
        icon: React.createElement(DollarSign, { className: "w-6 h-6 text-primary-600" }),
        color: 'success',
      },
      {
        title: 'Rating',
        value: deliveryStats?.rating?.toFixed(1) || '0.0',
        change: { value: deliveryStats?.rating_change || 0, type: getChangeType(deliveryStats?.rating_change) },
        icon: React.createElement(TrendingUp, { className: "w-6 h-6 text-primary-600" }),
        color: 'warning',
      },
    ];
  } catch (error) {
    console.error('[Dashboard] Error fetching delivery stats:', error);
    return getDefaultStats('delivery_partner');
  }
}

/**
 * Fetches super admin statistics
 * @returns Array of dashboard stat objects
 */
async function getSuperAdminStats() {
  try {
    // Get platform-wide stats
    const { data: adminStats, error: statsError } = await supabase.rpc('get_admin_platform_stats');
    
    if (statsError) throw statsError;
    
    // Return formatted stats
    return [
      {
        title: 'Total Users',
        value: adminStats?.total_users?.toString() || '0',
        change: { value: adminStats?.users_change || 0, type: getChangeType(adminStats?.users_change) },
        icon: React.createElement(Users, { className: "w-6 h-6 text-primary-600" }),
        color: 'primary',
      },
      {
        title: 'Total Orders',
        value: adminStats?.total_orders?.toString() || '0',
        change: { value: adminStats?.orders_change || 0, type: getChangeType(adminStats?.orders_change) },
        icon: React.createElement(ShoppingCart, { className: "w-6 h-6 text-primary-600" }),
        color: 'secondary',
      },
      {
        title: 'Platform Revenue',
        value: `$${adminStats?.platform_revenue?.toFixed(2) || '0.00'}`,
        change: { value: adminStats?.revenue_change || 0, type: getChangeType(adminStats?.revenue_change) },
        icon: React.createElement(DollarSign, { className: "w-6 h-6 text-primary-600" }),
        color: 'success',
      },
      {
        title: 'Active Deliveries',
        value: adminStats?.active_deliveries?.toString() || '0',
        change: { value: adminStats?.deliveries_change || 0, type: getChangeType(adminStats?.deliveries_change) },
        icon: React.createElement(Truck, { className: "w-6 h-6 text-primary-600" }),
        color: 'warning',
      },
    ];
  } catch (error) {
    console.error('[Dashboard] Error fetching admin stats:', error);
    return getDefaultStats('super_admin');
  }
}

/**
 * Helper function to determine type of change (increase/decrease/neutral)
 * @param value Change value
 * @returns String representing change type
 */
function getChangeType(value: number | null | undefined) {
  if (!value || value === 0) return 'neutral';
  return value > 0 ? 'increase' : 'decrease';
}
