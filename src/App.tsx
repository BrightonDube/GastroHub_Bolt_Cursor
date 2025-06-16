import React from 'react';
import { Toaster } from 'sonner';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './hooks/useAuth';
import React, { createContext, useContext } from 'react';
import { HomePage } from './pages/HomePage';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { DashboardPage } from './pages/DashboardPage';
import { OrderDetailPage } from './pages/supplier/OrderDetailPage';
import { OrdersPage } from './pages/supplier/OrdersPage';
import SupplierMessages from './pages/supplier/SupplierMessages';
import { CreateOrderPage } from './pages/orders/CreateOrderPage';
import { OrderProcessingPage } from './pages/orders/OrderProcessingPage';
import { OrderUpdatePage } from './pages/orders/OrderUpdatePage';
import { ThemeProvider } from './context/ThemeProvider';

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
const AuthContext = createContext(null);

function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthContext not found');
  return context;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
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

  return <>{children}</>;
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
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider>
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
              path="/register" 
              element={
                <PublicRoute>
                  <RegisterForm />
                </PublicRoute>
              } 
            />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />

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
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold text-neutral-900 mb-4">New Listing</h1>
                      <p className="text-neutral-600">This page is under construction.</p>
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/supplier/listings/edit/:id" 
              element={
                <ProtectedRoute>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold text-neutral-900 mb-4">Edit Listing</h1>
                      <p className="text-neutral-600">This page is under construction.</p>
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/supplier/orders" 
              element={
                <ProtectedRoute>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold text-neutral-900 mb-4">Supplier Orders</h1>
                      <p className="text-neutral-600">This page is under construction.</p>
                    </div>
                  </div>
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

            {/* Placeholder routes - to be implemented */}
            <Route 
              path="/marketplace" 
              element={
                <ProtectedRoute>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold text-neutral-900 mb-4">Marketplace</h1>
                      <p className="text-neutral-600">This page is under construction.</p>
                    </div>
                  </div>
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

            {/* Supplier Messages Route */}
            <Route 
              path="/supplier/messages" 
              element={
                <ProtectedRoute>
                  <SupplierMessages />
                </ProtectedRoute>
              } 
            />

export default App;