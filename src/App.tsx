import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser } from './types';
import { Toaster } from 'sonner';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { useAuth } from './hooks/useAuth'; // Only used inside AuthProvider
import { HomePage } from './pages/HomePage';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import RequireRoleGuard from './components/auth/RequireRoleGuard';
import LogoutPage from './pages/LogoutPage';
import CallbackPage from './pages/auth/CallbackPage';
import NewListingPage from './pages/supplier/NewListingPage';
import EditListingPage from './pages/supplier/EditListingPage';
import { ThemeProvider } from './context/ThemeProvider';
import RoleProfileForm from './pages/onboarding/RoleProfileForm';
import BuyerDashboard from './pages/buyer/DashboardPage';
import SupplierDashboard from './pages/supplier/DashboardPage';
import DeliveryDashboard from './pages/delivery/DashboardPage';
import SuperAdminDashboard from './pages/superAdmin/DashboardPage';
import MarketplacePage from './pages/MarketplacePage';
import Footer from './components/layout/Footer';
import { CheckoutPage } from './pages/CheckoutPage';
import BuyerAnalyticsPage from './pages/buyer/AnalyticsPage';
import SupplierAnalyticsPage from './pages/supplier/AnalyticsPage';
import ListingsPage from './pages/supplier/ListingsPage';
import OrdersPage from './pages/supplier/OrdersPage';
import OrderDetailPage from './pages/supplier/OrderDetailPage';
import SupplierMessagesPage from './pages/supplier/SupplierMessages';
import DeliveryAnalyticsPage from './pages/delivery/AnalyticsPage';
import SuperAdminAnalyticsPage from './pages/superAdmin/AnalyticsPage';
import { CreateOrderPage } from './pages/orders/CreateOrderPage';
import { OrderProcessingPage } from './pages/orders/OrderProcessingPage';
import { OrderUpdatePage } from './pages/orders/OrderUpdatePage';

