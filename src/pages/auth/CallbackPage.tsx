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

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const finalizeLogin = async () => {
      console.log('[CallbackPage] Finalizing Google OAuth login...');
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('[CallbackPage] getSession result:', session, 'error:', error);
      if (session?.user && !error) {
        // Attempt to fetch/create profile if needed
        if (auth && typeof auth.fetchUserProfile === 'function') {
          const result = await auth.fetchUserProfile(session.user);
          if (result && result.error) {
            setErrorMsg(result.error);
            console.error('[CallbackPage] Error fetching/creating profile:', result.error);
            return;
          } else {
            console.log('[CallbackPage] Profile fetched/created successfully');
          }
        }
        // Session and profile valid, redirect
        navigate('/dashboard', { replace: true });
      } else {
        // No valid session, redirect to login
        setErrorMsg(error?.message || 'No valid session after OAuth login.');
        console.error('[CallbackPage] No valid session or error:', error);
      }
    };
    finalizeLogin();
  }, [navigate, auth]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg font-semibold">
        {errorMsg ? (
          <div className="text-red-600 bg-red-100 border border-red-200 rounded p-4 max-w-md mx-auto">
            <div className="font-bold mb-2">Login Error</div>
            <div>{errorMsg}</div>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => navigate('/login', { replace: true })}
            >
              Back to Login
            </button>
          </div>
        ) : (
          'Finalizing login...'
        )}
      </div>
    </div>
  );
}

