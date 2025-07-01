import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { AuthUser } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { getDashboardPathByRole } from '../utils/dashboardPaths';
import type { User, Session } from '@supabase/supabase-js';

interface AuthUser extends User {
  role?: string;
  profiles?: {
    role?: string;
    full_name?: string;
    business_name?: string;
    phone?: string;
  };
}

// Enhanced Auth context with better typing and additional auth states
interface AuthContextType {
  session: Session | null;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, userData: any) => Promise<{ data: any; error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ data: any; error: string | null }>;
  signInWithGoogle: () => Promise<{ data: any; error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  recoverSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook to access auth context
 * @returns AuthContextType
 * @throws Error if used outside AuthProvider
 */
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
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
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const navigate = useNavigate();

  // Enhanced session recovery with retry logic
  const recoverSession = async () => {
    try {
      console.log('[AuthProvider] Attempting session recovery...');
      setLoading(true);
      setError(null);
      
      // Get fresh session from Supabase
      const { data: { session: freshSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('[AuthProvider] Session recovery error:', sessionError);
        throw sessionError;
      }

      if (freshSession) {
        console.log('[AuthProvider] Fresh session found, setting user data...');
        await setUserFromSession(freshSession);
      } else {
        console.log('[AuthProvider] No session found during recovery');
        setSession(null);
        setUser(null);
      }
    } catch (err) {
      console.error('[AuthProvider] Session recovery failed:', err);
      setError(err instanceof Error ? err.message : 'Session recovery failed');
      setSession(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced user data fetching with profile merging
  const setUserFromSession = async (session: Session) => {
    try {
      console.log('[AuthProvider] Setting user from session:', session.user?.id);
      
      if (!session?.user) {
        setSession(null);
        setUser(null);
        return;
      }

      setSession(session);
      
      // Fetch additional profile data
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError && profileError.code !== 'PGRST116') {
          console.warn('[AuthProvider] Profile fetch warning:', profileError);
        }

        // Merge user data with profile
        const enhancedUser: AuthUser = {
          ...session.user,
          role: profile?.role || session.user.user_metadata?.role,
          profiles: profile ? {
            role: profile.role,
            full_name: profile.full_name,
            business_name: profile.business_name,
            phone: profile.phone,
          } : undefined,
        };

        console.log('[AuthProvider] Enhanced user data:', enhancedUser);
        setUser(enhancedUser);
        setError(null);
      } catch (profileErr) {
        console.warn('[AuthProvider] Profile fetch failed, using basic user data:', profileErr);
        // Fallback to basic user data
        const basicUser: AuthUser = {
          ...session.user,
          role: session.user.user_metadata?.role,
        };
        setUser(basicUser);
      }
    } catch (err) {
      console.error('[AuthProvider] Error setting user from session:', err);
      setError(err instanceof Error ? err.message : 'Failed to set user data');
    }
  };

  // Initialize auth state and set up listeners
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('[AuthProvider] Initializing auth...');
        
        // Get initial session
        const { data: { session: initialSession }, error: initialError } = await supabase.auth.getSession();
        
        if (initialError) {
          console.error('[AuthProvider] Initial session error:', initialError);
          setError(initialError.message);
        } else if (initialSession && mounted) {
          console.log('[AuthProvider] Initial session found');
          await setUserFromSession(initialSession);
        } else {
          console.log('[AuthProvider] No initial session');
        }
      } catch (err) {
        console.error('[AuthProvider] Auth initialization error:', err);
        setError(err instanceof Error ? err.message : 'Auth initialization failed');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('[AuthProvider] Auth state change:', event, session?.user?.id);
        
        try {
          switch (event) {
            case 'SIGNED_IN':
            case 'TOKEN_REFRESHED':
              if (session) {
                await setUserFromSession(session);
              }
              break;
            case 'SIGNED_OUT':
              setSession(null);
              setUser(null);
              setError(null);
              break;
            case 'USER_UPDATED':
              if (session) {
                await setUserFromSession(session);
              }
              break;
            default:
              console.log('[AuthProvider] Unhandled auth event:', event);
          }
        } catch (err) {
          console.error('[AuthProvider] Auth state change error:', err);
          setError(err instanceof Error ? err.message : 'Auth state change failed');
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      
      if (error) {
        setError(error.message);
        return { data: null, error: error.message };
      }
      
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setError(error.message);
        return { data: null, error: error.message };
      }
      
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        setError(error.message);
        return { data: null, error: error.message };
      }
      
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google sign in failed';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setError(error.message);
        return { error: error.message };
      }
      
      // Clear local state immediately
      setSession(null);
      setUser(null);
      
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign out failed';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    session,
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    recoverSession,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
