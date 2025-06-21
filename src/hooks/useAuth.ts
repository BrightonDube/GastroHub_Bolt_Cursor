// WARNING: Do NOT use useAuth directly in components.
// useAuth is ONLY for use inside AuthProvider. All components/pages/hooks must use useAuthContext from App.tsx instead.
import { useEffect, useState } from 'react';
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

      // If error is "no rows found" or profile is null, create a new profile
      if ((!profile && (!error || (error && error.code === 'PGRST116'))) || (error && error.code === 'PGRST116')) {
        // Create a new profile for Google or missing users
        const profileInsert = {
          id: authUser.id,
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || '',
          role: 'buyer', // default or infer from metadata if possible
          business_name: authUser.user_metadata?.business_name || '',
          phone: authUser.user_metadata?.phone || '',
          created_at: new Date().toISOString(),
        };
        const { data: insertData, error: insertError } = await supabase
          .from('profile')
          .insert(profileInsert)
          .select()
          .single();
        if (insertError) {
          console.error('[fetchUserProfile] Error creating profile:', insertError);
          // Return error up the stack for UI display
          return { error: insertError.message || 'Failed to create profile', data: null };
        }
        return { error: null, data: insertData };
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
    role: 'buyer' | 'supplier' | 'delivery_partner';
    businessName?: string;
    phone?: string;
  }) => {
    console.log('[signUp] Called with:', { email, userData });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName,
            role: userData.role,
            business_name: userData.businessName,
            phone: userData.phone,
          },
        },
      });
      console.log('[signUp] Supabase signUp response:', { data, error });

      if (error) throw error;

      // Create profile
      if (data.user) {
        const profileInsert = {
          id: data.user.id,
          email: data.user.email!,
          full_name: userData.fullName,
          phone: userData.phone ?? null,
          role: userData.role ?? 'buyer',
          business_name: userData.businessName ?? null,
          // Remove fields not present in the table schema if needed
          // business_address: userData.businessAddress ?? null,
          // business_description: userData.businessDescription ?? null,
          // business_type: userData.businessType ?? null,
          // websilogo_url: userData.logo_url || null,
          // registration_number: userData.registrationNumber ?? null,
          // tax_number: userData.taxNumber ?? null,
          subscription_tier: 'free',
          logo_url: null,
          banking_details: null,
          is_verified: false
        };
        console.log('[signUp] Attempting to insert profile:', profileInsert);
        const { error: profileError } = await supabase
          .from('profiles')
          .insert(profileInsert);
        if (profileError) {
          console.error('[signUp] Error creating profile:', profileError);
          throw profileError;
        }
      }

      return { data, error: null };
    } catch (error: unknown) {
      console.error('[signUp] Exception thrown:', error);
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
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      sessionStorage.clear();
      setUser(null);
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
  };
}