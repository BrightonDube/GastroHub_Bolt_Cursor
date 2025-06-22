// WARNING: Do NOT use useAuth directly in components.
// useAuth is ONLY for use inside AuthProvider. All components/pages/hooks must use useAuthContext from App.tsx instead.
import { useEffect, useState } from 'react';
import bcrypt from 'bcryptjs';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile, AuthUser } from '../types';

export function useAuth() {
  // DEBUG: useAuth initialized
  console.log('[useAuth] Initialized');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      console.log('[useAuth] getInitialSession called');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('[useAuth] getSession result:', session);
      if (session?.user) {
        await fetchUserProfile(session.user);
      }
    };

    console.log('[useAuth] Before getInitialSession');
    getInitialSession();
    console.log('[useAuth] After getInitialSession');

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[useAuth] onAuthStateChange event:', event, 'session:', session);
        try {
          if (session?.user) {
            await fetchUserProfile(session.user);
          } else {
            setUser(null);
          }
          setLoading(false);
        } catch (error) {
          console.error('[useAuth] Error in onAuthStateChange:', error);
        }
      }
    );

    return () => { console.log('[useAuth] Unsubscribing from auth state change'); subscription.unsubscribe(); };
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    console.log('[fetchUserProfile] Called with:', authUser);
    console.log('[useAuth] fetchUserProfile called for', authUser);
    try {
      const { data: profile, error } = await supabase
        .from('profile')
        .select('*')
        .eq('id', authUser.id)
        .single();
      console.log('[fetchUserProfile] Supabase select result:', { profile, error });

      // If profile is missing, do NOT attempt to insert it manually. Supabase auth triggers handle this.
      // Just return an error for the UI to display. This avoids duplicate key errors and RLS issues.
      if ((!profile && (!error || (error && error.code === 'PGRST116'))) || (error && error.code === 'PGRST116')) {
        console.error('[fetchUserProfile] Profile missing after auth. Supabase trigger should create it.');
        return { error: 'Profile not found. Please contact support if this persists.', data: null };
      }

      if (error) {
        console.error('[fetchUserProfile] Error fetching profile:', error);
        // Return error up the stack for UI display
        return { error: error?.message || 'Failed to fetch profile', data: null };
      }

      if (profile) {
        console.log('[fetchUserProfile] Profile exists, setting user:', profile);
        return { error: null, data: profile };
      }
    } catch (error) {
      console.error('[fetchUserProfile] Exception thrown:', error);
      // Return error up the stack for UI display
      return { error: error instanceof Error ? error.message : 'Unexpected error', data: null };
    }
  };

  const signUp = async (email: string, password: string, userData: {
    fullName: string;
    role?: 'buyer' | 'supplier' | 'delivery_partner';
    businessName?: string;
    phone?: string;
  }) => {
    console.log('[signUp] Called with:', { email, password, userData });
    try {
      const signUpPayload = {
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName,
            role: userData.role ?? 'buyer',
            business_name: userData.businessName,
            phone: userData.phone,
          },
        },
      };
      console.log('[signUp] Payload to supabase.auth.signUp:', JSON.stringify(signUpPayload, null, 2));

      const { data, error } = await supabase.auth.signUp(signUpPayload);
      console.log('[signUp] Supabase signUp response:', { data, error });
      if (data) {
        console.log('[signUp] Supabase returned data:', JSON.stringify(data, null, 2));
      }
      if (error) {
        console.error('[signUp] Supabase returned error:', error);
        if (typeof error === 'object') {
          console.error('[signUp] Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        }
        throw error;
      }
      return { data, error: null };
    } catch (error: unknown) {
      console.error('[signUp] Exception thrown:', error);
      if (typeof error === 'object') {
        console.error('[signUp] Exception details:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      }
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { data: null, error: errorMessage };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { data: null, error: errorMessage };
    }
  };


  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { prompt: 'consent' },
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { data: null, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      // 1. Supabase sign out
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // 2. Clear all auth tokens from localStorage/sessionStorage
      localStorage.clear();
      sessionStorage.clear();
      // 3. Remove all cookies (including Supabase cookies)
      document.cookie.split(';').forEach((c) => {
        const eqPos = c.indexOf('=');
        const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
        // Remove for current path
        document.cookie = name + '=;expires=' + new Date(0).toUTCString() + ';path=/';
        // Remove for root
        document.cookie = name + '=;expires=' + new Date(0).toUTCString() + ';path=/;domain=' + window.location.hostname;
      });
      setUser(null);
      // Debug: List cookies after clearing
      setTimeout(() => {
        console.log('[signOut] Cookies after clearing:', document.cookie);
      }, 200);
      return { error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { error: errorMessage };
    }
  };

  // signIn returns error if credentials are invalid or there is a problem. Navigation is handled by the LoginForm.

  return {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    fetchUserProfile, // Exported so AuthProvider can use it
  };
}