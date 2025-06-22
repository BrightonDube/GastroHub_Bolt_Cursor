import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../../App';
import { isSuperAdmin } from '../../utils/superAdmin';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Super admin bypass: allow all access
  if (isSuperAdmin(user)) {
    return children ? <>{children}</> : <Outlet />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default ProtectedRoute;