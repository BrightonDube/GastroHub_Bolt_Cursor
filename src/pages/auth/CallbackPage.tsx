import React, { useState, useEffect } from 'react';
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
      console.log('[CallbackPage] Finalizing OAuth login with backup and onboarding enforcement...');
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('[CallbackPage] getSession result:', session, 'error:', error);
      if (session?.user && !error) {
        // Fetch user profiles
        let profilesResult = null;
        if (auth && typeof auth.fetchUserProfile === 'function') {
          profilesResult = await auth.fetchUserProfile(session.user);
          if (profilesResult && profilesResult.error) {
            setErrorMsg(profilesResult.error);
            console.error('[CallbackPage] Error fetching/creating profiles:', profilesResult.error);
            return;
          }
        }
        const profiles = profilesResult?.data;
        // --- 1. Detect Google sign-in ---
        const identities = session.user.identities || [];
        const hasGoogle = identities.some((id) => id.provider === 'google');
        const hasEmail = identities.some((id) => id.provider === 'email');
        const onboardingIncomplete = profiles && (!profiles.role || profiles.onboarding_complete === false);

        // --- Unified onboarding/backup credential flow ---
        if ((hasGoogle && !hasEmail) || onboardingIncomplete) {
          console.log('[CallbackPage] Redirecting to unified onboarding/backup credential flow.');
          navigate('/onboarding/unified', { replace: true });
          return;
        }

        // --- All checks passed, allow dashboard access ---
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

