// Service for invoice backend logic: auto-generation, status changes, PDF, and email (stubbed)
import { supabase } from '../lib/supabase';
import { formatInvoiceCurrency, calculateVAT } from '../utils/currency';
import { formatSADate, getCurrentSASTTime, sastToUTC } from '../utils/dateUtils';

export interface InvoiceItem {
  id?: string;
  product_name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  vat_rate?: number;
}

export interface InvoiceData {
  id?: string;
  invoice_number: string;
  order_id?: string;
  supplier_id: string;
  buyer_id: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  
  // Invoice details
  issue_date: string;
  due_date: string;
  payment_terms?: string;
  
  // Amounts
  subtotal: number;
  vat_amount: number;
  total_amount: number;
  
  // Line items
  items: InvoiceItem[];
  
  // Additional info
  notes?: string;
  payment_instructions?: string;
  
  // Metadata
  pdf_url?: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceSupplier {
  id: string;
  business_name: string;
  contact_person: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  vat_number?: string;
  registration_number?: string;
}

export interface InvoiceBuyer {
  id: string;
  business_name: string;
  contact_person: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  vat_number?: string;
}

/**
 * Generate unique invoice number
 */
export function generateInvoiceNumber(): string {
  const now = getCurrentSASTTime();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const timestamp = now.getTime().toString().slice(-6);
  
  return `INV-${year}${month}${day}-${timestamp}`;
}

/**
 * Calculate invoice totals from items
 */
export function calculateInvoiceTotals(items: InvoiceItem[]): {
  subtotal: number;
  vatAmount: number;
  total: number;
} {
  const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
  const vatCalculation = calculateVAT(subtotal, false);
  
  return {
    subtotal: vatCalculation.baseAmount,
    vatAmount: vatCalculation.vatAmount,
    total: vatCalculation.totalAmount,
  };
}

/**
 * Create a new invoice
 */
export async function createInvoice(invoiceData: Partial<InvoiceData>): Promise<InvoiceData> {
  const now = getCurrentSASTTime();
  const invoiceNumber = generateInvoiceNumber();
  
  // Calculate totals if items are provided
  const totals = invoiceData.items ? 
    calculateInvoiceTotals(invoiceData.items) : 
    { subtotal: 0, vatAmount: 0, total: 0 };
  
  const invoice: Omit<InvoiceData, 'id'> = {
    invoice_number: invoiceNumber,
    order_id: invoiceData.order_id,
    supplier_id: invoiceData.supplier_id!,
    buyer_id: invoiceData.buyer_id!,
    status: invoiceData.status || 'draft',
    
    issue_date: formatSADate(now, 'iso'),
    due_date: invoiceData.due_date || formatSADate(
      new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      'iso'
    ),
    payment_terms: invoiceData.payment_terms || '30 days',
    
    subtotal: totals.subtotal,
    vat_amount: totals.vatAmount,
    total_amount: totals.total,
    
    items: invoiceData.items || [],
    notes: invoiceData.notes,
    payment_instructions: invoiceData.payment_instructions || 
      'Payment can be made via EFT. Banking details will be provided upon request.',
    
    created_at: sastToUTC(now).toISOString(),
    updated_at: sastToUTC(now).toISOString(),
  };
  
  const { data, error } = await supabase
    .from('invoice')
    .insert(invoice)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Failed to create invoice: ${error.message}`);
  }
  
  return data;
}

/**
 * Get invoice by ID
 */
export async function getInvoice(invoiceId: string): Promise<InvoiceData | null> {
  const { data, error } = await supabase
    .from('invoice')
    .select('*')
    .eq('id', invoiceId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to fetch invoice: ${error.message}`);
  }
  
  return data;
}

/**
 * Update invoice
 */
