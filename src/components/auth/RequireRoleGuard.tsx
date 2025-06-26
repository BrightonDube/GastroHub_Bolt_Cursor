import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../../App';

/**
 * RequireRoleGuard ensures that all authenticated users have a role set.
 * If not, redirects to /select-role. Can be wrapped around all protected routes.
 */
export function RequireRoleGuard({ children, requiredRole }: { children?: React.ReactNode, requiredRole?: string }) {
  const { user, loading } = useAuthContext();
  console.log('[RequireRoleGuard] Render: user =', user, 'loading =', loading, 'requiredRole =', requiredRole);

  if (loading) {
    console.log('[RequireRoleGuard] Still loading, rendering spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  // If not logged in, let ProtectedRoute handle redirect to login
  if (!user) {
    console.log('[RequireRoleGuard] No user, rendering children or Outlet');
    return children ? <>{children}</> : <Outlet />;
  }

  const appRole = user?.profiles?.role || user?.role;
  if (!appRole) {
    console.log('[RequireRoleGuard] User has no app role, redirecting to /select-role');
    return <Navigate to="/select-role" replace />;
  }

  // If requiredRole is set, enforce it
  if (requiredRole && appRole !== requiredRole) {
    console.log('[RequireRoleGuard] User app role mismatch, redirecting to /unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }

  // Otherwise, render children or nested routes
  console.log('[RequireRoleGuard] User has required role, rendering children');
  return children ? <>{children}</> : <Outlet />;
}

export default RequireRoleGuard;
