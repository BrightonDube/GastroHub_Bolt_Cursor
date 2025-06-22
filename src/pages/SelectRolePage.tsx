import React from 'react';
import { useAuthContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { UserRole } from '../types';

const roleOptions = [
  { value: 'buyer', label: 'Buyer - I want to purchase food products' },
  { value: 'supplier', label: 'Supplier - I want to sell food products' },
  { value: 'delivery_partner', label: 'Delivery Partner - I want to deliver orders' },
];

export default function SelectRolePage() {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && user && user.role) {
      navigate(getDashboardPathByRole(user.role), { replace: true });
    }
  }, [user, loading, navigate]);

  const handleRoleSelect = async (role: UserRole) => {
    // TODO: Update the user's profile in the database with the selected role
    // and refresh the user context
    try {
      const res = await fetch('/api/set-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (data.success) {
        // After role is set, redirect to role-specific profile form
        navigate('/onboarding/role-profile', { replace: true });
      } else {
        alert('Failed to update role: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to update role: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Select Your Role</h1>
        <p className="mb-6 text-center text-neutral-600">Choose how you want to use GastroHub:</p>
        <div className="space-y-4">
          {roleOptions.map(option => (
            <Button
              key={option.value}
              className="w-full text-lg"
              onClick={() => handleRoleSelect(option.value as UserRole)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
