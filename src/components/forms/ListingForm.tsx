import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Upload, X, AlertCircle } from 'lucide-react';

const listingSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
  min_order_quantity: z.number().min(1, 'Minimum order quantity must be at least 1'),
  max_order_quantity: z.number().optional(),
  availability: z.enum(['available', 'limited', 'out_of_stock']),
  is_organic: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

type ListingFormData = z.infer<typeof listingSchema>;

interface ListingFormProps {
  initialData?: Partial<ListingFormData>;
  onSubmit: (data: ListingFormData & { images: string[] }) => Promise<void>;
  loading?: boolean;
  mode: 'create' | 'edit';
}

const categories = [
  { value: 'Fresh Produce', label: 'Fresh Produce' },
  { value: 'Meat & Poultry', label: 'Meat & Poultry' },
  { value: 'Seafood', label: 'Seafood' },
  { value: 'Dairy & Eggs', label: 'Dairy & Eggs' },
  { value: 'Pantry Staples', label: 'Pantry Staples' },
  { value: 'Beverages', label: 'Beverages' },
  { value: 'Kitchen Equipment', label: 'Kitchen Equipment' },
  { value: 'Disposables', label: 'Disposables' },
  { value: 'Cleaning Supplies', label: 'Cleaning Supplies' },
];

const units = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'g', label: 'Gram (g)' },
  { value: 'lb', label: 'Pound (lb)' },
  { value: 'oz', label: 'Ounce (oz)' },
  { value: 'piece', label: 'Piece' },
  { value: 'dozen', label: 'Dozen' },
  { value: 'box', label: 'Box' },
  { value: 'case', label: 'Case' },
  { value: 'liter', label: 'Liter (L)' },
  { value: 'ml', label: 'Milliliter (ml)' },
];

const availabilityOptions = [
  { value: 'available', label: 'Available' },
  { value: 'limited', label: 'Limited Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
];

export function ListingForm({ initialData, onSubmit, loading = false, mode }: ListingFormProps) {
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [imageUploading, setImageUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
    reset,
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      availability: 'available',
      is_organic: false,
      tags: [],
      min_order_quantity: 1,
      ...initialData,
    },
  });

  const watchedValues = watch();

  // Auto-save functionality
  useEffect(() => {
    if (!isDirty || mode === 'create') return;

    const timeoutId = setTimeout(async () => {
      setAutoSaveStatus('saving');
      try {
        // Here you would implement auto-save logic
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus(null), 2000);
      } catch (error) {
        setAutoSaveStatus('error');
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [watchedValues, isDirty, mode]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setImageUploading(true);
    try {
      // Simulate image upload - replace with actual upload logic
      const uploadPromises = Array.from(files).map(async () => {
        // Here you would upload to Supabase storage
        return `https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400`;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      // You might want to show an error message to the user here
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !watchedValues.tags?.includes(tagInput.trim())) {
      const newTags = [...(watchedValues.tags || []), tagInput.trim()];
      setValue('tags', newTags);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = watchedValues.tags?.filter(tag => tag !== tagToRemove) || [];
    setValue('tags', newTags);
  };

  const onFormSubmit = async (data: ListingFormData) => {
    await onSubmit({ ...data, images });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {/* Auto-save status */}
      {autoSaveStatus && (
        <div className="flex items-center space-x-2 text-sm">
          {autoSaveStatus === 'saving' && (
            <>
              <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-neutral-600">Saving...</span>
            </>
          )}
          {autoSaveStatus === 'saved' && (
            <>
              <div className="w-4 h-4 bg-success-500 rounded-full" />
              <span className="text-success-600">Auto-saved</span>
            </>
          )}
          {autoSaveStatus === 'error' && (
            <>
              <AlertCircle className="w-4 h-4 text-error-500" />
              <span className="text-error-600">Auto-save failed</span>
            </>
          )}
        </div>
      )}

      {/* Basic Information */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Product Name"
              {...register('name')}
              error={errors.name?.message}
              placeholder="e.g., Organic Roma Tomatoes"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={4}
              placeholder="Describe your product, its quality, origin, and any special features..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-error-600">{errors.description.message}</p>
            )}
          </div>

          <Select
            label="Category"
            options={categories}
            {...register('category')}
            error={errors.category?.message}
          />

          <Input
            label="Subcategory (Optional)"
            {...register('subcategory')}
            placeholder="e.g., Cherry Tomatoes"
          />
        </div>
      </Card>

      {/* Pricing & Quantity */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">Pricing & Quantity</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Input
            label="Price"
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            error={errors.price?.message}
            placeholder="0.00"
          />

          <Select
            label="Unit"
            options={units}
            {...register('unit')}
            error={errors.unit?.message}
          />

          <Input
            label="Minimum Order"
            type="number"
            {...register('min_order_quantity', { valueAsNumber: true })}
            error={errors.min_order_quantity?.message}
            placeholder="1"
          />

          <Input
            label="Maximum Order (Optional)"
            type="number"
            {...register('max_order_quantity', { valueAsNumber: true })}
            error={errors.max_order_quantity?.message}
            placeholder="No limit"
          />
        </div>
      </Card>

      {/* Images */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">Product Images</h3>
        
        <div className="space-y-4">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
              disabled={imageUploading}
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-sm text-neutral-600">
                {imageUploading ? 'Uploading...' : 'Click to upload images or drag and drop'}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                PNG, JPG, GIF up to 10MB each
              </p>
            </label>
          </div>

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-neutral-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-error-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Additional Details */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">Additional Details</h3>
        
        <div className="space-y-6">
          <Select
            label="Availability Status"
            options={availabilityOptions}
            {...register('availability')}
            error={errors.availability?.message}
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_organic"
              {...register('is_organic')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
            />
            <label htmlFor="is_organic" className="text-sm font-medium text-neutral-700">
              This is an organic product
            </label>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {watchedValues.tags?.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-error-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Add
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => reset()}>
          Reset
        </Button>
        <Button type="submit" loading={loading}>
          {mode === 'create' ? 'Create Listing' : 'Update Listing'}
        </Button>
      </div>
    </form>
  );
}