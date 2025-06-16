import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../App';
import { useSupplierListings, useToggleListingStatus } from '../../hooks/useListings';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye,
  AlertTriangle,
  Package,
  DollarSign
} from 'lucide-react';

export function ListingsPage() {
  const { user } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: listings, isLoading, error } = useSupplierListings(user?.id || '');
  const toggleStatusMutation = useToggleListingStatus();

  // Fetch categories from backend
  import { useCategories } from '../../hooks/useCategories';
  const { data: categoriesData = [], isLoading: categoriesLoading } = useCategories();
  // Flatten categories for select filter
  function flattenCategories(nodes: any[]): { value: string; label: string }[] {
    let arr: { value: string; label: string }[] = [];
    for (const node of nodes) {
      arr.push({ value: node.id, label: node.name });
      if (node.children && node.children.length > 0) {
        arr = arr.concat(flattenCategories(node.children));
      }
    }
    return arr;
  }
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...flattenCategories(categoriesData)
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'available', label: 'Available' },
    { value: 'limited', label: 'Limited Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' },
  ];

  const filteredListings = listings?.filter(listing => {
    const matchesSearch = listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || listing.category === categoryFilter;
    const matchesStatus = !statusFilter || listing.availability === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleToggleStatus = async (listingId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'available' ? 'out_of_stock' : 'available';
    try {
      await toggleStatusMutation.mutateAsync({
        id: listingId,
        availability: newStatus,
      });
    } catch (error) {
      console.error('Error toggling listing status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'limited':
        return 'warning';
      case 'out_of_stock':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStockWarning = (listing: any) => {
    // This would be based on actual stock levels from your database
    const mockStock = Math.floor(Math.random() * 100);
    return mockStock < 10;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="lg" text="Loading your listings..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-error-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Error Loading Listings</h3>
          <p className="text-neutral-600">Please try refreshing the page.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-neutral-900">
              My Listings
            </h1>
            <p className="text-neutral-600 mt-1">
              Manage your product listings and inventory
            </p>
          </div>
          <Button asChild>
            <Link to="/supplier/listings/new">
              <Plus className="w-4 h-4 mr-2" />
              Create New Listing
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card padding="md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <Input
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              options={categories}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            <Button variant="outline" className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Total Listings</p>
                <p className="text-2xl font-bold text-neutral-900">{listings?.length || 0}</p>
              </div>
              <Package className="w-8 h-8 text-primary-600" />
            </div>
          </Card>
          <Card padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Active</p>
                <p className="text-2xl font-bold text-success-600">
                  {listings?.filter(l => l.availability === 'available').length || 0}
                </p>
              </div>
              <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-success-500 rounded-full" />
              </div>
            </div>
          </Card>
          <Card padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Low Stock</p>
                <p className="text-2xl font-bold text-warning-600">
                  {listings?.filter(l => l.availability === 'limited').length || 0}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-warning-600" />
            </div>
          </Card>
          <Card padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Avg. Price</p>
                <p className="text-2xl font-bold text-neutral-900">
                  ${listings?.reduce((acc, l) => acc + Number(l.price), 0) / (listings?.length || 1) || 0}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-secondary-600" />
            </div>
          </Card>
        </div>

        {/* Listings Grid */}
        {filteredListings && filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="group hover:shadow-lg transition-shadow" padding="none">
                <div className="relative">
                  <img
                    src={listing.images?.[0] || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={listing.name}
                    className="w-full h-48 object-cover rounded-t-xl"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                  />
                  {getStockWarning(listing) && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="warning" size="sm">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Low Stock
                      </Badge>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant={getStatusColor(listing.availability) as any} size="sm">
                      {listing.availability.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-neutral-900 mb-1 line-clamp-2">
                    {listing.name}
                  </h3>
                  <p className="text-sm text-neutral-600 mb-2">{listing.category}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-primary-900">
                      ${Number(listing.price).toFixed(2)}
                    </span>
                    <span className="text-sm text-neutral-500">
                      per {listing.unit}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link to={`/supplier/listings/edit/${listing.id}`}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(listing.id, listing.availability)}
                      loading={toggleStatusMutation.isPending}
                    >
                      {listing.availability === 'available' ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card padding="lg" className="text-center">
            <Package className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              {searchTerm || categoryFilter || statusFilter ? 'No listings found' : 'No listings yet'}
            </h3>
            <p className="text-neutral-600 mb-6">
              {searchTerm || categoryFilter || statusFilter 
                ? 'Try adjusting your search or filters'
                : 'Create your first listing to start selling on GastroHub'
              }
            </p>
            {!searchTerm && !categoryFilter && !statusFilter && (
              <Button asChild>
                <Link to="/supplier/listings/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Listing
                </Link>
              </Button>
            )}
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ListingsPage;