import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../App';
import { isSuperAdmin } from '../../utils/superAdmin';
import ProgressiveLoading, { AuthErrorRecovery } from '../ui/ProgressiveLoading';
import { DashboardLayout } from '../layout/DashboardLayout';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRole?: string;
  fallbackLayout?: boolean;
}

export function ProtectedRoute({ children, requiredRole, fallbackLayout = true }: ProtectedRouteProps) {
  const { user, loading, error, recoverSession } = useAuthContext();
  const location = useLocation();
  
  console.log('[ProtectedRoute] Render path:', location.pathname, 'user:', user?.id, 'role:', user?.role, 'loading:', loading);
  
  // Basic layout for when content is loading but we want to show a dashboard structure
  const BasicLayoutFallback = () => (
    fallbackLayout ? (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-lg text-muted-foreground">Loading your dashboard...</div>
        </div>
      </DashboardLayout>
    ) : (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading your content...</div>
      </div>
    )
  );
  
  // Handle loading with progressive loading states
  if (loading) {
    console.log('[ProtectedRoute] Still loading, showing progressive loading');
    return (
      <ProgressiveLoading
        fallback={<BasicLayoutFallback />}
        recovery={
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg shadow-md max-w-md mb-4">
              <h3 className="text-lg font-medium text-amber-800">Taking longer than expected</h3>
              <p className="text-sm text-amber-700 mb-4">We're having trouble loading your session.</p>
              <button 
                onClick={() => recoverSession()} 
                className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
              >
                Retry Authentication
              </button>
            </div>
          </div>
        }
        initialTimeout={800}
        recoveryTimeout={8000}
      />
    );
  }
  
  // Handle auth error states
  if (error) {
    console.error('[ProtectedRoute] Auth error:', error);
    return <AuthErrorRecovery error={error} />;
  }

  // No user means redirect to login
  if (!user) {
    console.log('[ProtectedRoute] No user, redirecting to /login with return path');
    // Remember where the user was trying to go for post-login redirect
    return <Navigate to="/login" state={{ returnTo: location.pathname }} replace />;
  }
  
  // Super admin bypass: allow all access regardless of required role
  if (isSuperAdmin(user)) {
    console.log('[ProtectedRoute] User is super admin, granting access');
    return children ? <>{children}</> : <Outlet />;
  }
  
  // Role-based access control
  if (requiredRole && user.role !== requiredRole) {
    console.log(`[ProtectedRoute] User role ${user.role} doesn't match required role ${requiredRole}, redirecting to unauthorized`);
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and authorized
  console.log('[ProtectedRoute] User authenticated and authorized, rendering content');
  return children ? <>{children}</> : <Outlet />;
}

export default ProtectedRoute;