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
      try {
        console.log('[LogoutPage] Logging out user...');
        await auth.signOut();
        console.log('[Logout] Supabase signOut called.');
        console.log('[Logout] Clearing localStorage and sessionStorage...');
        localStorage.clear();
        sessionStorage.clear();
        // Remove all cookies (Supabase may use cookies for session info)
        document.cookie.split(';').forEach(c => {
          document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
        });
        console.log('[Logout] Forcing full reload to /login...');
        window.location.href = '/login';
      } catch (error) {
        console.error('[Logout] Error during logout:', error);
      }
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