export async function updateInvoice(
  invoiceId: string, 
  updates: Partial<InvoiceData>
): Promise<InvoiceData> {
  const now = getCurrentSASTTime();
  
  // Recalculate totals if items are updated
  if (updates.items) {
    const totals = calculateInvoiceTotals(updates.items);
    updates.subtotal = totals.subtotal;
    updates.vat_amount = totals.vatAmount;
    updates.total_amount = totals.total;
  }
  
  const { data, error } = await supabase
    .from('invoice')
    .update({
      ...updates,
      updated_at: sastToUTC(now).toISOString(),
    })
    .eq('id', invoiceId)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Failed to update invoice: ${error.message}`);
  }
  
  return data;
}

/**
 * Get invoices with filters
 */
export async function getInvoices(filters: {
  supplier_id?: string;
  buyer_id?: string;
  status?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<{ invoices: InvoiceData[]; count: number }> {
  let query = supabase
    .from('invoice')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });
  
  if (filters.supplier_id) {
    query = query.eq('supplier_id', filters.supplier_id);
  }
  
  if (filters.buyer_id) {
    query = query.eq('buyer_id', filters.buyer_id);
  }
  
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters.limit) {
    query = query.limit(filters.limit);
  }
  
  if (filters.offset) {
    query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
  }
  
  const { data, error, count } = await query;
  
  if (error) {
    throw new Error(`Failed to fetch invoices: ${error.message}`);
  }
  
  return {
    invoices: data || [],
    count: count || 0,
  };
}

/**
 * Mark invoice as sent
 */
export async function markInvoiceAsSent(invoiceId: string): Promise<void> {
  const now = getCurrentSASTTime();
  
  const { error } = await supabase
    .from('invoice')
    .update({
      status: 'sent',
      sent_at: sastToUTC(now).toISOString(),
      updated_at: sastToUTC(now).toISOString(),
    })
    .eq('id', invoiceId);
  
  if (error) {
    throw new Error(`Failed to mark invoice as sent: ${error.message}`);
  }
}

/**
 * Mark invoice as paid
 */
export async function markInvoiceAsPaid(invoiceId: string): Promise<void> {
  const now = getCurrentSASTTime();
  
  const { error } = await supabase
    .from('invoice')
    .update({
      status: 'paid',
      updated_at: sastToUTC(now).toISOString(),
    })
    .eq('id', invoiceId);
  
  if (error) {
    throw new Error(`Failed to mark invoice as paid: ${error.message}`);
  }
}

/**
 * Generate invoice from order
 */
export async function generateInvoiceFromOrder(orderId: string): Promise<InvoiceData> {
  // Fetch order details
  const { data: order, error: orderError } = await supabase
    .from('order')
    .select(`
      *,
      order_item (
        id,
        quantity,
        unit_price,
        total_price,
        listing:product_id (
          title,
          description
        )
      )
    `)
    .eq('id', orderId)
    .single();
  
  if (orderError) {
    throw new Error(`Failed to fetch order: ${orderError.message}`);
  }
  
  // Convert order items to invoice items
  const invoiceItems: InvoiceItem[] = order.order_item.map((item: any) => ({
    product_name: item.listing?.title || 'Product',
    description: item.listing?.description,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.total_price,
    vat_rate: 15, // 15% VAT in South Africa
  }));
  
  // Create invoice
  return await createInvoice({
    order_id: orderId,
    supplier_id: order.supplier_id,
    buyer_id: order.buyer_id,
    items: invoiceItems,
    notes: `Invoice for Order #${order.id.slice(0, 8)}`,
  });
}

/**
 * Get supplier details for invoice
 */
export async function getSupplierDetails(supplierId: string): Promise<InvoiceSupplier | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', supplierId)
    .eq('role', 'supplier')
    .single();
  
  if (error) {
    return null;
  }
  
  // Map profile data to invoice supplier format
  return {
    id: data.id,
    business_name: data.business_name || data.full_name || 'Business Name',
    contact_person: data.full_name || 'Contact Person',
    email: data.email,
    phone: data.phone,
    address: data.address || 'Address not provided',
    city: data.city || 'City',
    province: data.province || 'Province',
    postal_code: data.postal_code || '0000',
    vat_number: data.vat_number,
    registration_number: data.registration_number,
  };
}

/**
 * Get buyer details for invoice
 */
export async function getBuyerDetails(buyerId: string): Promise<InvoiceBuyer | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', buyerId)
    .single();
  
  if (error) {
    return null;
  }
  
  // Map profile data to invoice buyer format
  return {
    id: data.id,
    business_name: data.business_name || data.full_name || 'Business Name',
    contact_person: data.full_name || 'Contact Person',
    email: data.email,
    phone: data.phone,
    address: data.address || 'Address not provided',
    city: data.city || 'City',
    province: data.province || 'Province',
    postal_code: data.postal_code || '0000',
    vat_number: data.vat_number,
  };
}

/**
 * Generate invoice summary stats
 */
export async function getInvoiceStats(supplierId?: string): Promise<{
  total: number;
  sent: number;
  paid: number;
  overdue: number;
  totalAmount: number;
  paidAmount: number;
}> {
  let query = supabase
    .from('invoice')
    .select('status, total_amount');
  
  if (supplierId) {
    query = query.eq('supplier_id', supplierId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw new Error(`Failed to fetch invoice stats: ${error.message}`);
  }
  
  const stats = {
    total: data.length,
    sent: 0,
    paid: 0,
    overdue: 0,
    totalAmount: 0,
    paidAmount: 0,
  };
  
  data.forEach((invoice) => {
    stats.totalAmount += invoice.total_amount;
    
    switch (invoice.status) {
      case 'sent':
        stats.sent++;
        break;
      case 'paid':
        stats.paid++;
        stats.paidAmount += invoice.total_amount;
        break;
      case 'overdue':
        stats.overdue++;
        break;
    }
  });
  
  return stats;
}
