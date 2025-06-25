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
import { useSuppliers } from '../hooks/useSuppliers';

export function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

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

  const locations = [
    { value: '', label: 'All Locations' },
    { value: 'california', label: 'California' },
    { value: 'texas', label: 'Texas' },
    { value: 'florida', label: 'Florida' },
    { value: 'new-york', label: 'New York' },
    { value: 'international', label: 'International' },
  ];

  // Fetch suppliers from backend
  const { data: suppliers = [], isLoading, error } = useSuppliers({
    searchTerm,
    category: categoryFilter,
    location: locationFilter,
  });

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
              options={categoryOptions}
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
              {isLoading ? 'Loading suppliers...' : `Showing ${suppliers.length} suppliers`}
            </p>
            <Button variant="outline" size="sm" className="text-[var(--foreground)]">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </Card>

        {/* Loading/Error/Empty States */}
        {isLoading && (
          <div className="flex items-center justify-center min-h-48">
            <span>Loading suppliers...</span>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center min-h-48 text-error-600">
            <span>Error loading suppliers. Please try again.</span>
          </div>
        )}
        {!isLoading && !error && suppliers.length === 0 && (
          <div className="flex items-center justify-center min-h-48 text-muted-foreground">
            <span>No suppliers found. Try adjusting your search or filters.</span>
          </div>
        )}

        {/* Suppliers Grid */}
        {!isLoading && !error && suppliers.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {suppliers.map((supplier: any) => (
              <Card key={supplier.id} className="group hover:shadow-lg transition-shadow bg-[var(--background)]" padding="lg">
                <div className="flex items-start space-x-4">
                  <img
                    src={supplier.image || 'https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={supplier.business_name || supplier.full_name || 'Supplier'}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-[var(--foreground)]">
                            {supplier.business_name || supplier.full_name || 'Supplier'}
                          </h3>
                          {supplier.verified && (
                            <Badge variant="success" size="sm" className="text-[var(--foreground)]">
                              <Award className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-[var(--muted-foreground)] mb-2">
                          {supplier.description || 'No description provided.'}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-[var(--secondary-400)] fill-current" />
                        <span className="text-sm font-medium">{supplier.rating ?? 'N/A'}</span>
                        <span className="text-sm text-[var(--muted-foreground)]">({supplier.reviews ?? 0} reviews)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-[var(--muted-foreground)]" />
                        <span className="text-sm text-[var(--muted-foreground)]">{supplier.products ?? 0} products</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-[var(--muted-foreground)]" />
                        <span className="text-sm text-[var(--muted-foreground)]">{supplier.location || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-[var(--muted-foreground)]" />
                        <span className="text-sm text-[var(--muted-foreground)]">Responds {supplier.response_time || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs text-[var(--muted-foreground)] mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-1">
                        {(supplier.specialties || []).map((specialty: string, index: number) => (
                          <Badge key={index} variant="secondary" size="sm" className="text-[var(--foreground)]">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-[var(--muted-foreground)]">
                        <p>Est. {supplier.established || 'N/A'}</p>
                        <p>{(supplier.certifications || []).join(', ')}</p>
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
        )}
      </div>
    </DashboardLayout>
  );
}

export default SuppliersPage;