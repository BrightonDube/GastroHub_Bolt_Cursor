import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { AuthUser } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { getDashboardPathByRole } from '../utils/dashboardPaths';

// Enhanced Auth context with better typing and additional auth states
interface AuthContextType {
  session: any;
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
  signUp: (email: string, password: string, userData: { 
    fullName: string; 
    role?: 'buyer' | 'supplier' | 'delivery_partner'; 
    businessName?: string; 
    phone?: string; 
  }) => Promise<{ data: any; error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ data: any; error: string | null }>;
  signInWithGoogle: () => Promise<{ data: any; error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  recoverSession: () => Promise<void>; // New method for session recovery
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Custom hook to access auth context
 * @returns AuthContextType
 * @throws Error if used outside AuthProvider
 */
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within AuthProvider');
  return context;
}

// Cookie options for enhanced session management
const cookieOptions = {
  name: "auth-session",
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 7, // 1 week
};

/**
 * AuthProvider - Manages authentication state and provides auth methods
 * Uses PKCE flow with enhanced session handling
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const auth = useAuth();
  const navigate = useNavigate();

  // Unified function to set user state from session
  const setUserFromSession = async (session: any) => {
    if (!session?.user) {
      setUser(null);
      return;
    }

    const { id, email } = session.user;
    
    try {
      const result = await auth.fetchUserProfile(session.user);
      
      if (result.error) {
        console.warn('[Auth] Profile fetch error:', result.error);
        // Set basic user info even if profile fetch fails
        setUser({ id, email, role: 'authenticated', profiles: null });
      } else {
        // Use the role from profiles, not from session.user
        const userRole = result.data?.role || 'authenticated';
        setUser({ id, email, role: userRole, profiles: result.data });
      }
    } catch (err) {
      console.error('[Auth] Exception fetching profile:', err);
      setUser({ id, email, role: 'authenticated', profiles: null });
      setError(err instanceof Error ? err : new Error('Unknown error fetching profile'));
    }
  };

  // Enhanced session recovery method for client-side redirects
  const recoverSession = async () => {
    setLoading(true);
    try {
      const { data, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }
      
      if (data?.session) {
        setSession(data.session);
        await setUserFromSession(data.session);
      } else {
        // Clear auth state if no valid session found
        setSession(null);
        setUser(null);
      }
    } catch (err) {
      console.error('[Auth] Session recovery failed:', err);
      setError(err instanceof Error ? err : new Error('Failed to recover session'));
      // Clear auth state on error
      setSession(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // First check for existing session
    const initialSessionCheck = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (data?.session) {
          setSession(data.session);
          await setUserFromSession(data.session);
        }
      } catch (err) {
        console.error('[Auth] Initial session check failed:', err);
        setError(err instanceof Error ? err : new Error('Failed to check initial session'));
      } finally {
        setLoading(false);
      }
    };

    initialSessionCheck();

    // Then set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth] Auth state change event:', event);
        
        switch (event) {
          case 'INITIAL_SESSION':
            // Already handled by initialSessionCheck above
            break;

          case 'SIGNED_IN':
            setSession(session);
            await setUserFromSession(session);
            setLoading(false);
            setError(null);
            break;

          case 'SIGNED_OUT':
            setSession(null);
            setUser(null);
            setLoading(false);
            setError(null);
            // Clean up any stale auth data
            try {
              const authKeys = ["sb-access-token", "sb-refresh-token"];
              authKeys.forEach(key => {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
              });
            } catch (err) {
              console.warn('[Auth] Storage cleanup failed:', err);
            }
            break;

          case 'TOKEN_REFRESHED':
            // Update session but don't refetch profile unless needed
            console.log('[Auth] Token refreshed');
            setSession(session);
            break;

          case 'PASSWORD_RECOVERY':
            console.log('[Auth] Password recovery event');
            break;

          case 'USER_UPDATED':
            if (session) {
              await setUserFromSession(session);
            }
            break;

          default:
            console.log('[Auth] Unhandled event:', event);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const contextValue: AuthContextType = {
    session,
    user,
    loading,
    error,
    signUp: auth.signUp,
    signIn: auth.signIn,
    signInWithGoogle: auth.signInWithGoogle,
    signOut: auth.signOut,
    recoverSession,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