// Lazy-loaded public pages
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const ArticlePage = React.lazy(() => import('./pages/ArticlePage'));
const CareersPage = React.lazy(() => import('./pages/CareersPage'));
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = React.lazy(() => import('./pages/TermsPage'));
const CreateArticlePage = React.lazy(() => import('./pages/CreateArticlePage'));
const UnauthorizedPage = React.lazy(() => import('./pages/UnauthorizedPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));


// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Auth context to avoid multiple useAuth calls
interface AuthContextType {
  session: any;
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { fullName: string; role: 'buyer' | 'supplier' | 'delivery_partner'; businessName?: string; phone?: string; }) => Promise<{ data: any; error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ data: any; error: string | null }>;
  signInWithGoogle: () => Promise<{ data: any; error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within AuthProvider');
  return context;
}

import { supabase } from './lib/supabase';
import { useAuth } from './hooks/useAuth';
import { getDashboardPathByRole } from './utils/dashboardPaths';
import { LocalizationProvider } from './context/LocalizationProvider';
import { CartProvider } from './context/CartProvider';

// **MODERN AUTH PROVIDER - Following Supabase Best Practices**
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  // Unified function to set user state from session
  const setUserFromSession = async (session: any) => {
    if (!session?.user) {
      setUser(null);
      return;
    }

    const { id, email } = session.user;
    
    try {
      const result = await auth.fetchUserProfile(session.user);
      
      if (result.error) {
        console.warn('[Auth] Profile fetch error:', result.error);
        // Set basic user info even if profile fetch fails
        setUser({ id, email, role: 'authenticated', profiles: null });
      } else {
        // Use the role from profiles, not from session.user
        const userRole = result.data?.role || 'authenticated';
        setUser({ id, email, role: userRole, profiles: result.data });
      }
    } catch (err) {
      console.error('[Auth] Exception fetching profile:', err);
      setUser({ id, email, role: 'authenticated', profiles: null });
    }
  };

  useEffect(() => {
    // **CRITICAL: Use ONLY onAuthStateChange - no manual getSession()**
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        switch (event) {
          case 'INITIAL_SESSION':
            // Handle initial session on app load/refresh
            setSession(session);
            if (session) {
              await setUserFromSession(session);
            } else {
              setUser(null);
            }
            setLoading(false);
            break;

          case 'SIGNED_IN':
            setSession(session);
            await setUserFromSession(session);
            setLoading(false);
            break;

          case 'SIGNED_OUT':
            setSession(null);
            setUser(null);
            setLoading(false);
            // Clean up any stale auth data
            try {
              const authKeys = ["sb-access-token", "sb-refresh-token"];
              authKeys.forEach(key => {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
              });
            } catch (err) {
              console.warn('[Auth] Storage cleanup failed:', err);
            }
            break;

          case 'TOKEN_REFRESHED':
            // Update session but don't refetch profile
            setSession(session);
            break;

          case 'PASSWORD_RECOVERY':
            // Handle password recovery if needed
            console.log('[Auth] Password recovery event');
            break;

          case 'USER_UPDATED':
            // Handle user updates
            if (session) {
              await setUserFromSession(session);
            }
            break;

          default:
            console.log('[Auth] Unhandled event:', event);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const contextValue: AuthContextType = {
    session,
    user,
    loading,
    signUp: auth.signUp,
    signIn: auth.signIn,
    signInWithGoogle: auth.signInWithGoogle,
    signOut: auth.signOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
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
  
  return children ? <>{children}</> : <Outlet />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  if (user) {
    // Redirect to role-specific dashboard
    const role = user?.profiles?.role || user?.role;
    const dashboardPath = getDashboardPathByRole(role as any);
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider>
      <LocalizationProvider>
        <CartProvider>
          <Toaster position="top-right" />
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
          <Router>
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginForm />
                </PublicRoute>
              } 
            />
            <Route 
              path="/auth/logout" 
              element={<LogoutPage />} 
            />
            <Route 
              path="/auth/callback" 
              element={<CallbackPage />} 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <RegisterForm />
                </PublicRoute>
              } 
            />

            {/* Protected Routes */}
            <Route 
              path="/select-role"
              element={
                <ProtectedRoute>
                  <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                    {/** Lazy load SelectRolePage */}
                    {React.createElement(React.lazy(() => import('./pages/SelectRolePage')))}
                  </React.Suspense>
                </ProtectedRoute>
              }
            />
            <Route path="/buyer/dashboard" element={<ProtectedRoute><RequireRoleGuard requiredRole="buyer"><BuyerDashboard /></RequireRoleGuard></ProtectedRoute>} />
            <Route path="/buyer/analytics" element={<ProtectedRoute><RequireRoleGuard requiredRole="buyer"><BuyerAnalyticsPage /></RequireRoleGuard></ProtectedRoute>} />
            
            {/* Supplier Routes */}
            <Route path="/supplier/dashboard" element={<ProtectedRoute><RequireRoleGuard requiredRole="supplier"><SupplierDashboard /></RequireRoleGuard></ProtectedRoute>} />
            <Route path="/supplier/analytics" element={<ProtectedRoute><RequireRoleGuard requiredRole="supplier"><SupplierAnalyticsPage /></RequireRoleGuard></ProtectedRoute>} />
            <Route path="/supplier/listings" element={<ProtectedRoute><RequireRoleGuard requiredRole="supplier"><ListingsPage /></RequireRoleGuard></ProtectedRoute>} />
            <Route path="/supplier/listings/new" element={<ProtectedRoute><RequireRoleGuard requiredRole="supplier"><NewListingPage /></RequireRoleGuard></ProtectedRoute>} />
            <Route path="/supplier/listings/:id/edit" element={<ProtectedRoute><RequireRoleGuard requiredRole="supplier"><EditListingPage /></RequireRoleGuard></ProtectedRoute>} />
            <Route path="/supplier/orders" element={<ProtectedRoute><RequireRoleGuard requiredRole="supplier"><OrdersPage /></RequireRoleGuard></ProtectedRoute>} />
            <Route path="/supplier/orders/:id" element={<ProtectedRoute><RequireRoleGuard requiredRole="supplier"><OrderDetailPage /></RequireRoleGuard></ProtectedRoute>} />
            <Route path="/supplier/messages" element={<ProtectedRoute><RequireRoleGuard requiredRole="supplier"><SupplierMessagesPage /></RequireRoleGuard></ProtectedRoute>} />

            {/* Delivery Routes */}
            <Route path="/delivery/dashboard" element={<ProtectedRoute><RequireRoleGuard requiredRole="delivery_partner"><DeliveryDashboard /></RequireRoleGuard></ProtectedRoute>} />
            <Route path="/delivery/analytics" element={<ProtectedRoute><RequireRoleGuard requiredRole="delivery_partner"><DeliveryAnalyticsPage /></RequireRoleGuard></ProtectedRoute>} />

            {/* Super Admin Routes */}
            <Route path="/super-admin/dashboard" element={<ProtectedRoute><RequireRoleGuard requiredRole="super_admin"><SuperAdminDashboard /></RequireRoleGuard></ProtectedRoute>} />
            <Route path="/super-admin/analytics" element={<ProtectedRoute><RequireRoleGuard requiredRole="super_admin"><SuperAdminAnalyticsPage /></RequireRoleGuard></ProtectedRoute>} />

            {/* Onboarding: Role Profile Form */}
            <Route path="/onboarding/role-profile" element={<ProtectedRoute><RequireRoleGuard><RoleProfileForm /></RequireRoleGuard></ProtectedRoute>} />

            {/* Public Pages - No Authentication Required */}
            <Route path="/about" element={<React.Suspense fallback={<div>Loading...</div>}><AboutPage /></React.Suspense>} />
            <Route path="/blog" element={<React.Suspense fallback={<div>Loading...</div>}><BlogPage /></React.Suspense>} />
            <Route path="/articles/:id" element={<React.Suspense fallback={<div>Loading...</div>}><ArticlePage /></React.Suspense>} />
            <Route path="/create-article" element={
              <ProtectedRoute>
                <RequireRoleGuard requiredRole="superadmin">
                  <React.Suspense fallback={<div>Loading...</div>}><CreateArticlePage /></React.Suspense>
                </RequireRoleGuard>
              </ProtectedRoute>
            } />
            <Route path="/unauthorized" element={<React.Suspense fallback={<div>Loading...</div>}><UnauthorizedPage /></React.Suspense>} />
            <Route path="/careers" element={<React.Suspense fallback={<div>Loading...</div>}><CareersPage /></React.Suspense>} />
            <Route path="/privacy-policy" element={<React.Suspense fallback={<div>Loading...</div>}><PrivacyPolicyPage /></React.Suspense>} />
            <Route path="/terms" element={<React.Suspense fallback={<div>Loading...</div>}><TermsPage /></React.Suspense>} />
            <Route path="/contact" element={<React.Suspense fallback={<div>Loading...</div>}><ContactPage /></React.Suspense>} />
            
            {/* Marketplace - No Authentication Required */}
            <Route 
              path="/marketplace" 
              element={<MarketplacePage />} 
            />
            
            {/* Checkout - Authentication Required */}
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/orders/new" 
              element={
                <ProtectedRoute>
                  <CreateOrderPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/orders/:id/process" 
              element={
                <ProtectedRoute>
                  <OrderProcessingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/orders/:id/update" 
              element={
                <ProtectedRoute>
                  <OrderUpdatePage />
                </ProtectedRoute>
              } 
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
            </AuthProvider>
          </QueryClientProvider>
        </CartProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;