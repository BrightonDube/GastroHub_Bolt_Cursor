import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../../App';
import { isSuperAdmin } from '../../utils/superAdmin';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthContext();
  console.log('[ProtectedRoute] Render: user =', user, 'loading =', loading);

  if (loading) {
    console.log('[ProtectedRoute] Still loading, rendering spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  if (!user) {
    console.log('[ProtectedRoute] No user, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  // Super admin bypass: allow all access
  if (isSuperAdmin(user)) {
    console.log('[ProtectedRoute] User is super admin, rendering children');
    return children ? <>{children}</> : <Outlet />;
  }

  console.log('[ProtectedRoute] User authenticated, rendering children');
  return children ? <>{children}</> : <Outlet />;
}

export default ProtectedRoute;