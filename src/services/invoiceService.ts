// Service for invoice backend logic: auto-generation, status changes, PDF, and email (stubbed)
import { supabase } from '../supabaseClient';

export async function autoGenerateInvoice(order_id: string, supplier_id: string, buyer_id: string) {
  // Insert invoice with status 'draft' for new order
  return supabase.from('invoices').insert({
    order_id: order_id,
    supplier_id: supplier_id,
    buyer_id: buyer_id,
    status: 'draft',
  });
}

export async function confirmAndSendInvoice(invoiceId: string, pdfUrl: string) {
  // Update invoice status and set PDF URL, sent_at timestamp
  return supabase.from('invoices').update({
    status: 'sent',
    pdf_url: pdfUrl,
    sent_at: new Date().toISOString(),
  }).eq('id', invoiceId);
}

export async function getInvoicesForUser(userId: string) {
  // Get all invoices where user is buyer or supplier
  return supabase.from('invoices').select('*').or(`supplier_id.eq.${userId},buyer_id.eq.${userId}`);
}

export async function getInvoiceById(invoiceId: string) {
  return supabase.from('invoices').select('*').eq('id', invoiceId).single();
}

// TODO: Implement PDF generation and email sending (edge function or serverless)
