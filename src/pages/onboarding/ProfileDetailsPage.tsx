import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../App';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Building, Phone, MapPin, User } from 'lucide-react';
import { UserRole } from '../../types';

export function ProfileDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  
  const selectedRole = location.state?.selectedRole as UserRole;
  
  const [formData, setFormData] = useState({
    companyName: '',
    phone: '',
    address: '',
    businessType: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Here you would update the user's profile in the database
    // For now, we'll just navigate to the appropriate dashboard
    
    setTimeout(() => {
      switch (selectedRole) {
        case 'buyer':
          navigate('/buyer/dashboard');
          break;
        case 'supplier':
          navigate('/supplier/dashboard');
          break;
        case 'delivery_partner':
          navigate('/delivery/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
      setLoading(false);
    }, 1000);
  };

  const getRoleSpecificFields = () => {
    switch (selectedRole) {
      case 'supplier':
        return (
          <>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Business type (e.g., Farm, Restaurant, Distributor)"
                value={formData.businessType}
                onChange={(e) => handleInputChange('businessType', e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <textarea
              placeholder="Tell us about your business and products"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={4}
              required
            />
          </>
        );
      case 'delivery_partner':
        return (
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Vehicle type (e.g., Car, Motorcycle, Bicycle)"
              value={formData.businessType}
              onChange={(e) => handleInputChange('businessType', e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Service area"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-4">
            Complete Your Profile
          </h1>
          <p className="text-xl text-neutral-600">
            Tell us more about your {selectedRole?.replace('_', ' ')} business
          </p>
        </div>

        <Card padding="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Company/Business name"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="pl-10"
                required
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <Input
                type="tel"
                placeholder="Phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="pl-10"
                required
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Business address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="pl-10"
                required
              />
            </div>

            {getRoleSpecificFields()}

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/onboarding/role-selection')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                loading={loading}
                className="flex-1"
              >
                Complete Setup
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default ProfileDetailsPage;