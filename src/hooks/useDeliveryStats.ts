import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

/**
 * Fetch delivery network stats for the DeliveryPage.
 * Returns: active drivers, deliveries today, average rating, on-time rate.
 */
export function useDeliveryStats() {
  return useQuery({
    queryKey: ['delivery-stats'],
    queryFn: async () => {
      // Get active delivery partners
      const { count: activeDrivers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'delivery_partner');

      // Get deliveries today
      const today = new Date().toISOString().slice(0, 10);
      const { count: deliveriesToday } = await supabase
        .from('order')
        .select('*', { count: 'exact', head: true })
        .not('delivery_partner_id', 'is', null)
        .gte('created_at', today);

      // Get completed deliveries for rating calculation
      const { data: completedDeliveries } = await supabase
        .from('order')
        .select('id')
        .eq('status', 'DELIVERED')
        .not('delivery_partner_id', 'is', null);

      // Get average rating from delivery_ratings
      const { data: ratingsData } = await supabase
        .from('delivery_ratings')
        .select('rating');

      const avgRating = ratingsData && ratingsData.length > 0 
        ? ratingsData.reduce((sum, r) => sum + (r.rating || 0), 0) / ratingsData.length 
        : 0;

      // Calculate on-time rate
      const { data: onTimeData } = await supabase
        .from('order')
        .select('estimated_delivery_date, delivered_at')
        .eq('status', 'DELIVERED')
        .not('delivered_at', 'is', null)
        .not('estimated_delivery_date', 'is', null);

      let onTimeRate = 0;
      if (onTimeData && onTimeData.length > 0) {
        const onTimeDeliveries = onTimeData.filter(order => {
          if (!order.delivered_at || !order.estimated_delivery_date) return false;
          return new Date(order.delivered_at) <= new Date(order.estimated_delivery_date);
        });
        onTimeRate = (onTimeDeliveries.length / onTimeData.length) * 100;
      }

      return {
        activeDrivers: activeDrivers || 0,
        deliveriesToday: deliveriesToday || 0,
        avgRating: Number(avgRating.toFixed(1)),
        onTimeRate: Number(onTimeRate.toFixed(1)),
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for delivery partners to get their assigned orders
 */
export function useDeliveryPartnerOrders(deliveryPartnerId?: string) {
  return useQuery({
    queryKey: ['delivery-partner-orders', deliveryPartnerId],
    queryFn: async () => {
      if (!deliveryPartnerId) return [];

      const { data, error } = await supabase
        .from('order')
        .select(`
          *,
          buyer:profiles!buyer_id(full_name, phone),
          supplier:profiles!supplier_id(full_name, phone),
          order_items:order_item(
            quantity,
            unit_price,
            total_price,
            listing:listing(title, unit)
          )
        `)
        .eq('delivery_partner_id', deliveryPartnerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!deliveryPartnerId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to get available orders for delivery assignment
 */
export function useAvailableOrdersForDelivery() {
  return useQuery({
    queryKey: ['available-orders-delivery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order')
        .select(`
          *,
          buyer:profiles!buyer_id(full_name, phone),
          supplier:profiles!supplier_id(full_name, phone),
          order_items:order_item(
            quantity,
            unit_price,
            total_price,
            listing:listing(title, unit)
          )
        `)
        .is('delivery_partner_id', null)
        .in('status', ['APPROVED', 'IN_PREPARATION', 'READY_FOR_PICKUP'])
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    staleTime: 1 * 60 * 1000,
  });
}

/**
 * Hook to get delivery zones
 */
export function useDeliveryZones() {
  return useQuery({
    queryKey: ['delivery-zones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('delivery_zone')
        .select('*')
        .eq('is_active', true)
        .order('zone_name');

      if (error) throw error;
      return data || [];
    },
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook for delivery partner analytics
 */
export function useDeliveryPartnerAnalytics(deliveryPartnerId?: string) {
  return useQuery({
    queryKey: ['delivery-partner-analytics', deliveryPartnerId],
    queryFn: async () => {
      if (!deliveryPartnerId) return null;

      // Get delivery stats
      const { data: orders } = await supabase
        .from('order')
        .select('*')
        .eq('delivery_partner_id', deliveryPartnerId);

      const { data: ratings } = await supabase
        .from('delivery_ratings')
        .select('rating, comment, created_at')
        .eq('delivery_partner_id', deliveryPartnerId)
        .order('created_at', { ascending: false });

      const totalDeliveries = orders?.length || 0;
      const completedDeliveries = orders?.filter(o => o.status === 'DELIVERED').length || 0;
      const avgRating = ratings && ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length 
        : 0;

      // Calculate earnings (sum of delivery fees)
      const totalEarnings = orders?.reduce((sum, order) => sum + (order.delivery_fee || 0), 0) || 0;

      // Calculate on-time deliveries
      const onTimeDeliveries = orders?.filter(order => {
        if (!order.delivered_at || !order.estimated_delivery_date || order.status !== 'DELIVERED') return false;
        return new Date(order.delivered_at) <= new Date(order.estimated_delivery_date);
      }).length || 0;

      const onTimeRate = completedDeliveries > 0 ? (onTimeDeliveries / completedDeliveries) * 100 : 0;

      return {
        totalDeliveries,
        completedDeliveries,
        avgRating: Number(avgRating.toFixed(1)),
        totalEarnings,
        onTimeRate: Number(onTimeRate.toFixed(1)),
        recentRatings: ratings?.slice(0, 10) || [],
      };
    },
    enabled: !!deliveryPartnerId,
    staleTime: 5 * 60 * 1000,
  });
}
