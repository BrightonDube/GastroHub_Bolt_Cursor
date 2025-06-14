import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { OrderStatus } from '../types';

export function useSupplierOrders(supplierId: string, status?: OrderStatus) {
  return useQuery({
    queryKey: ['orders', 'supplier', supplierId, status],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select(`
          *,
          buyer:buyer_id(id, email, first_name, last_name),
          order_items(
            *,
            product:product_id(id, name, price, unit)
          )
        `)
        .eq('supplier_id', supplierId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          buyer:buyer_id(id, email, first_name, last_name, phone, address),
          supplier:supplier_id(id, email, first_name, last_name, business_name),
          order_items(
            *,
            product:product_id(id, name, price, unit, images)
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!orderId,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'supplier', data.supplier_id] });
      queryClient.invalidateQueries({ queryKey: ['order', data.id] });
    },
  });
}