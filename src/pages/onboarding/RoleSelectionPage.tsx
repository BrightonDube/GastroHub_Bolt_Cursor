import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ShoppingCart, Package, Truck, CheckCircle } from 'lucide-react';
import { UserRole } from '../../types';

const roles = [
  {
    id: 'buyer' as UserRole,
    title: 'Buyer',
    description: 'I want to purchase food products for my business',
    icon: <ShoppingCart className="w-8 h-8" />,
    features: [
      'Browse marketplace',
      'Place orders',
      'Track deliveries',
      'Manage suppliers'
    ],
    color: 'primary'
  },
  {
    id: 'supplier' as UserRole,
    title: 'Supplier',
    description: 'I want to sell food products to businesses',
    icon: <Package className="w-8 h-8" />,
    features: [
      'Create listings',
      'Manage inventory',
      'Process orders',
      'View analytics'
    ],
    color: 'secondary'
  },
  {
    id: 'delivery_partner' as UserRole,
    title: 'Delivery Partner',
    description: 'I want to deliver orders and earn money',
    icon: <Truck className="w-8 h-8" />,
    features: [
      'Accept deliveries',
      'Track earnings',
      'Manage schedule',
      'View ratings'
    ],
    color: 'success'
  }
];

export function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleContinue = async () => {
    if (!selectedRole || !user) return;

    setLoading(true);
    // Here you would update the user's role in the database
    // For now, we'll just navigate to the profile details page
    navigate('/onboarding/profile-details', { 
      state: { selectedRole } 
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-4">
            Choose Your Role
          </h1>
          <p className="text-xl text-neutral-600">
            Select how you want to use GastroHub
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {roles.map((role) => (
            <Card
              key={role.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedRole === role.id
                  ? 'ring-2 ring-primary-500 shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <div className="text-center">
                <div className={`inline-flex p-4 rounded-2xl mb-4 ${
                  role.color === 'primary' ? 'bg-primary-100 text-primary-600' :
                  role.color === 'secondary' ? 'bg-secondary-100 text-secondary-600' :
                  'bg-success-100 text-success-600'
                }`}>
                  {role.icon}
                </div>
                
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  {role.title}
                </h3>
                
                <p className="text-neutral-600 mb-6">
                  {role.description}
                </p>

                <div className="space-y-2">
                  {role.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-neutral-600">
                      <CheckCircle className="w-4 h-4 text-success-500 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                {selectedRole === role.id && (
                  <div className="mt-4 p-2 bg-primary-50 rounded-lg">
                    <p className="text-sm font-medium text-primary-700">
                      Selected
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedRole}
            loading={loading}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RoleSelectionPage;