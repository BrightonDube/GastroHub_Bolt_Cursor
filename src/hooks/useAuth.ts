// WARNING: Do NOT use useAuth directly in components.
// useAuth is ONLY for use inside AuthProvider. All components/pages/hooks must use useAuthContext from App.tsx instead.
// Debug: If you see this in a component, you are using it incorrectly.
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profiles, AuthUser } from '../types';

export function useAuth() {
  const fetchUserProfile = async (user: User): Promise<{ data: Profiles | null; error: string | null }> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('[Auth] Error fetching profile:', error);
        return { data: null, error: error.message };
      }

      return { data: profile, error: null };
    } catch (error) {
      console.error('[Auth] Exception fetching profile:', error);
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

      const { data, error } = await supabase.auth.signUp(signUpPayload);
      
      if (error) {
        console.error('[Auth] SignUp error:', error);
        throw error;
      }
      
      return { data, error: null };
    } catch (error: unknown) {
      console.error('[Auth] SignUp exception:', error);
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
      
      // 2. Clear auth-related storage
      const authKeys = ['sb-access-token', 'sb-refresh-token', 'supabase.auth.token'];
      authKeys.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      
      // 3. Clear Supabase auth cookies
      const authCookies = ['sb-access-token', 'sb-refresh-token'];
      authCookies.forEach(cookieName => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      });
      
      return { error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('[Auth] Logout error:', errorMessage);
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