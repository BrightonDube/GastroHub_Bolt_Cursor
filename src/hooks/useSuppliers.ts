import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

/**
 * Fetch all supplier profiles for the public suppliers directory.
 * Supports search, category, and location filters.
 */
export function useSuppliers({ searchTerm = '', category = '', location = '' } = {}) {
  return useQuery({
    queryKey: ['suppliers', { searchTerm, category, location }],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'SUPPLIER');

      if (searchTerm) {
        query = query.ilike('business_name', `%${searchTerm}%`);
      }
      if (category) {
        query = query.ilike('category', `%${category}%`);
      }
      if (location) {
        query = query.ilike('location', `%${location}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
