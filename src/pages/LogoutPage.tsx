import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../App';

/**
 * LogoutPage: Clears user session, localStorage, and redirects to login.
 */
export default function LogoutPage() {
  const navigate = useNavigate();
  const auth = useAuthContext();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const doLogout = async () => {
      try {
        console.log('[LogoutPage] Logging out user...');
        const result = await auth.signOut();
        
        if (result.error) {
          console.error('[LogoutPage] Logout error:', result.error);
          setError(result.error);
          return;
        }
        
        console.log('[LogoutPage] Logout successful, navigating to login');
        
        // Give a brief moment for auth state to clear
        setTimeout(() => {
          try {
            navigate('/login', { replace: true });
            console.log('[LogoutPage] Navigated to /login using navigate()');
          } catch (err) {
            console.warn('[LogoutPage] navigate() failed, falling back to window.location.replace');
            window.location.replace('/login');
          }
        }, 100);
        
      } catch (error) {
        console.error('[LogoutPage] Error during logout:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      }
    };
    doLogout();
    // eslint-disable-next-line
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold text-red-600 mb-4">Logout Failed</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/login', { replace: true })}
            className="px-4 py-2 bg-primary-900 text-white rounded hover:bg-primary-800"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg font-semibold">Logging out...</div>
    </div>
  );
}
