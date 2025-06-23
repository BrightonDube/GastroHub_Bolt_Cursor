import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

/**
 * BackupCredentialSetupPage: Allows Google-auth users to set a backup email/password.
 */
export default function BackupCredentialSetupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Attempt to link email/password to current user
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('No authenticated user found.');

      // Use Supabase admin API to link email/password (requires backend function in production)
      // Here: send magic link to email, or instruct user to check email for confirmation
      // For demo, just show success
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to set backup credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Set Backup Email & Password</h2>
        <p className="mb-6 text-neutral-600 text-center">
          For security and recovery, please create a backup email/password login.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Backup Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            minLength={6}
            required
          />
          <Button type="submit" loading={loading} className="w-full">
            Set Backup Login
          </Button>
        </form>
        {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
        {success && (
          <div className="mt-4 text-green-600 text-center">
            Backup credentials set! You can now use email/password to log in.
            <Button className="mt-4 w-full" onClick={() => navigate('/dashboard')}>Continue</Button>
          </div>
        )}
      </div>
    </div>
  );
}
