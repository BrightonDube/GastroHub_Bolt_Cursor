import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OrderService } from '../orderService';
import { supabase } from '../../lib/supabase';
import { 
  mockOrderRequest, 
  mockInvalidOrderRequest, 
  mockProducts, 
  mockUnavailableProducts,
  mockOrder 
} from '../../test/mocks/orderData';

// Mock the supabase module
vi.mock('../../lib/supabase');

describe('OrderService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset crypto mock
    vi.mocked(crypto.randomUUID).mockReturnValue('test-uuid-123');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createOrder', () => {
    it('should create order successfully with valid data', async () => {
      // Mock database responses
      const mockSupabaseFrom = vi.mocked(supabase.from);
      
      // Mock inventory check
      mockSupabaseFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({
            data: mockProducts,
            error: null,
          }),
        }),
      } as any);

      // Mock order insertion
      mockSupabaseFrom.mockReturnValueOnce({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockOrder,
              error: null,
            }),
          }),
        }),
      } as any);

      // Mock order items insertion
      mockSupabaseFrom.mockReturnValueOnce({
        insert: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      } as any);

      // Mock buyer order count check
      mockSupabaseFrom.mockReturnValueOnce({
        select: vi.fn().mockResolvedValue({
          count: 0,
          error: null,
        }),
      } as any);

      // Mock product enrichment
      mockSupabaseFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({
            data: mockProducts,
            error: null,
          }),
        }),
      } as any);

      const result = await OrderService.createOrder(mockOrderRequest);

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(201);
      expect(result.data).toBeDefined();
      expect(result.data?.orderId).toBe('test-uuid-123');
      expect(result.data?.totalAmount).toBeGreaterThan(0);
      expect(result.data?.items).toHaveLength(2);
    });

    it('should fail validation with invalid data', async () => {
      const result = await OrderService.createOrder(mockInvalidOrderRequest as any);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(400);
      expect(result.error?.code).toBe('VALIDATION_ERROR');
      expect(result.error?.details).toBeInstanceOf(Array);
      expect(result.error?.details.length).toBeGreaterThan(0);
    });

    it('should fail when inventory is insufficient', async () => {
      // Mock inventory check with unavailable products
      const mockSupabaseFrom = vi.mocked(supabase.from);
      mockSupabaseFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({
            data: mockUnavailableProducts,
            error: null,
          }),
        }),
      } as any);

      const result = await OrderService.createOrder(mockOrderRequest);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(409);
      expect(result.error?.code).toBe('INSUFFICIENT_INVENTORY');
      expect(result.error?.details).toBeInstanceOf(Array);
    });

    it('should handle database errors gracefully', async () => {
      // Mock database error
      const mockSupabaseFrom = vi.mocked(supabase.from);
      mockSupabaseFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database connection failed' },
          }),
        }),
      } as any);

      const result = await OrderService.createOrder(mockOrderRequest);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(500);
      expect(result.error?.code).toBe('INTERNAL_ERROR');
    });

    it('should calculate totals correctly', async () => {
      // Mock successful flow
      const mockSupabaseFrom = vi.mocked(supabase.from);
      
      mockSupabaseFrom
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({ data: mockProducts, error: null }),
          }),
        } as any)
        .mockReturnValueOnce({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockOrder, error: null }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          insert: vi.fn().mockResolvedValue({ data: null, error: null }),
        } as any)
        .mockReturnValueOnce({
          select: vi.fn().mockResolvedValue({ count: 0, error: null }),
        } as any)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({ data: mockProducts, error: null }),
          }),
        } as any);

      const result = await OrderService.createOrder(mockOrderRequest);

      expect(result.success).toBe(true);
      
      const subtotal = 2 * 25.50 + 1 * 15.00; // 66.00
      const tax = subtotal * 0.1; // 6.60
      const shipping = 15; // Under $100, so shipping applies
      const firstTimeDiscount = subtotal * 0.1; // 6.60
      const expectedTotal = subtotal + tax + shipping - firstTimeDiscount; // 66.00 + 6.60 + 15 - 6.60 = 81.00

      expect(result.data?.subtotal).toBe(subtotal);
      expect(result.data?.taxes).toBe(tax);
      expect(result.data?.shippingCost).toBe(shipping);
      expect(result.data?.discountAmount).toBe(firstTimeDiscount);
      expect(result.data?.totalAmount).toBe(expectedTotal);
    });

    it('should apply free shipping for orders over $100', async () => {
      const largeOrderRequest = {
        ...mockOrderRequest,
        items: [
          {
            productId: 'product-1',
            quantity: 5,
            unitPrice: 25.00, // 125.00 total
          },
        ],
      };

      // Mock successful flow
      const mockSupabaseFrom = vi.mocked(supabase.from);
      
      mockSupabaseFrom
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({ data: [mockProducts[0]], error: null }),
          }),
        } as any)
        .mockReturnValueOnce({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockOrder, error: null }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          insert: vi.fn().mockResolvedValue({ data: null, error: null }),
        } as any)
        .mockReturnValueOnce({
          select: vi.fn().mockResolvedValue({ count: 0, error: null }),
        } as any)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({ data: [mockProducts[0]], error: null }),
          }),
        } as any);

      const result = await OrderService.createOrder(largeOrderRequest);

      expect(result.success).toBe(true);
      expect(result.data?.shippingCost).toBe(0); // Free shipping
    });
  });

  describe('processOrder', () => {
    it('should process order through all steps successfully', async () => {
      const orderId = 'test-order-123';

      // Mock order update
      const mockSupabaseFrom = vi.mocked(supabase.from);
      mockSupabaseFrom.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }),
      } as any);

      const result = await OrderService.processOrder(orderId);

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.data?.orderId).toBe(orderId);
      expect(result.data?.currentStep).toBe(6);
      expect(result.data?.steps).toHaveLength(6);
      expect(result.data?.trackingNumber).toBeDefined();
    });

    it('should handle processing failures gracefully', async () => {
      const orderId = 'test-order-123';

      // Mock database error
      const mockSupabaseFrom = vi.mocked(supabase.from);
      mockSupabaseFrom.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockRejectedValue(new Error('Database error')),
        }),
      } as any);

      const result = await OrderService.processOrder(orderId);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(500);
      expect(result.error?.code).toBe('PROCESSING_ERROR');
    });

    it('should track step progress correctly', async () => {
      const orderId = 'test-order-123';

      // Mock successful update
      const mockSupabaseFrom = vi.mocked(supabase.from);
      mockSupabaseFrom.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      } as any);

      const result = await OrderService.processOrder(orderId);

      expect(result.success).toBe(true);
      
      const steps = result.data?.steps || [];
      const completedSteps = steps.filter(step => step.status === 'completed');
      
      expect(completedSteps.length).toBeGreaterThan(0);
      expect(steps[0].stepName).toBe('Verify Payment');
      expect(steps[steps.length - 1].stepName).toBe('Notify Customer');
    });
  });

  describe('updateOrder', () => {
    const mockUpdateRequest = {
      orderId: 'test-order-123',
      updateType: 'status' as const,
      newValue: 'confirmed',
      reason: 'Payment verified',
      notifyCustomer: true,
    };

    it('should update order successfully', async () => {
      // Mock order fetch
      const mockSupabaseFrom = vi.mocked(supabase.from);
      mockSupabaseFrom
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: mockOrder,
                error: null,
              }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }),
        } as any);

      const result = await OrderService.updateOrder(mockUpdateRequest);

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.data?.orderId).toBe(mockUpdateRequest.orderId);
      expect(result.data?.newValue).toBe(mockUpdateRequest.newValue);
      expect(result.data?.previousValue).toBe('pending');
    });

    it('should fail when order not found', async () => {
      // Mock order not found
      const mockSupabaseFrom = vi.mocked(supabase.from);
      mockSupabaseFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Not found' },
            }),
          }),
        }),
      } as any);

      const result = await OrderService.updateOrder(mockUpdateRequest);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(404);
      expect(result.error?.code).toBe('ORDER_NOT_FOUND');
    });

    it('should prevent updates to delivered orders', async () => {
      const deliveredOrder = { ...mockOrder, status: 'delivered' };

      // Mock order fetch
      const mockSupabaseFrom = vi.mocked(supabase.from);
      mockSupabaseFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: deliveredOrder,
              error: null,
            }),
          }),
        }),
      } as any);

      const result = await OrderService.updateOrder(mockUpdateRequest);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(409);
      expect(result.error?.code).toBe('UPDATE_CONFLICT');
    });

    it('should handle different update types correctly', async () => {
      const updateTypes = [
        { type: 'status', value: 'confirmed' },
        { type: 'payment', value: 'paid' },
        { type: 'cancel', value: 'cancelled' },
      ];

      for (const updateType of updateTypes) {
        const updateRequest = {
          ...mockUpdateRequest,
          updateType: updateType.type as any,
          newValue: updateType.value,
        };

        // Mock order fetch and update
        const mockSupabaseFrom = vi.mocked(supabase.from);
        mockSupabaseFrom
          .mockReturnValueOnce({
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: mockOrder,
                  error: null,
                }),
              }),
            }),
          } as any)
          .mockReturnValueOnce({
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }),
          } as any);

        const result = await OrderService.updateOrder(updateRequest);

        expect(result.success).toBe(true);
        expect(result.data?.newValue).toBe(
          updateType.type === 'cancel' ? 'cancelled' : updateType.value
        );
      }
    });
  });

  describe('Helper Methods', () => {
    describe('validateOrderRequest', () => {
      it('should validate correct order request', () => {
        const validation = (OrderService as any).validateOrderRequest(mockOrderRequest);
        
        expect(validation.isValid).toBe(true);
        expect(validation.errors).toHaveLength(0);
      });

      it('should catch validation errors', () => {
        const validation = (OrderService as any).validateOrderRequest(mockInvalidOrderRequest);
        
        expect(validation.isValid).toBe(false);
        expect(validation.errors.length).toBeGreaterThan(0);
        expect(validation.errors).toContain('Buyer ID is required');
      });

      it('should validate item requirements', () => {
        const invalidItems = {
          ...mockOrderRequest,
          items: [
            { productId: '', quantity: 0, unitPrice: -1 },
          ],
        };

        const validation = (OrderService as any).validateOrderRequest(invalidItems);
        
        expect(validation.isValid).toBe(false);
        expect(validation.errors.some(e => e.includes('Product ID is required'))).toBe(true);
        expect(validation.errors.some(e => e.includes('Valid quantity is required'))).toBe(true);
        expect(validation.errors.some(e => e.includes('Valid unit price is required'))).toBe(true);
      });
    });

    describe('checkInventoryAvailability', () => {
      it('should check inventory correctly', async () => {
        // Mock products query
        const mockSupabaseFrom = vi.mocked(supabase.from);
        mockSupabaseFrom.mockReturnValue({
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({
              data: mockProducts,
              error: null,
            }),
          }),
        } as any);

        const result = await (OrderService as any).checkInventoryAvailability(mockOrderRequest.items);

        expect(result.allAvailable).toBe(true);
        expect(result.unavailableItems).toHaveLength(0);
      });

      it('should detect unavailable items', async () => {
        // Mock unavailable products
        const mockSupabaseFrom = vi.mocked(supabase.from);
        mockSupabaseFrom.mockReturnValue({
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({
              data: mockUnavailableProducts,
              error: null,
            }),
          }),
        } as any);

        const result = await (OrderService as any).checkInventoryAvailability(mockOrderRequest.items);

        expect(result.allAvailable).toBe(false);
        expect(result.unavailableItems.length).toBeGreaterThan(0);
        expect(result.unavailableItems[0]).toHaveProperty('productName');
        expect(result.unavailableItems[0]).toHaveProperty('requestedQuantity');
      });

      it('should handle database errors', async () => {
        // Mock database error
        const mockSupabaseFrom = vi.mocked(supabase.from);
        mockSupabaseFrom.mockReturnValue({
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        } as any);

        await expect(
          (OrderService as any).checkInventoryAvailability(mockOrderRequest.items)
        ).rejects.toThrow('Failed to check inventory');
      });
    });

    describe('calculateOrderTotals', () => {
      it('should calculate totals correctly', async () => {
        const totals = await (OrderService as any).calculateOrderTotals(mockOrderRequest);

        const expectedSubtotal = 2 * 25.50 + 1 * 15.00; // 66.00
        const expectedTax = expectedSubtotal * 0.1; // 6.60
        const expectedShipping = 15; // Under $100
        const expectedTotal = expectedSubtotal + expectedTax + expectedShipping; // 87.60

        expect(totals.subtotal).toBe(expectedSubtotal);
        expect(totals.taxes).toBe(expectedTax);
        expect(totals.shipping).toBe(expectedShipping);
        expect(totals.total).toBe(expectedTotal);
      });

      it('should apply free shipping for large orders', async () => {
        const largeOrder = {
          ...mockOrderRequest,
          items: [{ productId: 'product-1', quantity: 5, unitPrice: 25.00 }],
        };

        const totals = await (OrderService as any).calculateOrderTotals(largeOrder);

        expect(totals.shipping).toBe(0); // Free shipping over $100
      });
    });

    describe('generateOrderNumber', () => {
      it('should generate unique order numbers', () => {
        const orderNumber1 = (OrderService as any).generateOrderNumber();
        const orderNumber2 = (OrderService as any).generateOrderNumber();

        expect(orderNumber1).toMatch(/^ORD-[A-Z0-9]+-[A-Z0-9]+$/);
        expect(orderNumber2).toMatch(/^ORD-[A-Z0-9]+-[A-Z0-9]+$/);
        expect(orderNumber1).not.toBe(orderNumber2);
      });
    });

    describe('enrichOrderItems', () => {
      it('should enrich items with product information', async () => {
        // Mock products query
        const mockSupabaseFrom = vi.mocked(supabase.from);
        mockSupabaseFrom.mockReturnValue({
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({
              data: mockProducts,
              error: null,
            }),
          }),
        } as any);

        const enrichedItems = await (OrderService as any).enrichOrderItems(mockOrderRequest.items);

        expect(enrichedItems).toHaveLength(2);
        expect(enrichedItems[0]).toHaveProperty('productName', 'Organic Tomatoes');
        expect(enrichedItems[0]).toHaveProperty('totalPrice', 51.00);
        expect(enrichedItems[0]).toHaveProperty('availability', true);
        expect(enrichedItems[1]).toHaveProperty('productName', 'Fresh Basil');
        expect(enrichedItems[1]).toHaveProperty('totalPrice', 15.00);
      });

      it('should handle missing products gracefully', async () => {
        // Mock empty products response
        const mockSupabaseFrom = vi.mocked(supabase.from);
        mockSupabaseFrom.mockReturnValue({
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        } as any);

        const enrichedItems = await (OrderService as any).enrichOrderItems(mockOrderRequest.items);

        expect(enrichedItems).toHaveLength(2);
        expect(enrichedItems[0]).toHaveProperty('productName', 'Unknown Product');
        expect(enrichedItems[0]).toHaveProperty('availability', false);
      });
    });
  });

  describe('Performance Tests', () => {
    it('should handle large orders efficiently', async () => {
      const largeOrderRequest = {
        ...mockOrderRequest,
        items: Array.from({ length: 100 }, (_, i) => ({
          productId: `product-${i}`,
          quantity: 1,
          unitPrice: 10.00,
        })),
      };

      const mockProducts = Array.from({ length: 100 }, (_, i) => ({
        id: `product-${i}`,
        name: `Product ${i}`,
        availability: 'available',
        price: 10.00,
      }));

      // Mock database responses
      const mockSupabaseFrom = vi.mocked(supabase.from);
      
      mockSupabaseFrom
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({ data: mockProducts, error: null }),
          }),
        } as any)
        .mockReturnValueOnce({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockOrder, error: null }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          insert: vi.fn().mockResolvedValue({ data: null, error: null }),
        } as any)
        .mockReturnValueOnce({
          select: vi.fn().mockResolvedValue({ count: 0, error: null }),
        } as any)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({ data: mockProducts, error: null }),
          }),
        } as any);

      const startTime = Date.now();
      const result = await OrderService.createOrder(largeOrderRequest);
      const endTime = Date.now();

      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
      
      // Verify that we made efficient queries (not N+1)
      const fromCalls = vi.mocked(supabase.from).mock.calls;
      expect(fromCalls.length).toBeLessThan(10); // Should be much less than 100 items
    });

    it('should batch inventory checks efficiently', async () => {
      const items = Array.from({ length: 50 }, (_, i) => ({
        productId: `product-${i}`,
        quantity: 1,
        unitPrice: 10.00,
      }));

      const mockProducts = Array.from({ length: 50 }, (_, i) => ({
        id: `product-${i}`,
        name: `Product ${i}`,
        availability: 'available',
      }));

      // Mock single batch query
      const mockSupabaseFrom = vi.mocked(supabase.from);
      mockSupabaseFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({
            data: mockProducts,
            error: null,
          }),
        }),
      } as any);

      const result = await (OrderService as any).checkInventoryAvailability(items);

      expect(result.allAvailable).toBe(true);
      
      // Verify only one database call was made
      expect(mockSupabaseFrom).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle network timeouts gracefully', async () => {
      // Mock network timeout
      const mockSupabaseFrom = vi.mocked(supabase.from);
      mockSupabaseFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockRejectedValue(new Error('Network timeout')),
        }),
      } as any);

      const result = await OrderService.createOrder(mockOrderRequest);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(500);
      expect(result.error?.code).toBe('INTERNAL_ERROR');
    });

    it('should handle malformed data gracefully', async () => {
      const malformedRequest = {
        ...mockOrderRequest,
        items: [
          {
            productId: null,
            quantity: 'invalid',
            unitPrice: undefined,
          },
        ],
      };

      const result = await OrderService.createOrder(malformedRequest as any);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(400);
    });

    it('should handle concurrent order processing', async () => {
      const orderId = 'concurrent-test-order';

      // Mock successful processing
      const mockSupabaseFrom = vi.mocked(supabase.from);
      mockSupabaseFrom.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      } as any);

      // Process multiple orders concurrently
      const promises = Array.from({ length: 5 }, () => 
        OrderService.processOrder(orderId)
      );

      const results = await Promise.all(promises);

      // All should succeed
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });
  });
});