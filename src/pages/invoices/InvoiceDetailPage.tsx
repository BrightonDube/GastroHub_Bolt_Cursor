import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  getInvoice, 
  getSupplierDetails, 
  getBuyerDetails,
  markInvoiceAsSent,
  markInvoiceAsPaid,
  type InvoiceData,
  type InvoiceSupplier,
  type InvoiceBuyer 
} from '../../services/invoiceService';
import { formatZAR, formatDualCurrency } from '../../utils/currency';
import { formatSADate } from '../../utils/dateUtils';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const InvoiceDetailPage: React.FC = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [supplier, setSupplier] = useState<InvoiceSupplier | null>(null);
  const [buyer, setBuyer] = useState<InvoiceBuyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSupplier = user?.role === 'supplier';
  const isBuyer = user?.role === 'buyer';

  useEffect(() => {
    if (!invoiceId) {
      navigate('/invoices');
      return;
    }

    loadInvoiceData();
  }, [invoiceId]);

  const loadInvoiceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const invoiceData = await getInvoice(invoiceId!);
      if (!invoiceData) {
        setError('Invoice not found');
        return;
      }

      // Check permissions
      if (user?.id !== invoiceData.supplier_id && user?.id !== invoiceData.buyer_id) {
        setError('You do not have permission to view this invoice');
        return;
      }

      setInvoice(invoiceData);

      // Load supplier and buyer details
      const [supplierData, buyerData] = await Promise.all([
        getSupplierDetails(invoiceData.supplier_id),
        getBuyerDetails(invoiceData.buyer_id)
      ]);

      setSupplier(supplierData);
      setBuyer(buyerData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsSent = async () => {
    if (!invoice || !isSupplier) return;

    try {
      setUpdating(true);
      await markInvoiceAsSent(invoice.id!);
      await loadInvoiceData(); // Reload to get updated data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark invoice as sent');
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!invoice || !isSupplier) return;

    try {
      setUpdating(true);
      await markInvoiceAsPaid(invoice.id!);
      await loadInvoiceData(); // Reload to get updated data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark invoice as paid');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {error || 'Invoice not found'}
            </h2>
            <Button onClick={() => navigate('/invoices')} variant="outline">
              Back to Invoices
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Invoice {invoice.invoice_number}
              </h1>
              <p className="text-gray-600 mt-1">
                Issued on {formatSADate(new Date(invoice.issue_date), 'medium')}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={getStatusColor(invoice.status)}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </Badge>
              {isSupplier && (
                <div className="flex space-x-2">
                  {invoice.status === 'draft' && (
                    <Button 
                      onClick={handleMarkAsSent}
                      disabled={updating}
                      size="sm"
                    >
                      {updating ? 'Sending...' : 'Mark as Sent'}
                    </Button>
                  )}
                  {invoice.status === 'sent' && (
                    <Button 
                      onClick={handleMarkAsPaid}
                      disabled={updating}
                      size="sm"
                      variant="outline"
                    >
                      {updating ? 'Updating...' : 'Mark as Paid'}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Invoice Content */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              {/* Invoice Header */}
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Supplier Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">From</h3>
                    {supplier && (
                      <div className="space-y-1 text-gray-600">
                        <p className="font-medium text-gray-900">{supplier.business_name}</p>
                        <p>{supplier.contact_person}</p>
                        <p>{supplier.email}</p>
                        {supplier.phone && <p>{supplier.phone}</p>}
                        <p>{supplier.address}</p>
                        <p>{supplier.city}, {supplier.province} {supplier.postal_code}</p>
                        {supplier.vat_number && <p>VAT: {supplier.vat_number}</p>}
                      </div>
                    )}
                  </div>

                  {/* Buyer Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">To</h3>
                    {buyer && (
                      <div className="space-y-1 text-gray-600">
                        <p className="font-medium text-gray-900">{buyer.business_name}</p>
                        <p>{buyer.contact_person}</p>
                        <p>{buyer.email}</p>
                        {buyer.phone && <p>{buyer.phone}</p>}
                        <p>{buyer.address}</p>
                        <p>{buyer.city}, {buyer.province} {buyer.postal_code}</p>
                        {buyer.vat_number && <p>VAT: {buyer.vat_number}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="mb-8 border-t border-gray-200 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Invoice Number</p>
                    <p className="text-gray-900">{invoice.invoice_number}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Issue Date</p>
                    <p className="text-gray-900">{formatSADate(new Date(invoice.issue_date), 'medium')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Due Date</p>
                    <p className="text-gray-900">{formatSADate(new Date(invoice.due_date), 'medium')}</p>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Description</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Qty</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Unit Price</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items && invoice.items.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{item.product_name}</p>
                              {item.description && (
                                <p className="text-sm text-gray-600">{item.description}</p>
                              )}
                            </div>
                          </td>
                          <td className="text-right py-3 px-4 text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="text-right py-3 px-4 text-gray-900">
                            {formatZAR(item.unit_price)}
                          </td>
                          <td className="text-right py-3 px-4 text-gray-900 font-medium">
                            {formatZAR(item.total_price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">{formatZAR(invoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT (15%)</span>
                    <span className="text-gray-900">{formatZAR(invoice.vat_amount)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-gray-900">
                        {formatZAR(invoice.total_amount)}
                      </span>
                      <p className="text-sm text-gray-600">
                        {formatDualCurrency(invoice.total_amount, { compact: true })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                  <p className="text-gray-600">{invoice.notes}</p>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Terms</p>
                  <p className="text-gray-900">{invoice.payment_terms}</p>
                </div>
                {invoice.payment_instructions && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Instructions</p>
                    <p className="text-gray-900 text-sm">{invoice.payment_instructions}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.print()}
                >
                  Print Invoice
                </Button>
                {invoice.pdf_url && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open(invoice.pdf_url, '_blank')}
                  >
                    Download PDF
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/invoices')}
                >
                  Back to Invoices
                </Button>
              </div>
            </Card>

            {/* Invoice Timeline */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Invoice Created</p>
                    <p className="text-xs text-gray-600">
                      {formatSADate(new Date(invoice.created_at), 'withTime')}
                    </p>
                  </div>
                </div>
                {invoice.sent_at && (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Invoice Sent</p>
                      <p className="text-xs text-gray-600">
                        {formatSADate(new Date(invoice.sent_at), 'withTime')}
                      </p>
                    </div>
                  </div>
                )}
                {invoice.status === 'paid' && (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Payment Received</p>
                      <p className="text-xs text-gray-600">Status updated</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailPage;
