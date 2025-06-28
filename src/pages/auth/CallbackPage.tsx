import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

/**
 * CallbackPage: Handles OAuth redirect, validates session, and finalizes login.
 * Only stores user in context if session is fully valid.
 */
export default function CallbackPage() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const finalizeLogin = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session?.user && !error) {
        // Let the auth system handle profile fetching and user state
        // Just redirect to homepage - the auth system will redirect to the correct dashboard
        navigate('/', { replace: true });
      } else {
        // No valid session, redirect to login
        setErrorMsg(error?.message || 'No valid session after OAuth login.');
        console.error('[Auth] No valid session:', error);
      }
    };
    finalizeLogin();
  }, [navigate]);

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

