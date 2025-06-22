import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Search, Filter, ShoppingCart, Package } from 'lucide-react';
import { useListingsInfinite, useFeaturedListings } from '../hooks/useListings';
import { useCategories } from '../hooks/useCategories';

export function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('relevance');

  // --- REMOVE DUPLICATE/INLINE IMPORTS AND LOGIC ---
  // (All imports are at the top. FlattenCategories and categoryOptions are defined only once below.)

  // Featured section
  const {
    data: featuredListings = [],
    isLoading: featuredLoading,
    isError: featuredError
  } = useFeaturedListings();

  // Categories
  const {
    data: categoriesData = [],
    isLoading: categoriesLoading,
    isError: categoriesError
  } = useCategories();

  // Flatten hierarchical categories for dropdown
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


  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' },
  ];

  // Combine all loaded pages
  const listings: Listing[] = data?.pages?.flat() ?? [];

  // Infinite scroll: load more when sentinel is in view
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hasNextPage || listingsLoading || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [hasNextPage, listingsLoading, isFetchingNextPage, fetchNextPage]);

  // Filter and sort client-side (optional, for search/sort)
  const filteredListings = listings
    .filter((listing) =>
      (!searchTerm || listing.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!categoryFilter || listing.category_id === categoryFilter)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default: return 0;
      }
    });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-heading font-bold" >
            Marketplace
          </h1>
          <p className="mt-1" >
            Discover quality food products from verified suppliers
          </p>
        </div>

        {/* Search and Filters */}
        <Card padding="md" >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <Input
                placeholder="Search products, suppliers, or categories..."
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
              options={sortOptions}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm" >
              {listingsLoading ? 'Loading products...' : listingsError ? 'Failed to load products' : `Showing ${filteredListings.length} products`}
            </p>
            <Button variant="outline" size="sm" >
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </Card>

        {/* Featured Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2" >
            Featured Products
          </h2>
          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse h-48 bg-gray-100">
                  <div className="w-full h-48 bg-gray-200 rounded-t-xl mb-4" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-1/2 bg-gray-100 rounded mb-2" />
                  <div className="h-4 w-1/3 bg-gray-200 rounded mb-4" />
                  <div className="h-8 w-full bg-gray-100 rounded" />
                </Card>
              ))}
            </div>
          ) : featuredError ? (
            <div className="text-red-500">Failed to load featured products.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredListings.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow" padding="none" >
                  <div className="relative">
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/400x300?text=No+Image'}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    {!product.isActive && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="error" size="sm" >
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 line-clamp-2" >
                      {product.name}
                    </h3>
                    <p className="text-sm mb-2" >
                      Supplier: {product.supplierId}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold" >
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-sm" >
                        per {product.unit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-4" >
                      <div className="flex items-center space-x-1">
                        <Package className="w-3 h-3" />
                        <span>Min: {product.minOrder} {product.unit}(s)</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Badge variant="secondary" size="sm">{product.category}</Badge>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      disabled={!product.isActive}
                      size="sm"
                      
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.isActive ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Product Grid */}
        {listingsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse h-72 bg-gray-100">
            {/* Skeleton content */}
            <div className="w-full h-48 bg-gray-200 rounded-t-xl mb-4" />
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-1/2 bg-gray-100 rounded mb-2" />
            <div className="h-4 w-1/3 bg-gray-200 rounded mb-4" />
            <div className="h-8 w-full bg-gray-100 rounded" />
          </Card>
            ))}
          </div>
        ) : listingsError ? (
          <div className="text-red-500">Failed to load products.</div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow" padding="none" >
                <div className="relative">
                  <img
                    src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  {product.availability === 'out_of_stock' && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="error" size="sm" >
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1 line-clamp-2" >
                    {product.title}
                  </h3>
                  <p className="text-sm mb-2" >
                    Supplier: {product.supplier_id}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold" >
                      ${product.price?.toFixed(2)}
                    </span>
                    <span className="text-sm" >
                      per {product.unit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-4" >
                    <div className="flex items-center space-x-1">
                      <Package className="w-3 h-3" />
                      <span>Min: {product.min_quantity} {product.unit}(s)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge variant="secondary" size="sm">{product.category_id}</Badge>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    disabled={product.availability === 'out_of_stock'}
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {product.availability !== 'out_of_stock' ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Infinite Scroll Sentinel */}
        <div ref={loadMoreRef} className="h-8" />
      </div>
    </DashboardLayout>
  );
}

export default MarketplacePage;