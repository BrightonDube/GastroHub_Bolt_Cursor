import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Truck, 
  MapPin, 
  Clock, 
  DollarSign,
  Star,
  Package,
  Route,
  Shield,
  CheckCircle,
  Users,
  TrendingUp
} from 'lucide-react';
import { useDeliveryStats } from '../hooks/useDeliveryStats';
import { useServiceAreas } from '../hooks/useServiceAreas';

export function DeliveryPage() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useDeliveryStats();
  const { data: serviceAreas, isLoading: areasLoading, error: areasError } = useServiceAreas();

  const features = [
    {
      icon: <Route className="w-8 h-8" />,
      title: 'Smart Routing',
      description: 'AI-powered route optimization for faster deliveries and reduced costs'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Insured Deliveries',
      description: 'Full insurance coverage for all deliveries with real-time tracking'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Same-Day Delivery',
      description: 'Express delivery options for urgent orders within city limits'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Performance Analytics',
      description: 'Detailed insights and analytics for delivery performance optimization'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-heading font-bold text-[var(--foreground)] mb-4">
            Delivery Network
          </h1>
          <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto">
            Reliable, fast, and secure delivery services connecting suppliers with buyers across the nation
          </p>
        </div>

        {/* Stats */}
        {statsLoading ? (
          <div className="flex items-center justify-center min-h-32">Loading delivery stats...</div>
        ) : statsError ? (
          <div className="flex items-center justify-center min-h-32 text-error-600">Error loading stats.</div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card padding="md" className="text-center">
              <div className="inline-flex p-3 rounded-full mb-4 bg-[var(--primary-50)] text-[var(--primary-600)]">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-1">{stats.activeDrivers}</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-2">Active Drivers</p>
              <Badge variant="success" size="sm" className="bg-[var(--success-100)] text-[var(--success-600)]">This month</Badge>
            </Card>
            <Card padding="md" className="text-center">
              <div className="inline-flex p-3 rounded-full mb-4 bg-[var(--success-100)] text-[var(--success-600)]">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-1">{stats.deliveriesToday}</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-2">Deliveries Today</p>
              <Badge variant="success" size="sm" className="bg-[var(--success-100)] text-[var(--success-600)]">Today</Badge>
            </Card>
            <Card padding="md" className="text-center">
              <div className="inline-flex p-3 rounded-full mb-4 bg-[var(--secondary-50)] text-[var(--secondary-400)]">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-1">{stats.avgRating}</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-2">Average Rating</p>
              <Badge variant="secondary" size="sm">+0.2</Badge>
            </Card>
            <Card padding="md" className="text-center">
              <div className="inline-flex p-3 rounded-full mb-4 bg-[var(--warning-100)] text-[var(--warning-600)]">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-1">{stats.onTimeRate}%</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-2">On-Time Rate</p>
              <Badge variant="warning" size="sm">+1.2%</Badge>
            </Card>
          </div>
        ) : null}

        {/* Features */}
        <div>
          <h2 className="text-2xl font-heading font-bold text-[var(--foreground)] mb-6 text-center">
            Why Choose Our Delivery Network?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} padding="lg" className="text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex p-4 bg-[var(--primary-50)] text-[var(--primary-600)] rounded-2xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[var(--muted-foreground)] text-sm">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Service Areas */}
        <div>
          <h2 className="text-2xl font-heading font-bold text-[var(--foreground)] mb-6">
            Service Coverage Areas
          </h2>
          {areasLoading ? (
            <div className="flex items-center justify-center min-h-32">Loading service areas...</div>
          ) : areasError ? (
            <div className="flex items-center justify-center min-h-32 text-error-600">Error loading service areas.</div>
          ) : serviceAreas && serviceAreas.length > 0 ? (
            <Card padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--card-muted,#f9fafb)] border-b border-neutral-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">City</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Active Drivers</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Avg. Delivery Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Coverage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[var(--background)] divide-y divide-neutral-200">
                    {serviceAreas.map((area: any, index: number) => (
                      <tr key={index} className="hover:bg-[var(--card-muted,#f9fafb)]">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-[var(--muted-foreground)] mr-2" />
                            <span className="text-sm font-medium text-[var(--foreground)]">{area.city}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Truck className="w-4 h-4 text-[var(--muted-foreground)] mr-2" />
                            <span className="text-sm text-[var(--foreground)]">{area.drivers}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-[var(--muted-foreground)] mr-2" />
                            <span className="text-sm text-[var(--foreground)]">{area.avgTime}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-[var(--foreground)]">{area.coverage}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={area.coverage === 'Active' ? 'success' : 'secondary'} size="sm">
                            {area.coverage === 'Active' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Package className="w-3 h-3 mr-1" />}
                            {area.coverage}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <div className="flex items-center justify-center min-h-32 text-muted-foreground">No service areas found.</div>
          )}
        </div>

        {/* CTA Section */}
        <Card padding="lg" className="text-center bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-heading font-bold text-[var(--foreground)] mb-4">
              Join Our Delivery Network
            </h2>
            <p className="text-[var(--muted-foreground)] mb-6">
              Whether you're a supplier needing reliable delivery or a driver looking for flexible work opportunities, 
              we have solutions for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Package className="w-5 h-5 mr-2" />
                Request Delivery Service
              </Button>
              <Button variant="outline" size="lg">
                <Truck className="w-5 h-5 mr-2" />
                Become a Driver
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default DeliveryPage;