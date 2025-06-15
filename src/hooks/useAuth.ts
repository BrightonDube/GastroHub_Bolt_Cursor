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
    console.log('[useAuth] fetchUserProfile called for', authUser);
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
      console.log('[useAuth] fetchUserProfile profile:', profile, 'error:', error);

      if (error) {
        console.error('[useAuth] Error fetching profile:', error);
        console.error('Error fetching profile:', error);
        return;
      }

      if (profile) {
        console.log('[useAuth] Profile found:', profile);
        setUser({
          id: authUser.id,
          email: authUser.email!,
          role: profile.role,
          profile,
        });
      }
    } catch (error) {
    console.error('[useAuth] Error in fetchUserProfile:', error);
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData: {
    fullName: string;
    role: 'buyer' | 'supplier' | 'delivery_partner';
    businessName?: string;
    phone?: string;
  }) => {
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

      if (error) throw error;

      // Create profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: userData.fullName,
            role: userData.role,
            business_name: userData.businessName,
            phone: userData.phone,
          });

        if (profileError) throw profileError;
      }

      return { data, error: null };
    } catch (error: unknown) {
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
          redirectTo: `${window.location.origin}/dashboard`,
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      return { error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { error: errorMessage };
    }
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };
}