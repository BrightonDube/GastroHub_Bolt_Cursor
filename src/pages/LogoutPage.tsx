import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../App';

/**
 * LogoutPage: Clears user session, localStorage, and redirects to login.
 */
export default function LogoutPage() {
  const navigate = useNavigate();
  const auth = useAuthContext();

  useEffect(() => {
    const doLogout = async () => {
      console.log('[LogoutPage] Logging out user...');
      // 1. Call Supabase signOut
      if (auth?.signOut) {
        await auth.signOut();
        console.log('[LogoutPage] Supabase signOut called.');
      }
      // 2. Clear localStorage/sessionStorage of auth tokens
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      sessionStorage.clear();
      console.log('[LogoutPage] Cleared localStorage and sessionStorage.');
      // 3. Optionally clear any other sensitive app state
      // 4. Redirect to home
      console.log('[LogoutPage] Redirecting to home page...');
      navigate('/', { replace: true });
    };
    doLogout();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg font-semibold">Logging out...</div>
    </div>
  );
}
