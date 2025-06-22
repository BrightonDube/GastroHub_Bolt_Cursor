import { supabase } from '../lib/supabase';
import { 
  OrderRequest, 
  OrderResponse, 
  OrderProcessing, 
  OrderProcessingResponse,
  OrderUpdate,
  OrderUpdateResponse,
  ProcessingStep 
} from '../types/order';

export class OrderService {
  /**
   * Create a new order with comprehensive validation and processing
   */
  static async createOrder(orderRequest: OrderRequest): Promise<OrderResponse> {
    try {
      // Step 1: Validate all required fields
      const validation = this.validateOrderRequest(orderRequest);
      if (!validation.isValid) {
        return {
          success: false,
          statusCode: 400,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid order data',
            details: validation.errors
          }
        };
      }

      // Step 2: Check inventory availability
      const inventoryCheck = await this.checkInventoryAvailability(orderRequest.items);
      if (!inventoryCheck.allAvailable) {
        return {
          success: false,
          statusCode: 409,
          error: {
            code: 'INSUFFICIENT_INVENTORY',
            message: 'Some items are not available in requested quantities',
            details: inventoryCheck.unavailableItems
          }
        };
      }

      // Step 3: Calculate totals
      const calculations = await this.calculateOrderTotals(orderRequest);

      // Step 4: Generate unique order reference
      const orderNumber = this.generateOrderNumber();
      const orderId = crypto.randomUUID();

      // Step 5: Apply discounts
      const discounts = await this.calculateDiscounts(orderRequest.buyerId, calculations.subtotal);

      // Step 6: Create order in database
      const { data: order, error: dbError } = await supabase
        .from('order')
        .insert({
          id: orderId,
          buyer_id: orderRequest.buyerId,
          supplier_id: orderRequest.items[0]?.listing_id, // Assuming single supplier for now
          status: 'pending',
          total_amount: calculations.total - discounts.amount,
          delivery_address: orderRequest.shippingAddress,
          payment_method: orderRequest.paymentDetails.method,
          payment_status: 'pending',
          special_instructions: orderRequest.specialInstructions,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Step 7: Create order items
      const orderItems = orderRequest.items.map(item => ({
        order_id: orderId,
        listing_id: item.listing_id,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.quantity * item.unitPrice
      }));

      const { error: itemsError } = await supabase
        .from('orderitem')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Step 8: Generate shipping label and tracking
      const shippingInfo = await this.generateShippingLabel(orderId, orderRequest.shippingAddress);

      // Step 9: Send confirmation email
      await this.sendConfirmationEmail(orderRequest.buyerId, orderId, orderNumber);

      // Step 10: Return success response
      return {
        success: true,
        statusCode: 201,
        data: {
          orderId,
          orderNumber,
          totalAmount: calculations.total - discounts.amount,
          subtotal: calculations.subtotal,
          taxes: calculations.taxes,
          shippingCost: calculations.shipping,
          discountAmount: discounts.amount,
          estimatedDeliveryDate: shippingInfo.estimatedDelivery,
          trackingNumber: shippingInfo.trackingNumber,
          paymentStatus: 'pending',
          items: await this.enrichOrderItems(orderRequest.items)
        }
      };

    } catch (error: any) {
      return {
        success: false,
        statusCode: 500,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create order',
          details: error.message
        }
      };
    }
  }

