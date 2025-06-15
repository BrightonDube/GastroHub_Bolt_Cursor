import React from 'react';
import ProductForm from '../../../components/products/ProductForm';

const NewProductPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <ProductForm mode="create" />
    </div>
  );
};

export default NewProductPage;
