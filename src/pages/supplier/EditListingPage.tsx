import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useListing, useUpdateListing } from '../../hooks/useListings';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ListingForm } from '../../components/forms/ListingForm';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ArrowLeft, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

export function EditListingPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: listing, isLoading, error } = useListing(id!);
  const updateListingMutation = useUpdateListing();
  const [showSuccess, setShowSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    if (!id) return;

    try {
      setUpdateError(null);
      await updateListingMutation.mutateAsync({
        id,
        ...data,
        updated_at: new Date().toISOString(),
      });
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err: any) {
      setUpdateError(err.message || 'Failed to update listing');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="lg" text="Loading listing..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !listing) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <AlertTriangle className="w-16 h-16 text-error-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Listing Not Found
          </h1>
          <p className="text-neutral-600 mb-6">
            The listing you're looking for doesn't exist or you don't have permission to edit it.
          </p>
          <Button onClick={() => navigate('/supplier/listings')}>
            Back to Listings
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/supplier/listings')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Listings
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-heading font-bold text-neutral-900">
            Edit Listing
          </h1>
          <p className="text-neutral-600 mt-1">
            Update your product information and settings
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-success-50 border border-success-200 rounded-lg p-4 flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-success-800">Listing Updated</h3>
              <p className="text-sm text-success-700 mt-1">Your changes have been saved successfully.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {updateError && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-error-600 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-error-800">Error Updating Listing</h3>
              <p className="text-sm text-error-700 mt-1">{updateError}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <ListingForm
          initialData={{
            name: listing.name,
            description: listing.description || '',
            category: listing.category,
            subcategory: listing.subcategory || '',
            price: Number(listing.price),
            unit: listing.unit,
            min_order_quantity: listing.min_order_quantity || 1,
            max_order_quantity: listing.max_order_quantity || undefined,
            availability: listing.availability === 'out_of_stock' ? 'out_of_stock' : 'in_stock',
            is_organic: listing.is_organic || false,
            tags: listing.tags || [],
            images: listing.images || [],
          }}
          onSubmit={handleSubmit}
          loading={updateListingMutation.isPending}
          mode="edit"
        />
      </div>
    </DashboardLayout>
  );
}

export default EditListingPage;