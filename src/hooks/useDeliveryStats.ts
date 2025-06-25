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
      // Example: Replace with real queries/aggregates as needed
      const { count: activeDrivers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'DELIVERY_PARTNER')
        .eq('is_verified', true);

      const { count: deliveriesToday } = await supabase
        .from('delivery_tasks')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date().toISOString().slice(0, 10));

      // For demo: fetch average rating and on-time rate from a stats table or aggregate
      // Replace with real logic as needed
      const avgRating = 4.8; // TODO: Calculate from reviews
      const onTimeRate = 96.5; // TODO: Calculate from delivery_tasks

      return {
        activeDrivers: activeDrivers || 0,
        deliveriesToday: deliveriesToday || 0,
        avgRating,
        onTimeRate,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}
