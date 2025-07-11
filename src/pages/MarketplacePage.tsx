import { useState, useRef, useEffect } from 'react';

import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CurrencyDisplay } from '../components/ui/CurrencyDisplay';
import { CartButton } from '../components/ui/CartButton';
import { Search, Filter, ShoppingCart, Package } from 'lucide-react';
import { useListingsInfinite, useFeaturedListings } from '../hooks/useListings';
import { useCategories } from '../hooks/useCategories';

import { Header } from '../components/layout/Header';

export function MarketplacePage() {
  // Remove authentication gating; always fetch data
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

  const { data: categoriesData = [] } = useCategories();

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
  ]; // categoriesData is already from useCategories (category table)

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' },
  ];

  const {
    data,
    isLoading: listingsLoading,
    isError: listingsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useListingsInfinite({
    searchTerm,
    category: categoryFilter,
    sortBy,
  });

  // TODO: Replace 'any' with the actual Listing type from your types module
const listings: any[] = data?.pages?.flat() ?? [];

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

  const filteredListings = listings
    .filter((listing: any) =>
      (!searchTerm || listing.title?.toLowerCase().includes(searchTerm.toLowerCase())) &&
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

  // Debug logs to understand why no products are appearing
  console.log('Raw data from useListingsInfinite:', data);
  console.log('Flattened listings array:', listings);
  console.log('Filtered and sorted listings:', filteredListings);

  return (
    <div className="min-h-screen bg-background text-foreground p-0">
      <Header />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
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
              options={categoryOptions}
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
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-md shadow-sm hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            >
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </Card>

        {/* Featured Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                ⭐ Featured Products
              </h2>
              <p className="text-sm text-muted-foreground">
                Hand-picked quality products from our top suppliers
              </p>
            </div>
            <Badge variant="secondary" className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
              Featured
            </Badge>
          </div>
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
                <Card key={product.id} className="group hover:shadow-lg transition-shadow border-2 border-primary-200 dark:border-primary-700 bg-gradient-to-br from-primary-50 to-white dark:from-primary-950 dark:to-background" padding="none" >
                  <div className="relative">
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/400x300?text=No+Image'}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-yellow-400 text-yellow-900 font-semibold">
                        ⭐ Featured
                      </Badge>
                    </div>
                    {!product.isActive && (
                      <div className="absolute top-2 right-2">
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
                      Supplier: {(product as any).supplierName}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Product Code: {(product as any).productCode}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold" >
                        <CurrencyDisplay 
                          amount={product.price}
                        />
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
                    <CartButton 
                      productId={product.id}
                      productName={product.name}
                      unitPrice={product.price}
                      unit={product.unit}
                      productImage={product.images && product.images.length > 0 ? product.images[0] : undefined}
                      supplierName={(product as any).supplierName}
                      minQuantity={product.minOrder}
                      maxQuantity={product.maxOrder}
                      className="w-full"
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Decorative Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-dashed border-neutral-300 dark:border-neutral-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-6 py-2 bg-background border-2 border-neutral-200 dark:border-neutral-700 rounded-full text-neutral-600 dark:text-neutral-400 font-medium">
              All Products
            </span>
          </div>
        </div>

        {/* All Products Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
            Browse All Products
          </h2>
          <p className="text-sm text-muted-foreground">
            Discover our complete range of quality food products
          </p>
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
                    Supplier: {(product as any).supplierName}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    Product Code: {(product as any).productCode}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold" >
                                             <CurrencyDisplay 
                        amount={product.price || 0}
                      />
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
                  <CartButton 
                    productId={product.id}
                    productName={product.name}
                    unitPrice={product.price || 0}
                    unit={product.unit}
                    productImage={product.images && product.images.length > 0 ? product.images[0] : undefined}
                    supplierName={(product as any).supplierName}
                    minQuantity={product.minOrder}
                    maxQuantity={product.maxOrder}
                    className="w-full"
                  />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Infinite Scroll Sentinel */}
        <div ref={loadMoreRef} className="h-8" />
      </div>
    </div>
  );
}

export default MarketplacePage;