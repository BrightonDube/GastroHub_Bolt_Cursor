import { createClient } from '@supabase/supabase-js';
import { validateUserSession } from '../lib/authMiddleware';

/**
 * API endpoint for testing authentication error handling
 * This is used by the auth testing utility to verify proper error handling
 */
export default async function handler(req: Request) {
  try {
    // Get auth token from header
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ status: 401, message: 'Missing authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Use server-side session validation
    const validation = await validateUserSession(req);
    
    if (validation.error || !validation.isAuthenticated) {
      return new Response(
        JSON.stringify({ 
          status: 401, 
          message: 'Invalid or expired authentication',
          error: validation.error
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // If we reach here, authentication was successful
    return new Response(
      JSON.stringify({ 
        status: 200, 
        message: 'Authentication successful',
        user: validation.user
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    // Test if error handling works correctly
    console.error('Auth test error:', error);
    
    return new Response(
      JSON.stringify({ 
        status: 500, 
        message: 'Server error during authentication test',
        error: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
