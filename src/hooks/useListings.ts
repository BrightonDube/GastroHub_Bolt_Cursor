import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Listing, ListingInsert, ListingUpdate } from '../types';

/**
 * Infinite listings hook for marketplace with filters and pagination.
 * @param {object} params - searchTerm, category, sortBy
 */
export function useListingsInfinite({ searchTerm, category, sortBy }: {
  searchTerm?: string;
  category?: string;
  sortBy?: string;
} = {}) {
  const PAGE_SIZE = 16;
  return useInfiniteQuery<Listing[], Error>({
    queryKey: ['listings', 'infinite', { searchTerm, category, sortBy }],
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // If we got less than PAGE_SIZE, no more pages
      if (!lastPage || lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length;
    },
    // Fix: pageParam is unknown, must cast to number
    queryFn: async ({ pageParam = 0 }) => {
      const page = typeof pageParam === 'number' ? pageParam : Number(pageParam) || 0;
      let query = supabase
        .from('listing')
        .select('*')
        .eq('availability', 'available')
        .order('created_at', { ascending: true })
        .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
      if (searchTerm) query = query.ilike('title', `%${searchTerm}%`);
      if (category) query = query.eq('category_id', category);
      // Sorting
      if (sortBy === 'price-low') query = query.order('price', { ascending: true });
      else if (sortBy === 'price-high') query = query.order('price', { ascending: false });
      else if (sortBy === 'newest') query = query.order('created_at', { ascending: true });
      // Default: relevance or fallback
      const { data, error } = await query;
      if (error) throw error;
      // Assume DB columns match Listing interface (see types.ts)
      return (data as Listing[]) || [];
    },
  });
}


/**
 * Fetch all active listings for the marketplace
 */
export function useListings() {
  return useQuery<Listing[], Error>({
    queryKey: ['listings', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listing')
        .select('*')
        .eq('availability', 'available')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch featured listings for the marketplace (fallback: latest 8 active listings)
 * If a 'featured' flag exists, use .eq('featured', true). Otherwise, use .limit(8).
 */
export function useFeaturedListings() {
  return useQuery<Listing[], Error>({
    queryKey: ['listings', 'featured'],
    queryFn: async () => {
      // If you add a 'featured' column to Listing table, use .eq('featured', true)
      const { data, error } = await supabase
        .from('listing')
        .select('*')
        .eq('availability', 'available')
        .order('created_at', { ascending: true })
        .limit(8);
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useSupplierListings(supplierId: string) {
  return useQuery({
    queryKey: ['listings', 'supplier', supplierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listing')
        .select('*')
        .eq('supplier_id', supplierId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useListing(listingId: string) {
  return useQuery({
    queryKey: ['listing', listingId],
    queryFn: async () => {
      const { data, error } = await supabase
        
        .select('*')
        .eq('id', listingId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!listingId,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listing: ListingInsert) => {
      const { data, error } = await supabase
        
        .insert(listing)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['listings', 'supplier', data.supplier_id] });
    },
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: ListingUpdate & { id: string }) => {
      const { data, error } = await supabase
        
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['listings', 'supplier', data.supplier_id] });
      queryClient.invalidateQueries({ queryKey: ['listing', data.id] });
    },
  });
}

export function useToggleListingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, availability }: { id: string; availability: string }) => {
      const { data, error } = await supabase
        
        .update({ availability })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['listings', 'supplier', data.supplier_id] });
    },
  });
}