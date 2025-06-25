import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

/**
 * Fetch delivery service coverage areas for the DeliveryPage.
 * Returns: city, drivers, avgTime, coverage.
 */
export function useServiceAreas() {
  return useQuery({
    queryKey: ['service-areas'],
    queryFn: async () => {
      // Example: Replace with real queries/aggregates as needed
      const { data, error } = await supabase
        .from('delivery_zone')
        .select('zone_name, cities, estimated_delivery_hours, is_active');
      if (error) throw error;
      // Map to expected format for UI
      return (data || []).map((zone: any) => ({
        city: zone.zone_name,
        drivers: zone.cities?.length || 0, // Replace with real driver count if available
        avgTime: zone.estimated_delivery_hours ? `${zone.estimated_delivery_hours} min` : 'N/A',
        coverage: zone.is_active ? 'Active' : 'Inactive',
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}
