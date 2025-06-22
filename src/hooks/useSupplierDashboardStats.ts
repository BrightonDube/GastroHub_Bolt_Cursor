import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../App';

/**
 * Fetches supplier dashboard stats, recent listings, and revenue from the database.
 * All values are fetched live from Supabase.
 */
export function useSupplierDashboardStats() {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ['supplier-dashboard-stats', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');

      // 1. Dashboard stats
      // a) Total Listings
      const { count: totalListings } = await supabase
        .from('listing')
        .select('*', { count: 'exact', head: true })
        .eq('supplier_id', user.id);

      // b) Total Orders Received
      const { count: totalOrders } = await supabase
        .from('order')
        .select('*', { count: 'exact', head: true })
        .eq('supplier_id', user.id);

      // c) Completed Deliveries
      const { count: completedDeliveries, data: completedOrders } = await supabase
        .from('order')
        .select('total_amount', { count: 'exact' })
        .eq('supplier_id', user.id)
        .eq('status', 'delivered');

      // d) Total Revenue (sum of total_amount for delivered orders)
      let totalRevenue = 0;
      if (completedOrders) {
        totalRevenue = completedOrders.reduce(
          (sum: number, order: any) => sum + (Number(order.total_amount) || 0),
          0
        );
      }

      // 2. Recent Listings (last 3)
      const { data: recentListings } = await supabase
        .from('listing')
        .select('id, name, category, price, status, created_at')
        .eq('supplier_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      const stats = [
        {
          title: 'Total Listings',
          value: totalListings || 0,
          icon: null,
          color: 'primary',
        },
        {
          title: 'Total Orders',
          value: totalOrders || 0,
          icon: null,
          color: 'secondary',
        },
        {
          title: 'Total Revenue',
          value: `$${totalRevenue.toLocaleString()}`,
          icon: null,
          color: 'success',
        },
        {
          title: 'Completed Deliveries',
          value: completedDeliveries || 0,
          icon: null,
          color: 'warning',
        },
      ];

      return {
        stats,
        recentListings: recentListings || [],
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
