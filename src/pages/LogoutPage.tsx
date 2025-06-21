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
        // Debug: Confirm cookies after signOut
        setTimeout(() => {
          console.log('[Logout] Cookies after signOut:', document.cookie);
        }, 200);
        // Force a hard reload to /login after everything is cleared
        setTimeout(() => {
          console.log('[Logout] Forcing full reload to /login...');
          window.location.replace('/login');
        }, 300);
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
