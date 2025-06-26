// WARNING: Do NOT use useAuth directly in components.
// useAuth is ONLY for use inside AuthProvider. All components/pages/hooks must use useAuthContext from App.tsx instead.
// Debug: If you see this in a component, you are using it incorrectly.
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profiles, AuthUser } from '../types';

export function useAuth() {
  // DEBUG: useAuth initialized
  console.log('[useAuth] Initialized');

  const fetchUserProfile = async (user: User): Promise<{ data: Profiles | null; error: string | null }> => {
    console.log('[fetchUserProfile] Called for user:', user.id);
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('[fetchUserProfile] Error fetching profile:', error);
        return { data: null, error: error.message };
      }

      console.log('[fetchUserProfile] Profile fetched successfully:', profile);
      return { data: profile, error: null };
    } catch (error) {
      console.error('[fetchUserProfile] Exception:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { data: null, error: errorMessage };
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
      console.log('[signOut] Starting logout process...');
      // 1. Supabase sign out
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // 2. Clear auth-related storage only (more targeted approach)
      const authKeys = ['sb-access-token', 'sb-refresh-token', 'supabase.auth.token'];
      authKeys.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      
      // 3. Clear only Supabase auth cookies (more targeted approach)
      const authCookies = ['sb-access-token', 'sb-refresh-token'];
      authCookies.forEach(cookieName => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      });
      
      console.log('[signOut] Logout completed successfully');
      return { error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('[signOut] Logout error:', errorMessage);
      return { error: errorMessage };
    }
  };

  return {
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    fetchUserProfile, // Exported so AuthProvider can use it
  };
}