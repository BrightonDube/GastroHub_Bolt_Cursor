import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../App';
import { useCreateListing } from '../../hooks/useListings';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ListingForm } from '../../components/forms/ListingForm';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export function NewListingPage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const createListingMutation = useCreateListing();
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    if (!user?.id) return;

    try {
      setError(null);
      const listingData = {
        ...data,
        supplier_id: user.id,
        availability: 'in_stock',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await createListingMutation.mutateAsync(listingData);
      
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/supplier/listings');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create listing');
    }
  };

  if (showSuccess) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success-600" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Listing Created Successfully!
          </h1>
          <p className="text-neutral-600 mb-6">
            Your product listing has been created and is now live on the marketplace.
          </p>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => navigate('/supplier/listings')}>
              View All Listings
            </Button>
            <Button onClick={() => navigate('/supplier/listings/new')}>
              Create Another Listing
            </Button>
          </div>
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
            Create New Listing
          </h1>
          <p className="text-neutral-600 mt-1">
            Add a new product to your marketplace listings
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-error-600 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-error-800">Error Creating Listing</h3>
              <p className="text-sm text-error-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <ListingForm
          onSubmit={handleSubmit}
          loading={createListingMutation.isPending}
          mode="create"
        />
      </div>
    </DashboardLayout>
  );
}

export default NewListingPage;