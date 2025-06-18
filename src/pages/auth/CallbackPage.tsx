import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthContext } from '../../App';

/**
 * CallbackPage: Handles OAuth redirect, validates session, and finalizes login.
 * Only stores user in context if session is fully valid.
 */
export default function CallbackPage() {
  const navigate = useNavigate();
  const auth = useAuthContext();

  useEffect(() => {
    const finalizeLogin = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user && !error) {
        // Session is valid, redirect to dashboard
        navigate('/dashboard', { replace: true });
      } else {
        // No valid session, redirect to login
        navigate('/login', { replace: true });
      }
    };
    finalizeLogin();
  }, [navigate, auth]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg font-semibold">Finalizing login...</div>
    </div>
  );
}
