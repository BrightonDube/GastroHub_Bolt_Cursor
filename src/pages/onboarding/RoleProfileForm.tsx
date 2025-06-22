import React, { useState } from 'react';
import { useAuthContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

/**
 * RoleProfileForm: Shows a role-specific profile form after role selection.
 * - Buyer: liquor license (if selling alcohol), company registration
 * - Supplier: liquor license, business registration, other licenses
 * - Delivery Partner: driver's license, vehicle license, roadworthy, police clearance
 */
export default function RoleProfileForm() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [form, setForm] = useState<any>({});
  const [files, setFiles] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user || !user.role) {
    // Should not happen, but guard
    navigate('/select-role');
    return null;
  }

  // Role-specific requirements
  const requirements = {
    buyer: [
      { label: 'Company Registration', name: 'company_registration', type: 'file', required: true },
      { label: 'Liquor License (if selling alcohol)', name: 'liquor_license', type: 'file', required: false },
    ],
    supplier: [
      { label: 'Business Registration', name: 'business_registration', type: 'file', required: true },
      { label: 'Liquor License', name: 'liquor_license', type: 'file', required: true },
      { label: 'Other Licenses', name: 'other_licenses', type: 'file', required: false, multiple: true },
    ],
    delivery_partner: [
      { label: "Driver's License", name: 'drivers_license', type: 'file', required: true },
      { label: 'Vehicle License', name: 'vehicle_license', type: 'file', required: true },
      { label: 'Roadworthy Certificate', name: 'roadworthy_certificate', type: 'file', required: true },
      { label: 'Police Clearance', name: 'police_clearance', type: 'file', required: true },
    ],
  };

  const roleFields = requirements[user.role as keyof typeof requirements] || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, name: string, multiple?: boolean) => {
    if (!e.target.files) return;
    setFiles((prev: any) => ({
      ...prev,
      [name]: multiple ? Array.from(e.target.files) : e.target.files[0],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Upload each file to Supabase Storage and collect URLs
      const uploadedUrls: Record<string, string | string[]> = {};
      for (const field of roleFields) {
        const fileData = files[field.name];
        if (!fileData && field.required) {
          setError(`Missing required file: ${field.label}`);
          setLoading(false);
          return;
        }
        if (fileData) {
          if (Array.isArray(fileData)) {
            // Multiple files
            const urls: string[] = [];
            for (const f of fileData) {
              const { data, error: uploadError } = await supabase.storage.from('documents').upload(`${user.id}/${field.name}/${Date.now()}_${f.name}`, f);
              if (uploadError) {
                setError(`Failed to upload ${field.label}: ${uploadError.message}`);
                setLoading(false);
                return;
              }
              const url = supabase.storage.from('documents').getPublicUrl(data.path).publicUrl;
              urls.push(url);
            }
            uploadedUrls[field.name] = urls;
          } else {
            // Single file
            const f = fileData;
            const { data, error: uploadError } = await supabase.storage.from('documents').upload(`${user.id}/${field.name}/${Date.now()}_${f.name}`, f);
            if (uploadError) {
              setError(`Failed to upload ${field.label}: ${uploadError.message}`);
              setLoading(false);
              return;
            }
            const url = supabase.storage.from('documents').getPublicUrl(data.path).publicUrl;
            uploadedUrls[field.name] = url;
          }
        }
      }
      // Update profile table
      const { error: profileError } = await supabase.from('profile').update({ ...uploadedUrls, onboarding_complete: true }).eq('id', user.id);
      if (profileError) {
        setError('Failed to update profile: ' + profileError.message);
        setLoading(false);
        return;
      }
      navigate(`/${user.role}/dashboard`);
    } catch (err: any) {
      setError('Failed to submit profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {roleFields.map(field => (
          <div key={field.name}>
            <label className="block font-medium mb-2">{field.label}{field.required && ' *'}</label>
            <input
              type="file"
              name={field.name}
              multiple={field.multiple}
              required={field.required}
              onChange={e => handleFileChange(e, field.name, field.multiple)}
              className="block w-full border p-2 rounded"
            />
          </div>
        ))}
        {error && <div className="text-red-600">{error}</div>}
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Saving...' : 'Submit Profile'}
        </button>
      </form>
    </div>
  );
}
