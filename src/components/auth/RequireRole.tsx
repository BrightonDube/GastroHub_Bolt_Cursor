import React from 'react';
import { useAuthContext } from '../../App';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * RequireRole - Only renders children if user.role exists. Otherwise, redirects to /select-role.
 * Usage: Wrap protected pages/components that require a user role.
 */
export const RequireRole: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuthContext();
  const location = useLocation();
  console.log('[RequireRole] Render: user =', user, 'loading =', loading, 'location =', location.pathname);

  // Wait for auth to load
  if (loading) {
    console.log('[RequireRole] Still loading, rendering spinner');
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If user is missing or role is missing/null/empty, redirect to /select-role
  if (!user || !user.role) {
    if (location.pathname !== '/select-role') {
      console.log('[RequireRole] User or role missing, redirecting to /select-role');
      return <Navigate to="/select-role" replace state={{ from: location }} />;
    }
  }

  // Render children if role exists
  console.log('[RequireRole] User and role exist, rendering children');
  return <>{children}</>;
};
