import React from 'react';
import { useRouter } from 'next/router';
import ProductForm from '../../../../components/products/ProductForm';

const EditProductPage: React.FC = () => {
  const router = useRouter();
  const { productId } = router.query;

  if (!productId || typeof productId !== 'string') return null;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <ProductForm mode="edit" productId={productId} />
    </div>
  );
};

export default EditProductPage;
