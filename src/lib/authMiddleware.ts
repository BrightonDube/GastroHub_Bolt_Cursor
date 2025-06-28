import { createServerClient } from '@supabase/ssr';
import { supabase } from './supabase';
import { isSuperAdmin } from '../utils/superAdmin';
import { Profiles } from '../types';

/**
 * Validates user session and role on the server side
 * Use this for protecting API routes or server-side rendering
 * 
 * @returns Object with user, profile, and validation results
 */
export const validateUserSession = async () => {
  try {
    // Check for active session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('[Auth Middleware] Session error:', sessionError);
      return { 
        isAuthenticated: false, 
        isAuthorized: false, 
        user: null, 
        profile: null, 
        error: sessionError.message 
      };
    }

    if (!session) {
      return { 
        isAuthenticated: false, 
        isAuthorized: false,
        user: null, 
        profile: null, 
        error: 'No active session' 
      };
    }

    // Get user profile for role information
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('[Auth Middleware] Profile fetch error:', profileError);
      // User exists but profile fetch failed
      return { 
        isAuthenticated: true, 
        isAuthorized: false,
        user: session.user, 
        profile: null, 
        error: profileError.message 
      };
    }

    return { 
      isAuthenticated: true, 
      isAuthorized: true,
      user: session.user, 
      profile, 
      error: null 
    };
  } catch (err) {
    console.error('[Auth Middleware] Validation error:', err);
    return { 
      isAuthenticated: false, 
      isAuthorized: false,
      user: null, 
      profile: null, 
      error: err instanceof Error ? err.message : 'Unknown error validating session' 
    };
  }
};

/**
 * Checks if a user has the required role for an operation
 * Also allows super admin access to everything
 * 
 * @param profile User profile with role information
 * @param requiredRole Role required for access
 * @returns Boolean indicating if user is authorized
 */
export const hasRequiredRole = (profile: Profiles | null, user: any, requiredRole: string): boolean => {
  // Super admin bypass - always authorized
  if (isSuperAdmin(user)) {
    return true;
  }

  if (!profile) {
    return false;
  }

  // Check if user's role matches required role
  return profile.role === requiredRole;
};

/**
 * Creates a redirect response for unauthorized users
 * 
 * @param redirectUrl URL to redirect to
 * @returns Response object with redirect
 */
export const createAuthRedirect = (redirectUrl: string = '/login') => {
  // For server-side rendering
  return {
    redirect: {
      destination: redirectUrl,
      permanent: false,
    },
  };
};
