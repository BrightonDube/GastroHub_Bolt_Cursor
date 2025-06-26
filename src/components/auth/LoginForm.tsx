import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../App';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ChefHat, Mail, Lock, Chrome } from 'lucide-react';
import { motion } from 'framer-motion';
import { getDashboardPathByRole } from '../../utils/dashboardPaths';

// Placeholder for the animated map. Replace with a real animated map if desired.
function AnimatedMap() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 bg-gradient-to-tr from-blue-900/60 to-indigo-900/80 animate-pulse"
    >
      {/* SVG map or animated shapes could go here */}
      <svg viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-40">
        <ellipse cx="200" cy="300" rx="180" ry="220" fill="url(#paint0_radial)" />
        <defs>
          <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(200 300) scale(180 220)" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60a5fa" stopOpacity="0.4" />
            <stop offset="1" stopColor="#6366f1" stopOpacity="0.1" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, signInWithGoogle } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('[LoginForm] Attempting login for', email);
    const { error, data } = await signIn(email, password);
    if (error) {
      setError(typeof error === 'string' ? error : (error && typeof error === 'object' && 'message' in error ? (error as any).message : 'Login failed'));
      setLoading(false);
      return;
    }
    // Try to get user role from returned data or context
    let role: string | undefined = data?.user?.profiles?.role;
    // Fallback: try context
    try {
      const ctx = useAuthContext();
      role = role || ctx?.user?.profiles?.role;
    } catch {}
    const dashboardPath = getDashboardPathByRole(role as any);
    console.log('[LoginForm] Login successful, redirecting to', dashboardPath);
    navigate(dashboardPath);
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    console.log('[LoginForm] Attempting Google login');
    const { error } = await signInWithGoogle();
    if (error) {
      console.error('[LoginForm] Google login failed:', error);
      setError(error);
      setGoogleLoading(false);
    } else {
      console.log('[LoginForm] Google login initiated, user will be redirected');
    }
    // Note: Don't set loading to false here as the user will be redirected
  };

  const clearError = () => {
    if (error) setError('');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#060818] to-[#0d1023] p-4">
      <div className="w-full max-w-4xl flex overflow-hidden rounded-2xl bg-[#090b13] text-white shadow-2xl">
        {/* Left side: Animated map (hidden on mobile) */}
        <div className="hidden md:block w-1/2 h-[600px] relative overflow-hidden border-r border-[#1f2130]">
          <AnimatedMap />
          {/* Overlay logo/icon */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10 pointer-events-none">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }} className="mb-6">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <ChefHat className="text-white h-6 w-6" />
              </div>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.5 }} className="text-3xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">GastroHub</motion.h2>
            <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }} className="text-sm text-center text-gray-400 max-w-xs">Sign in to your GastroHub account</motion.p>
          </div>
        </div>
        {/* Right side: Sign In Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary-900 rounded-xl flex items-center justify-center mb-4">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-neutral-100">
              Welcome back
            </h2>
            <p className="mt-2 text-neutral-400">
              Sign in to your GastroHub account
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {error && (
              <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 min-h-[37.33px] px-4"
              onClick={handleGoogleSignIn}
              loading={googleLoading}
            >
              <Chrome className="w-5 h-5" />
              <span className="inline-block">Continue with Google</span>
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#090b13] text-neutral-400">Or continue with email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError();
                    }}
                    className="pl-10"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearError();
                    }}
                    className="pl-10"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-primary-400 hover:text-primary-300">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                size="lg"
              >
                Sign in
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-neutral-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-primary-400 hover:text-primary-300">
                  Sign up now
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}