import React from 'react';
import { useRouter } from 'next/router';
import ProductForm from '../../../../components/products/ProductForm';
import { Button } from '../../../../components/ui/Button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../../lib/supabase';

const ContactSupplierButton: React.FC<{ productId: string }> = ({ productId }) => {
  const router = useRouter();
  // Fetch product info to get supplierId
  const { data: product } = useQuery(['product', productId], async () => {
    const { data } = await supabase.from('listing').select('*').eq('id', productId).single();
    return data;
  });
  if (!product) return null;
  const supplierId = product.supplier_id;
  return (
    <Button
      className="mt-6"
      variant="primary"
      onClick={() => router.push(`/MessagingPage?supplierId=${supplierId}&productId=${productId}`)}
    >
      Contact Supplier
    </Button>
  );
};

const EditProductPage: React.FC = () => {
  const router = useRouter();
  const { productId } = router.query;

  if (!productId || typeof productId !== 'string') return null;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <ProductForm mode="edit" productId={productId} />
      <ProductForm mode="edit" productId={productId} />
      {/* Contact Supplier Button */}
      <ContactSupplierButton productId={productId as string} />
    </div>
  );
};

export default EditProductPage;
