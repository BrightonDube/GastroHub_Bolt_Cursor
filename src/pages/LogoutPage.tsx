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
        // Prefer SPA navigation to login for a smoother UX
        try {
          navigate('/login', { replace: true });
          console.log('[LogoutPage] Navigated to /login using navigate()');
        } catch (err) {
          // Fallback: force a hard reload if navigation fails
          console.warn('[LogoutPage] navigate() failed, falling back to window.location.replace');
          window.location.replace('/login');
        }
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
