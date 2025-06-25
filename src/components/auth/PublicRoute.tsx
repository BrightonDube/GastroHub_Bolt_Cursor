import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../../App';
import { isSuperAdmin } from '../../utils/superAdmin';

interface PublicRouteProps {
  children?: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { user, loading } = useAuthContext();
  console.log('[PublicRoute] Render: user =', user, 'loading =', loading);

  if (loading) {
    console.log('[PublicRoute] Still loading, rendering spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  if (user) {
    let dashboardPath = '/dashboard';
    if (isSuperAdmin(user)) {
      dashboardPath = '/super-admin/dashboard';
    } else if (user.role === 'buyer') {
      dashboardPath = '/buyer/dashboard';
    } else if (user.role === 'supplier') {
      dashboardPath = '/supplier/dashboard';
    } else if (user.role === 'delivery_partner') {
      dashboardPath = '/delivery/dashboard';
    }
    console.log('[PublicRoute] User exists, redirecting to', dashboardPath);
    return <Navigate to={dashboardPath} replace />;
  }

  console.log('[PublicRoute] No user, rendering children');
  return children ? <>{children}</> : <Outlet />;
}

export default PublicRoute;