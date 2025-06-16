import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthContext } from '../../App';
import { Button } from '../ui/Button';
import { CategorySelector, CategoryNode } from '../categories/CategorySelector';

interface ProductFormProps {
  mode: 'create' | 'edit';
  productId?: string;
}

const initialState = {
  title: '',
  description: '',
  price: '',
  unit: '',
  min_quantity: '',
  max_quantity: '',
  stock_quantity: '',
  category: '',
  location: '',
  images: [],
};

// Categories are now fetched from backend
import { useCategories } from '../../hooks/useCategories';

const ProductForm: React.FC<ProductFormProps> = ({ mode, productId }) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [form, setForm] = useState(initialState);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && productId) {
      supabase.from('listings').select('*').eq('id', productId).single().then(({ data, error }) => {
        if (data) setForm({
          title: data.title || '',
          description: data.description || '',
          price: data.price?.toString() ?? '',
          unit: data.unit || '',
          min_quantity: data.min_quantity?.toString() ?? '',
          max_quantity: data.max_quantity?.toString() ?? '',
          stock_quantity: data.stock_quantity?.toString() ?? '',
          category: data.category || '',
          location: data.location || '',
          images: data.images || [],
        });
        if (error) setError(error.message);
      });
    }
  }, [mode, productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return form.images || [];
    const urls: string[] = [];
    for (const file of imageFiles) {
      const { data, error } = await supabase.storage.from('product-images').upload(`${user?.id}/${Date.now()}_${file.name}`, file);
      if (error) throw error;
      const { publicUrl } = supabase.storage.from('product-images').getPublicUrl(data.path).data;
      urls.push(publicUrl);
    }
    return urls;
  };

  import { toast } from 'sonner';

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const imageUrls = await uploadImages();
      const payload = {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        unit: form.unit,
        min_quantity: parseInt(form.min_quantity, 10),
        max_quantity: form.max_quantity ? parseInt(form.max_quantity, 10) : null,
        stock_quantity: parseInt(form.stock_quantity, 10),
        category: form.category,
        location: form.location,
        images: imageUrls,
        supplier_id: user?.id || '',
      };
      if (mode === 'create') {
        const { error } = await supabase.from('listings').insert([payload]);
        if (error) throw error;
        toast.success('Product created successfully!');
        navigate('/dashboard/products');
      } else if (mode === 'edit' && productId) {
        const { error } = await supabase.from('listings').update(payload).eq('id', productId);
        if (error) throw error;
        toast.success('Product updated successfully!');
        navigate('/dashboard/products');
      }
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to save product: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div>
        <label className="block font-medium mb-1">Product Title *</label>
        <input type="text" name="title" value={form.title} onChange={handleChange} required className="input" />
      </div>
      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="input" />
      </div>
      <div>
        <label className="block font-medium mb-1">Price *</label>
        <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" step="0.01" className="input" />
      </div>
      <div>
        <label className="block font-medium mb-1">Stock Quantity *</label>
        <input type="number" name="stock_quantity" value={form.stock_quantity} onChange={handleChange} required min="0" step="1" className="input" />
      </div>
      <div>
        {categoriesLoading ? (
          <div>Loading categories...</div>
        ) : (
          <CategorySelector
            value={form.category}
            onChange={(categoryId: string | null) => setForm({ ...form, category: categoryId })}
            categories={categories}
            allowAdd={false}
          />
        )}
      </div>
      <div>
        <label className="block font-medium mb-1">Image Upload</label>
        <input type="file" accept="image/*" multiple onChange={handleImageChange} />
        {form.images && form.images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {form.images.map((url: string, idx: number) => (
              <img key={idx} src={url} alt="Product" className="w-16 h-16 object-cover rounded" />
            ))}
          </div>
        )}
      </div>
      <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Update Product'}</Button>
    </form>
  );
};

export default ProductForm;
