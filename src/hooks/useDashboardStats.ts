import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../App';

/**
 * Fetches buyer dashboard stats, recent orders, and favorite suppliers from the database.
 * All values are fetched live from Supabase.
 */
export function useBuyerDashboardStats() {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ['buyer-dashboard-stats', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');

      // 1. Dashboard stats: totalOrders, totalSpent, completedDeliveries
      const { count: totalOrders } = await supabase
        .from('order')
        .select('*', { count: 'exact', head: true })
        .eq('buyer_id', user.id);

      const { data: completedOrders, count: completedDeliveries } = await supabase
        .from('order')
        .select('amount', { count: 'exact' })
        .eq('buyer_id', user.id)
        .eq('status', 'delivered');

      // Calculate total spent by summing up delivered order amounts
      let totalSpent = 0;
      if (completedOrders) {
        totalSpent = completedOrders.reduce(
          (sum: number, order: any) => sum + (Number(order.amount) || 0),
          0
        );
      }

      // 2. Recent orders (last 3)
      const { data: recentOrders } = await supabase
        .from('order')
        .select('id, created_at, amount, status, supplier_id, orderitem:orderitem_id(*,product:product_id(name))')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      // 3. Favorite suppliers (from favorite table, target_type = 'supplier')
      const { data: favorites } = await supabase
        .from('favorite')
        .select('target_id')
        .eq('user_id', user.id)
        .eq('target_type', 'supplier');

      let favoriteSuppliers: any[] = [];
      if (favorites && favorites.length > 0) {
        const supplierIds = favorites.map(f => f.target_id);
        const { data: suppliers } = await supabase
          .from('profiles')
          .select('id, business_name, category, rating')
          .in('id', supplierIds);
        favoriteSuppliers = suppliers || [];
      }

      // Format stats for DashboardStats component
      const stats = [
        {
          title: 'Total Orders',
          value: totalOrders || 0,
          icon: null, // Add icons in the page if needed
          color: 'primary',
        },
        {
          title: 'Total Spent',
          value: `$${totalSpent.toLocaleString()}`,
          icon: null,
          color: 'success',
        },
        {
          title: 'Completed Deliveries',
          value: completedDeliveries || 0,
          icon: null,
          color: 'secondary',
        },
      ];

      return {
        stats,
        recentOrders: recentOrders || [],
        favoriteSuppliers,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
