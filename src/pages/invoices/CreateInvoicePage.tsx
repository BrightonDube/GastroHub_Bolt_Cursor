import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { 
  createInvoice, 
  calculateInvoiceTotals,
  getBuyerDetails,
  type InvoiceData,
  type InvoiceItem 
} from '../../services/invoiceService';
import { calculateVAT, formatZAR } from '../../utils/currency';
import { formatSADate, getCurrentSASTTime } from '../../utils/dateUtils';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { supabase } from '../../lib/supabase';

interface InvoiceFormData {
  buyer_id: string;
  due_date: string;
  payment_terms: string;
  notes: string;
  payment_instructions: string;
  items: InvoiceItem[];
}

interface BuyerOption {
  id: string;
  business_name: string;
  email: string;
}

const CreateInvoicePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buyers, setBuyers] = useState<BuyerOption[]>([]);
  const [loadingBuyers, setLoadingBuyers] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    defaultValues: {
      buyer_id: '',
      due_date: formatSADate(
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        'iso'
      ),
      payment_terms: '30 days',
      notes: '',
      payment_instructions: 'Payment can be made via EFT. Banking details will be provided upon request.',
      items: [
        {
          product_name: '',
          description: '',
          quantity: 1,
          unit_price: 0,
          total_price: 0,
          vat_rate: 15,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');

  useEffect(() => {
    loadBuyers();
  }, []);

  useEffect(() => {
    // Recalculate totals when items change
    watchedItems?.forEach((item, index) => {
      const quantity = item.quantity || 0;
      const unitPrice = item.unit_price || 0;
      const totalPrice = quantity * unitPrice;
      
      if (totalPrice !== item.total_price) {
        setValue(`items.${index}.total_price`, totalPrice);
      }
    });
  }, [watchedItems, setValue]);

  const loadBuyers = async () => {
    try {
      setLoadingBuyers(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, business_name, full_name, email')
        .eq('role', 'buyer')
        .order('business_name', { ascending: true });

      if (error) throw error;

      const buyerOptions: BuyerOption[] = data.map(buyer => ({
        id: buyer.id,
        business_name: buyer.business_name || buyer.full_name || 'Unknown Business',
        email: buyer.email,
      }));

      setBuyers(buyerOptions);
    } catch (err) {
      console.error('Failed to load buyers:', err);
      setError('Failed to load buyers');
    } finally {
      setLoadingBuyers(false);
    }
  };

  const addLineItem = () => {
    append({
      product_name: '',
      description: '',
      quantity: 1,
      unit_price: 0,
      total_price: 0,
      vat_rate: 15,
    });
  };

  const removeLineItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const calculateTotals = () => {
    const validItems = watchedItems?.filter(item => 
      item.product_name && item.quantity > 0 && item.unit_price > 0
    ) || [];
    
    return calculateInvoiceTotals(validItems);
  };

  const totals = calculateTotals();

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate that we have at least one valid item
      const validItems = data.items.filter(item => 
        item.product_name.trim() && item.quantity > 0 && item.unit_price > 0
      );

      if (validItems.length === 0) {
        setError('Please add at least one valid line item');
        return;
      }

      // Create the invoice
      const invoiceData: Partial<InvoiceData> = {
        supplier_id: user!.id,
        buyer_id: data.buyer_id,
        due_date: data.due_date,
        payment_terms: data.payment_terms,
        notes: data.notes.trim() || undefined,
        payment_instructions: data.payment_instructions.trim() || undefined,
        items: validItems,
      };

      const newInvoice = await createInvoice(invoiceData);
      
      // Navigate to the invoice detail page
      navigate(`/invoices/${newInvoice.id}`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'supplier') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">Only suppliers can create invoices.</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Create Invoice</h1>
              <p className="text-gray-600 mt-1">Generate a new invoice for your customer</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/invoices')}
            >
              Cancel
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Customer Selection */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer *
                    </label>
                    {loadingBuyers ? (
                      <div className="flex items-center space-x-2">
                        <LoadingSpinner size="sm" />
                        <span className="text-sm text-gray-500">Loading customers...</span>
                      </div>
                    ) : (
                      <Select
                        {...register('buyer_id', { required: 'Please select a customer' })}
                        className="w-full"
                      >
                        <option value="">Select a customer</option>
                        {buyers.map((buyer) => (
                          <option key={buyer.id} value={buyer.id}>
                            {buyer.business_name} ({buyer.email})
                          </option>
                        ))}
                      </Select>
                    )}
                    {errors.buyer_id && (
                      <p className="text-red-600 text-sm mt-1">{errors.buyer_id.message}</p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Invoice Details */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date *
                    </label>
                    <Input
                      type="date"
                      {...register('due_date', { required: 'Due date is required' })}
                      className="w-full"
                    />
                    {errors.due_date && (
                      <p className="text-red-600 text-sm mt-1">{errors.due_date.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Terms
                    </label>
                    <Select
                      {...register('payment_terms')}
                      className="w-full"
                    >
                      <option value="immediate">Due immediately</option>
                      <option value="7 days">Net 7 days</option>
                      <option value="14 days">Net 14 days</option>
                      <option value="30 days">Net 30 days</option>
                      <option value="60 days">Net 60 days</option>
                    </Select>
                  </div>
                </div>
              </Card>

              {/* Line Items */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Line Items</h3>
                  <Button type="button" onClick={addLineItem} variant="outline" size="sm">
                    Add Item
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-900">Item {index + 1}</h4>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeLineItem(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product/Service Name *
                          </label>
                          <Input
                            {...register(`items.${index}.product_name`, {
                              required: 'Product name is required',
                            })}
                            placeholder="Enter product or service name"
                            className="w-full"
                          />
                          {errors.items?.[index]?.product_name && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.items[index]?.product_name?.message}
                            </p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <Input
                            {...register(`items.${index}.description`)}
                            placeholder="Optional description"
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity *
                          </label>
                          <Input
                            type="number"
                            min="1"
                            step="1"
                            {...register(`items.${index}.quantity`, {
                              required: 'Quantity is required',
                              min: { value: 1, message: 'Quantity must be at least 1' },
                              valueAsNumber: true,
                            })}
                            className="w-full"
                          />
                          {errors.items?.[index]?.quantity && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.items[index]?.quantity?.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Unit Price (ZAR) *
                          </label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...register(`items.${index}.unit_price`, {
                              required: 'Unit price is required',
                              min: { value: 0.01, message: 'Unit price must be greater than 0' },
                              valueAsNumber: true,
                            })}
                            className="w-full"
                          />
                          {errors.items?.[index]?.unit_price && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.items[index]?.unit_price?.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Line Total</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatZAR(watchedItems?.[index]?.total_price || 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Additional Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      {...register('notes')}
                      rows={3}
                      placeholder="Add any notes or special instructions"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Instructions
                    </label>
                    <textarea
                      {...register('payment_instructions')}
                      rows={3}
                      placeholder="Provide payment instructions for the customer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Summary Sidebar */}
            <div className="space-y-6">
              {/* Invoice Summary */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">{formatZAR(totals.subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT (15%)</span>
                    <span className="text-gray-900">{formatZAR(totals.vatAmount)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatZAR(totals.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
              </Card>

              {/* Actions */}
              <Card className="p-6">
                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={loading || totals.total <= 0}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Creating Invoice...
                      </>
                    ) : (
                      'Create Invoice'
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/invoices')}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoicePage; 