  /**
   * Process order through multiple steps with detailed tracking
   */
  static async processOrder(orderId: string): Promise<OrderProcessingResponse> {
    try {
      const steps: ProcessingStep[] = [
        { stepNumber: 1, stepName: 'Verify Payment', status: 'pending' },
        { stepNumber: 2, stepName: 'Check Inventory', status: 'pending' },
        { stepNumber: 3, stepName: 'Pack Items', status: 'pending' },
        { stepNumber: 4, stepName: 'Generate Shipping Label', status: 'pending' },
        { stepNumber: 5, stepName: 'Update Tracking', status: 'pending' },
        { stepNumber: 6, stepName: 'Notify Customer', status: 'pending' }
      ];

      let currentStep = 0;
      let orderStatus = 'pending';

      // Step 1: Verify Payment
      steps[0].status = 'in_progress';
      steps[0].timestamp = new Date();
      
      const paymentVerification = await this.verifyPayment(orderId);
      if (!paymentVerification.success) {
        steps[0].status = 'failed';
        steps[0].error = paymentVerification.error;
        throw new Error('Payment verification failed');
      }
      
      steps[0].status = 'completed';
      steps[0].details = 'Payment verified successfully';
      currentStep = 1;

      // Step 2: Check Inventory
      steps[1].status = 'in_progress';
      steps[1].timestamp = new Date();
      
      const inventoryCheck = await this.verifyInventoryForOrder(orderId);
      if (!inventoryCheck.success) {
        steps[1].status = 'failed';
        steps[1].error = inventoryCheck.error;
        throw new Error('Inventory check failed');
      }
      
      steps[1].status = 'completed';
      steps[1].details = 'Inventory confirmed and reserved';
      currentStep = 2;
      orderStatus = 'confirmed';

      // Step 3: Pack Items
      steps[2].status = 'in_progress';
      steps[2].timestamp = new Date();
      
      const packingResult = await this.packItems(orderId);
      if (!packingResult.success) {
        steps[2].status = 'failed';
        steps[2].error = packingResult.error;
        throw new Error('Packing failed');
      }
      
      steps[2].status = 'completed';
      steps[2].details = 'Items packed and ready for shipping';
      currentStep = 3;
      orderStatus = 'preparing';

      // Step 4: Generate Shipping Label
      steps[3].status = 'in_progress';
      steps[3].timestamp = new Date();
      
      const shippingLabel = await this.generateShippingLabelForOrder(orderId);
      if (!shippingLabel.success) {
        steps[3].status = 'failed';
        steps[3].error = shippingLabel.error;
        throw new Error('Shipping label generation failed');
      }
      
      steps[3].status = 'completed';
      steps[3].details = `Shipping label generated: ${shippingLabel.trackingNumber}`;
      currentStep = 4;
      orderStatus = 'ready_for_pickup';

      // Step 5: Update Tracking
      steps[4].status = 'in_progress';
      steps[4].timestamp = new Date();
      
      const trackingUpdate = await this.updateOrderTracking(orderId, shippingLabel.trackingNumber);
      if (!trackingUpdate.success) {
        steps[4].status = 'failed';
        steps[4].error = trackingUpdate.error;
        throw new Error('Tracking update failed');
      }
      
      steps[4].status = 'completed';
      steps[4].details = 'Tracking information updated';
      currentStep = 5;
      orderStatus = 'out_for_delivery';

      // Step 6: Notify Customer
      steps[5].status = 'in_progress';
      steps[5].timestamp = new Date();
      
      const notification = await this.notifyCustomer(orderId, shippingLabel.trackingNumber);
      if (!notification.success) {
        steps[5].status = 'failed';
        steps[5].error = notification.error;
        // Don't throw error for notification failure
      } else {
        steps[5].status = 'completed';
        steps[5].details = 'Customer notified successfully';
        currentStep = 6;
      }

      // Update order status in database
      await supabase
        .from('order')
        .update({ 
          status: orderStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      return {
        success: true,
        statusCode: 200,
        data: {
          orderId,
          currentStatus: orderStatus,
          currentStep,
          totalSteps: steps.length,
          steps,
          estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
          trackingNumber: shippingLabel.trackingNumber
        }
      };

    } catch (error: any) {
      return {
        success: false,
        statusCode: 500,
        error: {
          code: 'PROCESSING_ERROR',
          message: error.message,
          step: currentStep
        }
      };
    }
  }

  /**
   * Handle order updates with validation and conflict resolution
   */
  static async updateOrder(updateRequest: OrderUpdate): Promise<OrderUpdateResponse> {
    try {
      // Step 1: Validate update permissions
      const permissionCheck = await this.validateUpdatePermissions(updateRequest);
      if (!permissionCheck.allowed) {
        return {
          success: false,
          statusCode: 403,
          error: {
            code: 'PERMISSION_DENIED',
            message: 'Insufficient permissions for this update',
            conflicts: permissionCheck.conflicts
          }
        };
      }

      // Step 2: Get current order state
      const { data: currentOrder, error: fetchError } = await supabase
        .from('order')
        .select('*')
        .eq('id', updateRequest.orderId)
        .single();

      if (fetchError || !currentOrder) {
        return {
          success: false,
          statusCode: 404,
          error: {
            code: 'ORDER_NOT_FOUND',
            message: 'Order not found'
          }
        };
      }

      // Step 3: Validate update conflicts
      const conflictCheck = await this.checkUpdateConflicts(currentOrder, updateRequest);
      if (conflictCheck.hasConflicts) {
        return {
          success: false,
          statusCode: 409,
          error: {
            code: 'UPDATE_CONFLICT',
            message: 'Update conflicts with current order state',
            conflicts: conflictCheck.conflicts
          }
        };
      }

      // Step 4: Apply changes based on update type
      let updateData: any = {};
      let previousValue: any;

      switch (updateRequest.updateType) {
        case 'status':
          previousValue = currentOrder.status;
          updateData.status = updateRequest.newValue;
          break;
        case 'shipping':
          previousValue = currentOrder.delivery_address;
          updateData.delivery_address = updateRequest.newValue;
          break;
        case 'payment':
          previousValue = currentOrder.payment_status;
          updateData.payment_status = updateRequest.newValue;
          break;
        case 'cancel':
          previousValue = currentOrder.status;
          updateData.status = 'cancelled';
          break;
      }

      updateData.updated_at = new Date().toISOString();

      // Step 5: Update order in database
      const { error: updateError } = await supabase
        .from('order')
        .update(updateData)
        .eq('id', updateRequest.orderId);

      if (updateError) throw updateError;

      // Step 6: Log modification history
      await this.logOrderModification({
        orderId: updateRequest.orderId,
        updateType: updateRequest.updateType,
        oldValue: previousValue,
        newValue: updateRequest.newValue,
        reason: updateRequest.reason,
        timestamp: new Date(),
        userId: 'current-user-id' // This should come from auth context
      });

      // Step 7: Send notifications if required
      if (updateRequest.notifyCustomer) {
        await this.sendUpdateNotification(updateRequest.orderId, updateRequest.updateType, updateRequest.newValue);
      }

      // Step 8: Get modification history
      const modificationHistory = await this.getOrderModificationHistory(updateRequest.orderId);

      return {
        success: true,
        statusCode: 200,
        data: {
          orderId: updateRequest.orderId,
          previousValue,
          newValue: updateRequest.newValue,
          updateTimestamp: new Date(),
          modificationHistory
        }
      };

    } catch (error: any) {
      return {
        success: false,
        statusCode: 500,
        error: {
          code: 'UPDATE_ERROR',
          message: 'Failed to update order',
          conflicts: [error.message]
        }
      };
    }
  }

  // Helper methods
  private static validateOrderRequest(request: OrderRequest) {
    const errors: string[] = [];

    if (!request.buyerId) errors.push('Buyer ID is required');
    if (!request.items || request.items.length === 0) errors.push('Order must contain at least one item');
    if (!request.shippingAddress.street) errors.push('Shipping street address is required');
    if (!request.shippingAddress.city) errors.push('Shipping city is required');
    if (!request.shippingAddress.postalCode) errors.push('Shipping postal code is required');
    if (!request.paymentDetails.method) errors.push('Payment method is required');

    request.items.forEach((item, index) => {
      if (!item.listing_id) errors.push(`Item ${index + 1}: Listing ID is required`);
      if (!item.quantity || item.quantity <= 0) errors.push(`Item ${index + 1}: Valid quantity is required`);
      if (!item.unitPrice || item.unitPrice <= 0) errors.push(`Item ${index + 1}: Valid unit price is required`);
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private static async checkInventoryAvailability(items: OrderRequest['items']) {
    // Collect all product IDs to fetch in a single query
    const productIds = items.map(item => item.listing_id);
    const unavailableItems: any[] = [];
    
    // Fetch all products in a single query to avoid N+1 problem
    const { data: products, error } = await supabase
      .from('listing')
      .select('id, title, availability')
      .in('id', productIds);

    if (error) {
      throw new Error(`Failed to check inventory: ${error.message}`);
    }

    // Create a map for quick lookup
    const productMap = new Map(products?.map(p => [p.id, p]) || []);

    // Check availability for each item
    for (const item of items) {
      const product = productMap.get(item.listing_id);
      
      if (!product || product.availability === 'out_of_stock') {
        unavailableItems.push({
          listing_id: item.listing_id,
          listing_name: product?.title || 'Unknown Product',
          requested_quantity: item.quantity,
          available_quantity: 0
        });
      }
    }

    return {
      allAvailable: unavailableItems.length === 0,
      unavailableItems
    };
  }

  private static async calculateOrderTotals(request: OrderRequest) {
    const subtotal = request.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxes = subtotal * 0.1; // 10% tax rate
    const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
    const total = subtotal + taxes + shipping;

    return { subtotal, taxes, shipping, total };
  }

  private static generateOrderNumber(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `ORD-${timestamp}-${random}`.toUpperCase();
  }

  private static async calculateDiscounts(buyerId: string, subtotal: number) {
    // Simulate discount calculation
    let amount = 0;
    const discounts: string[] = [];

    // First-time buyer discount
    const { count } = await supabase
      .from('order')
      .select('*', { count: 'exact', head: true })
      .eq('buyer_id', buyerId);

    if (count === 0) {
      amount += subtotal * 0.1; // 10% first-time discount
      discounts.push('First-time buyer discount (10%)');
    }

    // Volume discount
    if (subtotal > 500) {
      amount += subtotal * 0.05; // 5% volume discount
      discounts.push('Volume discount (5%)');
    }

    return { amount, discounts };
  }

  private static async generateShippingLabel(orderId: string, address: any) {
    // Simulate shipping label generation
    const trackingNumber = `TRK${Date.now()}${Math.random().toString(36).substr(2, 4)}`.toUpperCase();
    const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days

    return { trackingNumber, estimatedDelivery };
  }

  private static async sendConfirmationEmail(buyerId: string, orderId: string, orderNumber: string) {
    // Simulate email sending
    console.log(`Confirmation email sent for order ${orderNumber} to buyer ${buyerId}`);
    return { success: true };
  }

  private static async enrichOrderItems(items: OrderRequest['items']) {
    // Collect all product IDs to fetch in a single query
    const productIds = items.map(item => item.listing_id);
    
    // Fetch all products in a single query to avoid N+1 problem
    const { data: products, error } = await supabase
      .from('listing')
      .select('id, title, availability')
      .in('id', productIds);

    if (error) {
      throw new Error(`Failed to enrich order items: ${error.message}`);
    }

    // Create a map for quick lookup
    const productMap = new Map(products?.map(p => [p.id, p]) || []);

    // Enrich items with product information
    const enrichedItems = items.map(item => {
      const product = productMap.get(item.productId);
      
      return {
        productId: item.productId,
        productName: product?.title || 'Unknown Product',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.quantity * item.unitPrice,
        availability: product?.availability !== 'out_of_stock'
      };
    });

    return enrichedItems;
  }

  // Processing helper methods
  private static async verifyPayment(orderId: string) {
    // Simulate payment verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  }

  private static async verifyInventoryForOrder(orderId: string) {
    // Simulate inventory verification
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true };
  }

  private static async packItems(orderId: string) {
    // Simulate packing process
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true };
  }

  private static async generateShippingLabelForOrder(orderId: string) {
    // Simulate shipping label generation
    await new Promise(resolve => setTimeout(resolve, 1200));
    const trackingNumber = `TRK${Date.now()}${Math.random().toString(36).substr(2, 4)}`.toUpperCase();
    return { success: true, trackingNumber };
  }

  private static async updateOrderTracking(orderId: string, trackingNumber: string) {
    // Simulate tracking update
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }

  private static async notifyCustomer(orderId: string, trackingNumber: string) {
    // Simulate customer notification
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  }

  // Update helper methods
  private static async validateUpdatePermissions(updateRequest: OrderUpdate) {
    // Simulate permission validation
    return { allowed: true, conflicts: [] };
  }

  private static async checkUpdateConflicts(currentOrder: any, updateRequest: OrderUpdate) {
    const conflicts: string[] = [];

    // Check if order is in a state that allows updates
    if (currentOrder.status === 'delivered' && updateRequest.updateType !== 'cancel') {
      conflicts.push('Cannot modify delivered orders');
    }

    if (currentOrder.status === 'cancelled') {
      conflicts.push('Cannot modify cancelled orders');
    }

    return {
      hasConflicts: conflicts.length > 0,
      conflicts
    };
  }

  private static async logOrderModification(modification: any) {
    // Log modification to audit table
    console.log('Order modification logged:', modification);
  }

  private static async sendUpdateNotification(orderId: string, updateType: string, newValue: any) {
    // Send notification to customer
    console.log(`Update notification sent for order ${orderId}: ${updateType} changed to ${newValue}`);
  }

  private static async getOrderModificationHistory(orderId: string) {
    // Return mock modification history
    return [
      {
        timestamp: new Date(),
        updateType: 'status',
        oldValue: 'pending',
        newValue: 'confirmed',
        reason: 'Payment verified',
        userId: 'system'
      }
    ];
  }
}