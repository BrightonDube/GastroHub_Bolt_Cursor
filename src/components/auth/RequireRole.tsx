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

  // Wait for auth to load
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If user is missing or role is missing/null/empty, redirect to /select-role
  if (!user || !user.role) {
    // Don't redirect if already on /select-role
    if (location.pathname !== '/select-role') {
      return <Navigate to="/select-role" replace state={{ from: location }} />;
    }
  }

  // Render children if role exists
  return <>{children}</>;
};
