import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star, 
  MapPin,
  Package,
  Truck,
  Clock
} from 'lucide-react';

export function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('relevance');

  // Fetch categories from backend
  import { useCategories } from '../hooks/useCategories';
  const { data: categoriesData = [], isLoading: categoriesLoading } = useCategories();
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

  const mockProducts = [
    {
      id: '1',
      name: 'Organic Roma Tomatoes',
      supplier: 'Fresh Valley Farms',
      price: 4.50,
      unit: 'kg',
      rating: 4.8,
      reviews: 124,
      location: 'California, USA',
      image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Fresh Produce',
      inStock: true,
      minOrder: 5,
      deliveryTime: '1-2 days'
    },
    {
      id: '2',
      name: 'Premium Olive Oil',
      supplier: 'Mediterranean Imports',
      price: 24.99,
      unit: 'bottle',
      rating: 4.9,
      reviews: 89,
      location: 'Italy',
      image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=400',
      category: 'Pantry Staples',
      inStock: true,
      minOrder: 1,
      deliveryTime: '3-5 days'
    },
    {
      id: '3',
      name: 'Fresh Atlantic Salmon',
      supplier: 'Ocean Breeze Seafood',
      price: 18.75,
      unit: 'kg',
      rating: 4.7,
      reviews: 67,
      location: 'Norway',
      image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Seafood',
      inStock: true,
      minOrder: 2,
      deliveryTime: '1 day'
    },
    {
      id: '4',
      name: 'Artisan Sourdough Bread',
      supplier: 'Golden Grain Bakery',
      price: 6.50,
      unit: 'loaf',
      rating: 4.6,
      reviews: 156,
      location: 'San Francisco, USA',
      image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Bakery',
      inStock: false,
      minOrder: 6,
      deliveryTime: '2-3 days'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-heading font-bold" style={{ color: 'var(--foreground)' }}>
            Marketplace
          </h1>
          <p className="mt-1" style={{ color: 'var(--muted-foreground, #6b7280)' }}>
            Discover quality food products from verified suppliers
          </p>
        </div>

        {/* Search and Filters */}
        <Card padding="md" style={{ backgroundColor: 'var(--card, #fff)' }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <Input
                placeholder="Search products, suppliers, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                style={{ color: 'var(--foreground)' }}
              />
            </div>
            <Select
              options={categories}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ color: 'var(--foreground)' }}
            />
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ color: 'var(--foreground)' }}
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm" style={{ color: 'var(--muted-foreground, #6b7280)' }}>
              Showing {mockProducts.length} products
            </p>
            <Button variant="outline" size="sm" style={{ color: 'var(--foreground)' }}>
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </Card>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow" padding="none" style={{ backgroundColor: 'var(--card, #fff)' }}>
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                {!product.inStock && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="error" size="sm" style={{ backgroundColor: 'var(--error, #dc2626)' }}>
                      Out of Stock
                    </Badge>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <div style={{ background: 'var(--card, #fff)', opacity: 0.9, backdropFilter: 'blur(4px)', borderRadius: '9999px', padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star className="w-3 h-3" style={{ color: 'var(--secondary-400)' }} />
                    <span className="text-xs font-medium">{product.rating}</span>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold mb-1 line-clamp-2" style={{ color: 'var(--foreground)' }}>
                  {product.name}
                </h3>
                <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground, #6b7280)' }}>{product.supplier}</p>
                
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-3 h-3" style={{ color: 'var(--neutral-400)' }} />
                  <span className="text-xs" style={{ color: 'var(--neutral-500)' }}>{product.location}</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-900)' }}>
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--neutral-500)' }}>
                    per {product.unit}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs mb-4" style={{ color: 'var(--neutral-500)' }}>
                  <div className="flex items-center space-x-1">
                    <Package className="w-3 h-3" />
                    <span>Min: {product.minOrder} {product.unit}s</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Truck className="w-3 h-3" />
                    <span>{product.deliveryTime}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  disabled={!product.inStock}
                  size="sm"
                  style={{ color: 'var(--foreground)' }}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default MarketplacePage;