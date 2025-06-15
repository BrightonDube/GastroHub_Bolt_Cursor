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
  Star, 
  MapPin,
  Package,
  Users,
  Award,
  Clock,
  Phone,
  Mail
} from 'lucide-react';

export function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'fresh-produce', label: 'Fresh Produce' },
    { value: 'meat-poultry', label: 'Meat & Poultry' },
    { value: 'seafood', label: 'Seafood' },
    { value: 'dairy-eggs', label: 'Dairy & Eggs' },
    { value: 'pantry-staples', label: 'Pantry Staples' },
    { value: 'beverages', label: 'Beverages' },
  ];

  const locations = [
    { value: '', label: 'All Locations' },
    { value: 'california', label: 'California' },
    { value: 'texas', label: 'Texas' },
    { value: 'florida', label: 'Florida' },
    { value: 'new-york', label: 'New York' },
    { value: 'international', label: 'International' },
  ];

  const mockSuppliers = [
    {
      id: '1',
      name: 'Fresh Valley Farms',
      description: 'Premium organic produce supplier with 20+ years of experience',
      category: 'Fresh Produce',
      location: 'California, USA',
      rating: 4.8,
      reviews: 324,
      products: 156,
      verified: true,
      responseTime: '< 2 hours',
      image: 'https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=400',
      specialties: ['Organic', 'Local', 'Seasonal'],
      established: '2003',
      certifications: ['USDA Organic', 'Fair Trade']
    },
    {
      id: '2',
      name: 'Ocean Breeze Seafood',
      description: 'Fresh and frozen seafood from sustainable sources worldwide',
      category: 'Seafood',
      location: 'Boston, USA',
      rating: 4.9,
      reviews: 189,
      products: 89,
      verified: true,
      responseTime: '< 1 hour',
      image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
      specialties: ['Sustainable', 'Fresh', 'Frozen'],
      established: '1998',
      certifications: ['MSC Certified', 'BAP Certified']
    },
    {
      id: '3',
      name: 'Golden Grain Co.',
      description: 'Artisan bakery supplies and premium flour products',
      category: 'Bakery Supplies',
      location: 'Kansas, USA',
      rating: 4.7,
      reviews: 267,
      products: 124,
      verified: true,
      responseTime: '< 4 hours',
      image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
      specialties: ['Artisan', 'Wholesale', 'Custom'],
      established: '2010',
      certifications: ['SQF Certified', 'Non-GMO']
    },
    {
      id: '4',
      name: 'Mediterranean Imports',
      description: 'Authentic Mediterranean ingredients and specialty products',
      category: 'Specialty Foods',
      location: 'Italy',
      rating: 4.6,
      reviews: 145,
      products: 78,
      verified: false,
      responseTime: '< 6 hours',
      image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=400',
      specialties: ['Imported', 'Authentic', 'Premium'],
      established: '1995',
      certifications: ['EU Organic', 'DOP Certified']
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-heading font-bold text-[var(--foreground)]">
            Suppliers Directory
          </h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            Connect with verified food suppliers and build lasting partnerships
          </p>
        </div>

        {/* Search and Filters */}
        <Card padding="md" className="bg-[var(--background)]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted-foreground)] w-4 h-4" />
              <Input
                placeholder="Search suppliers by name, category, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              options={categories}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-[var(--foreground)]"
            />
            <Select
              options={locations}
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="text-[var(--foreground)]"
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-[var(--muted-foreground)]">
              Showing {mockSuppliers.length} suppliers
            </p>
            <Button variant="outline" size="sm" className="text-[var(--foreground)]">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </Card>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockSuppliers.map((supplier) => (
            <Card key={supplier.id} className="group hover:shadow-lg transition-shadow bg-[var(--background)]" padding="lg">
              <div className="flex items-start space-x-4">
                <img
                  src={supplier.image}
                  alt={supplier.name}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-[var(--foreground)]">
                          {supplier.name}
                        </h3>
                        {supplier.verified && (
                          <Badge variant="success" size="sm" className="text-[var(--foreground)]">
                            <Award className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-[var(--muted-foreground)] mb-2">
                        {supplier.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-[var(--secondary-400)] fill-current" />
                      <span className="text-sm font-medium">{supplier.rating}</span>
                      <span className="text-sm text-[var(--muted-foreground)]">({supplier.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-[var(--muted-foreground)]" />
                      <span className="text-sm text-[var(--muted-foreground)]">{supplier.products} products</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-[var(--muted-foreground)]" />
                      <span className="text-sm text-[var(--muted-foreground)]">{supplier.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-[var(--muted-foreground)]" />
                      <span className="text-sm text-[var(--muted-foreground)]">Responds {supplier.responseTime}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-[var(--muted-foreground)] mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-1">
                      {supplier.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" size="sm" className="text-[var(--foreground)]">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-[var(--muted-foreground)]">
                      <p>Est. {supplier.established}</p>
                      <p>{supplier.certifications.join(', ')}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="text-[var(--foreground)]">
                        <Mail className="w-4 h-4 mr-1" />
                        Contact
                      </Button>
                      <Button size="sm">
                        <Users className="w-4 h-4 mr-1" />
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Suppliers
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SuppliersPage;