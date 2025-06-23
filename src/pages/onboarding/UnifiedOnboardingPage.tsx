import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { useAuthContext } from '../../App';

/**
 * UnifiedOnboardingPage: Combines onboarding (role/profile/business info) and backup credential setup for Google users.
 * Uses Supabase backend for all updates and credential linking.
 */
export default function UnifiedOnboardingPage() {
  const navigate = useNavigate();
  const auth = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Profile fields
  const [role, setRole] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [description, setDescription] = useState('');

  // Backup credential fields
  const [backupEmail, setBackupEmail] = useState('');
  const [backupPassword, setBackupPassword] = useState('');
  const [showBackupFields, setShowBackupFields] = useState(false);

  useEffect(() => {
    // Detect if the user signed in with Google and needs backup credentials
    const checkIdentities = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const identities = user.identities || [];
      const hasGoogle = identities.some((id: any) => id.provider === 'google');
      const hasEmail = identities.some((id: any) => id.provider === 'email');
      setShowBackupFields(hasGoogle && !hasEmail);
    };
    checkIdentities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user found.');

      // 1. If backup credentials needed, link email/password
      if (showBackupFields) {
        // Use Supabase Edge Function or Admin API to link credentials
        // This should be done via a secure backend endpoint
        // Here we use @resources:supabase-mcp-server (pseudo-code, replace with actual call)
        const response = await fetch('/api/link-backup-credentials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            email: backupEmail,
            password: backupPassword,
          }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to link backup credentials.');
      }

      // 2. Update user profile (role, business info, etc.)
      const { error: profileError } = await supabase
        .from('profile')
        .update({
          role,
          business_name: companyName,
          phone,
          address,
          business_type: businessType,
          description,
          onboarding_complete: true,
        })
        .eq('id', user.id);
      if (profileError) throw new Error(profileError.message);

      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to complete onboarding.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Complete Your Onboarding</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} required className="w-full border rounded px-3 py-2">
              <option value="">Select role</option>
              <option value="buyer">Buyer</option>
              <option value="supplier">Supplier</option>
              <option value="delivery_partner">Delivery Partner</option>
            </select>
          </div>
          <Input type="text" placeholder="Company/Business Name" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
          <Input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required />
          <Input type="text" placeholder="Business Address" value={address} onChange={e => setAddress(e.target.value)} required />
          <Input type="text" placeholder="Business Type (e.g., Farm, Restaurant)" value={businessType} onChange={e => setBusinessType(e.target.value)} required />
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded" rows={3} required />

          {showBackupFields && (
            <>
              <hr className="my-4" />
              <h3 className="font-semibold mb-2">Set Backup Email & Password</h3>
              <Input type="email" placeholder="Backup Email" value={backupEmail} onChange={e => setBackupEmail(e.target.value)} required />
              <Input type="password" placeholder="Backup Password" value={backupPassword} onChange={e => setBackupPassword(e.target.value)} minLength={6} required />
            </>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Complete Onboarding
          </Button>
        </form>
        {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
        {success && <div className="mt-4 text-green-600 text-center">Onboarding complete! Redirecting...</div>}
      </div>
    </div>
  );
}
