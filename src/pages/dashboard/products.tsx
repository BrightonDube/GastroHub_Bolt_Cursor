import React from 'react';
import { useSupplierListings } from '../../hooks/useListings';
import { useAuthContext } from '../../App';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

const ProductsPage: React.FC = () => {
  const { user } = useAuthContext();
  const supplierId = user?.id || '';
  const { data: products = [], isLoading, error } = useSupplierListings(supplierId);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setDeletingId(id);
    const { error } = await supabase.from('listing').delete().eq('id', id);
    setDeletingId(null);
    if (!error) queryClient.invalidateQueries({ queryKey: ['listing', 'supplier', supplierId] });
    else alert(error.message);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-heading font-bold">My Products</h1>
        <Link to="/dashboard/products/new">
          <Button variant="primary">Add New Product</Button>
        </Link>
      </div>
      {isLoading && <div>Loading...</div>}
      {error && <div className="text-error-600">{error.message}</div>}
      <div className="bg-card dark:bg-background rounded-xl shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-border dark:divide-border">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">Stock Quantity</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="bg-card dark:bg-background divide-y divide-border dark:divide-border">
            {products.map((product: any) => (
              <tr key={product.id}>
                <td className="px-6 py-4 text-foreground whitespace-nowrap">{product.name}</td>
                <td className="px-6 py-4 text-foreground whitespace-nowrap">${product.price}</td>
                <td className="px-6 py-4 text-foreground whitespace-nowrap">{product.stock_quantity}</td>
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
                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsPage;
