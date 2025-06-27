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
import { OrderDetailPage } from './pages/supplier/OrderDetailPage';
import { OrdersPage } from './pages/supplier/OrdersPage';
import SupplierMessages from './pages/supplier/SupplierMessages';
import { CreateOrderPage } from './pages/orders/CreateOrderPage';
import { OrderProcessingPage } from './pages/orders/OrderProcessingPage';
import { OrderUpdatePage } from './pages/orders/OrderUpdatePage';
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
  if (!context) throw new Error('AuthContext not found');
  // Debug: log context value
  console.log('[useAuthContext] called, context:', context);
  return context;
}

import { supabase } from './lib/supabase';
import { useAuth } from './hooks/useAuth';
import { getDashboardPathByRole } from './utils/dashboardPaths';
import { LocalizationProvider } from './context/LocalizationProvider';
import { CartProvider } from './context/CartProvider';

function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log('[AuthProvider] Render');
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const auth = useAuth();

  // Helper to fetch and set user profile
  const fetchAndSetUserProfile = async (session: any) => {
    if (!session?.user) {
      console.warn('[fetchAndSetUserProfile] No session or user provided');
      setUser(null);
      return;
    }
    
    const { id, email, role } = session.user;
    console.log('[fetchAndSetUserProfile] Fetching profile for user:', id);
    
    try {
      const result = await auth.fetchUserProfile(session.user);
      if (result.error) {
        console.error('[fetchAndSetUserProfile] Profile fetch error:', result.error);
        setProfileError(result.error);
        // Still set basic user info even if profile fetch fails
        setUser({ id, email, role, profiles: null });
      } else {
        console.log('[fetchAndSetUserProfile] Profile fetched successfully');
        setProfileError(null);
        setUser({ id, email, role, profiles: result.data });
      }
    } catch (err) {
      console.error('[fetchAndSetUserProfile] Exception:', err);
      setProfileError('Unexpected error fetching profile');
      setUser({ id, email, role, profiles: null });
    }
  };

  // Debug: log state changes
  React.useEffect(() => {
    console.log('[AuthProvider] session changed:', session);
  }, [session]);
  React.useEffect(() => {
    console.log('[AuthProvider] user changed:', user);
  }, [user]);
  React.useEffect(() => {
    console.log('[AuthProvider] loading changed:', loading);
  }, [loading]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    setLoading(true);
    setProfileError(null);
    console.log('[AuthProvider] useEffect (mount): fetching initial session');
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          console.log('[AuthProvider] Initial session found:', session);
          setSession(session);
          await fetchAndSetUserProfile(session);
        } else {
          console.log('[AuthProvider] No initial session');
          setSession(null);
          setUser(null);
        }
      } catch (e) {
        setProfileError('Unexpected error fetching session');
        setSession(null);
        setUser(null);
        console.error('[AuthProvider] Error in initial session fetch:', e);
      } finally {
        setLoading(false);
      }
    })();
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthProvider] onAuthStateChange event:', event, 'session:', session);
      try {
        if (event === "SIGNED_IN" && session?.user) {
          setLoading(true);
          setSession(session);
          await fetchAndSetUserProfile(session);
        } else if (event === "SIGNED_OUT") {
          console.log('[AuthProvider] SIGNED_OUT: clearing all auth state');
          setLoading(true);
          setSession(null);
          setUser(null);
          setProfileError(null);
          
          // Additional cleanup - clear any stale auth data
          try {
            localStorage.removeItem('sb-access-token');
            localStorage.removeItem('sb-refresh-token');
            sessionStorage.removeItem('sb-access-token');
            sessionStorage.removeItem('sb-refresh-token');
            console.log('[AuthProvider] SIGNED_OUT: cleaned up storage');
          } catch (err) {
            console.warn('[AuthProvider] Storage cleanup failed:', err);
          }
          
          console.log('[AuthProvider] SIGNED_OUT: user and session cleared');
        } else if (event === "TOKEN_REFRESHED" && session?.user) {
          console.log('[AuthProvider] TOKEN_REFRESHED: updating session');
          setSession(session);
          // Don't refetch profile on token refresh, just update session
        }
      } catch (e) {
        setProfileError('Unexpected error during auth state change');
        setSession(null);
        setUser(null);
        console.error('[AuthProvider] Error in onAuthStateChange:', e);
      } finally {
        setLoading(false); // Always set loading to false
      }
    });
    unsubscribe = () => {
      console.log('[AuthProvider] Cleaning up onAuthStateChange listener');
      listener?.subscription?.unsubscribe?.();
    };
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      session,
      user,
      loading,
      signUp: auth.signUp,
      signIn: auth.signIn,
      signInWithGoogle: auth.signInWithGoogle,
      signOut: auth.signOut,
    }}>
      {profileError && (
        <div className="bg-red-100 text-red-800 px-4 py-2 mb-2 rounded text-center">
          Error loading profile: {profileError}
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const trace = Math.random().toString(36).substr(2, 5); // unique trace for this render
  const { user, loading } = useAuthContext();
  console.log(`[ProtectedRoute][${trace}] Render, children:`, !!children);
  console.log(`[ProtectedRoute] user:`, user, 'loading:', loading);
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
  console.log('[ProtectedRoute] User authenticated, rendering children');
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
    // Redirect to role-specific dashboard instead of generic /dashboard
    const role = user?.profiles?.role || user?.role;
    const dashboardPath = getDashboardPathByRole(role as any);
    console.log('[PublicRoute] User authenticated, redirecting to:', dashboardPath);
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
            <Route path="/buyer/dashboard" element={<ProtectedRoute><RequireRoleGuard><BuyerDashboard /></RequireRoleGuard></ProtectedRoute>} />
            <Route path="/supplier/dashboard" element={<ProtectedRoute><RequireRoleGuard><SupplierDashboard /></RequireRoleGuard></ProtectedRoute>} />
            <Route path="/delivery/dashboard" element={<ProtectedRoute><RequireRoleGuard><DeliveryDashboard /></RequireRoleGuard></ProtectedRoute>} />
            <Route path="/super-admin/dashboard" element={<ProtectedRoute><RequireRoleGuard><SuperAdminDashboard /></RequireRoleGuard></ProtectedRoute>} />

            {/* Onboarding: Role Profile Form */}
            <Route path="/onboarding/role-profile" element={<ProtectedRoute><RequireRoleGuard><RoleProfileForm /></RequireRoleGuard></ProtectedRoute>} />

            {/* Supplier Routes */}
            <Route 
              path="/supplier/listings" 
              element={
                <ProtectedRoute>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold text-neutral-900 mb-4">Supplier Listings</h1>
                      <p className="text-neutral-600">This page is under construction.</p>
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/supplier/listings/new" 
              element={
                <ProtectedRoute>
                  <NewListingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/supplier/listings/edit/:id" 
              element={
                <ProtectedRoute>
                  <EditListingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/supplier/orders" 
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/supplier/orders/:id" 
              element={
                <ProtectedRoute>
                  <OrderDetailPage />
                </ProtectedRoute>
              } 
            />

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
              path="/orders" 
              element={
                <ProtectedRoute>
                  <OrdersPage />
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
              path="/orders/:id" 
              element={
                <ProtectedRoute>
                  <OrderDetailPage />
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
            <Route 
              path="/supplier/messages" 
              element={
                <ProtectedRoute>
                  <SupplierMessages />
                </ProtectedRoute>
              } 
            />
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