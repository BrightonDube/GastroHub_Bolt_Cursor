import React from 'react';
import { useSupplierListings } from '../../hooks/useListings';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

const ProductsPage: React.FC = () => {
  const { user } = useAuth();
  const supplierId = user?.id || '';
  const { data: products = [], isLoading, error } = useSupplierListings(supplierId);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setDeletingId(id);
    const { error } = await supabase.from('listings').delete().eq('id', id);
    setDeletingId(null);
    if (!error) queryClient.invalidateQueries({ queryKey: ['listings', 'supplier', supplierId] });
    else alert(error.message);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Products</h1>
        <Link to="/dashboard/products/new">
          <Button variant="primary">Add New Product</Button>
        </Link>
      </div>
      {isLoading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error.message}</div>}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stock Quantity</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {products.map((product: any) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">${product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.stock_quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <Link to={`/dashboard/products/${product.id}/edit`}>
                    <Button size="sm" variant="secondary">Edit</Button>
                  </Link>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(product.id)} disabled={deletingId === product.id}>{deletingId === product.id ? 'Deleting...' : 'Delete'}</Button>
                </td>
              </tr>
            ))}
            {products.length === 0 && !isLoading && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsPage;
