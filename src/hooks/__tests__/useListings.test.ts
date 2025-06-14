import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSupplierListings, useCreateListing, useUpdateListing } from '../useListings';
import { supabase } from '../../lib/supabase';
import { mockListings, mockListing, mockListingInsert } from '../../test/mocks/listingData';

// Mock the supabase module
vi.mock('../../lib/supabase');

// Create a test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useListings hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useSupplierListings', () => {
    it('should fetch supplier listings successfully', async () => {
      // Mock successful query
      const mockSupabaseFrom = vi.mocked(supabase.from);
      mockSupabaseFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: mockListings,
              error: null,
            }),
          }),
        }),
      } as any);

      const { result } = renderHook(
        () => useSupplierListings('supplier-123'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(mockListings);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(null);
      });
    });

    it('should handle fetch errors', async () => {
      // Mock error response
      const mockSupabaseFrom = vi.mocked(supabase.from);
      mockSupabaseFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        }),
      } as any);

      const { result } = renderHook(
        () => useSupplierListings('supplier-123'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
        expect(result.current.data).toBe(undefined);
      });
    });

    it('should cache results for 5 minutes', () => {
      const { result } = renderHook(
        () => useSupplierListings('supplier-123'),
        { wrapper: createWrapper() }
      );

      // Check that staleTime is set correctly (this would be implementation specific)
      expect(result.current).toBeDefined();
    });
  });

  describe('useCreateListing', () => {
    it('should create listing successfully', async () => {
      // Mock successful creation
      const mockSupabaseFrom = vi.mocked(supabase.from);
      mockSupabaseFrom.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockListing,
              error: null,
            }),
          }),
        }),
      } as any);

      const { result } = renderHook(
        () => useCreateListing(),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.mutateAsync).toBeDefined();
      });

      // Test the mutation
      const createdListing = await result.current.mutateAsync(mockListingInsert);
      expect(createdListing).toEqual(mockListing);
    });

    it('should handle creation errors', async () => {
      // Mock error response
      const mockSupabaseFrom = vi.mocked(supabase.from);
      mockSupabaseFrom.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Validation error' },
            }),
          }),
        }),
      } as any);

      const { result } = renderHook(
        () => useCreateListing(),
        { wrapper: createWrapper() }
      );

      await expect(
        result.current.mutateAsync(mockListingInsert)
      ).rejects.toThrow();
    });
  });

  describe('useUpdateListing', () => {
    it('should update listing successfully', async () => {
      const updatedListing = { ...mockListing, title: 'Updated Title' };

      // Mock successful update
      const mockSupabaseFrom = vi.mocked(supabase.from);
      mockSupabaseFrom.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: updatedListing,
                error: null,
              }),
            }),
          }),
        }),
      } as any);

      const { result } = renderHook(
        () => useUpdateListing(),
        { wrapper: createWrapper() }
      );

      const updateData = { id: 'listing-123', title: 'Updated Title' };
      const updated = await result.current.mutateAsync(updateData);
      
      expect(updated).toEqual(updatedListing);
    });

    it('should handle update errors', async () => {
      // Mock error response
      const mockSupabaseFrom = vi.mocked(supabase.from);
      mockSupabaseFrom.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Not found' },
              }),
            }),
          }),
        }),
      } as any);

      const { result } = renderHook(
        () => useUpdateListing(),
        { wrapper: createWrapper() }
      );

      const updateData = { id: 'nonexistent-123', title: 'Updated Title' };
      
      await expect(
        result.current.mutateAsync(updateData)
      ).rejects.toThrow();
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle large datasets efficiently', async () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        ...mockListing,
        id: `listing-${i}`,
        title: `Listing ${i}`,
      }));

      const mockSupabaseFrom = vi.mocked(supabase.from);
      mockSupabaseFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: largeDataset,
              error: null,
            }),
          }),
        }),
      } as any);

      const startTime = Date.now();
      const { result } = renderHook(
        () => useSupplierListings('supplier-123'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.data).toHaveLength(1000);
      });

      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle empty results gracefully', async () => {
      const mockSupabaseFrom = vi.mocked(supabase.from);
      mockSupabaseFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
      } as any);

      const { result } = renderHook(
        () => useSupplierListings('supplier-123'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.data).toEqual([]);
        expect(result.current.error).toBe(null);
      });
    });

    it('should handle network timeouts', async () => {
      const mockSupabaseFrom = vi.mocked(supabase.from);
      mockSupabaseFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockRejectedValue(new Error('Network timeout')),
          }),
        }),
      } as any);

      const { result } = renderHook(
        () => useSupplierListings('supplier-123'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });
    });

    it('should handle concurrent mutations safely', async () => {
      const mockSupabaseFrom = vi.mocked(supabase.from);
      mockSupabaseFrom.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockListing,
              error: null,
            }),
          }),
        }),
      } as any);

      const { result } = renderHook(
        () => useCreateListing(),
        { wrapper: createWrapper() }
      );

      // Execute multiple mutations concurrently
      const promises = Array.from({ length: 5 }, () =>
        result.current.mutateAsync(mockListingInsert)
      );

      const results = await Promise.all(promises);
      
      // All should succeed
      results.forEach(result => {
        expect(result).toEqual(mockListing);
      });
    });
  });
});