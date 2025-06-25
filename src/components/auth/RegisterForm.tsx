import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../App';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { ChefHat, Mail, Lock, User, Building, Phone, Chrome } from 'lucide-react';
import { motion } from 'framer-motion';

// Placeholder for the animated map. Replace with a real animated map if desired.
function AnimatedMap() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 bg-gradient-to-tr from-blue-900/60 to-indigo-900/80 animate-pulse"
    >
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

export function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'buyer',
    businessName: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const { signUp, signInWithGoogle } = useAuthContext();
  const navigate = useNavigate();

  // Utility to get dashboard path by role
  function getDashboardPath(role: string) {
    if (role === 'supplier') return '/supplier/dashboard';
    if (role === 'buyer') return '/buyer/dashboard';
    if (role === 'delivery_partner') return '/delivery/dashboard';
    return '/dashboard';
  }

  const roleOptions = [
    { value: 'buyer', label: 'Buyer - I want to purchase food products' },
    { value: 'supplier', label: 'Supplier - I want to sell food products' },
    { value: 'delivery_partner', label: 'Delivery Partner - I want to deliver orders' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const { error, data } = await signUp(formData.email, formData.password, {
      fullName: formData.fullName,
      role: formData.role,
      businessName: formData.businessName || undefined,
      phone: formData.phone || undefined,
    });

    if (error) {
      setError(typeof error === 'string' ? error : (error?.message || 'Registration failed'));
    } else {
      // Use selected role for redirect
      navigate(getDashboardPath(formData.role));
    }
    console.log('[RegisterForm] Registration successful, redirecting to dashboard');
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setError('');

    const { error } = await signInWithGoogle();

    if (error) {
      setError(error);
      setGoogleLoading(false);
    }
    console.log('[RegisterForm] Google sign up successful, redirecting to dashboard');
    // Note: Don't set loading to false here as the user will be redirected
    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#060818] to-[#0d1023] p-4">
      <div className="w-full max-w-4xl flex overflow-hidden rounded-2xl bg-[#090b13] text-white shadow-2xl">
        {/* Left side: Animated map (hidden on mobile) */}
        <div className="hidden md:block w-1/2 h-[700px] relative overflow-hidden border-r border-[#1f2130]">
          <AnimatedMap />
          {/* Overlay logo/icon */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10 pointer-events-none">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }} className="mb-6">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <ChefHat className="text-white h-6 w-6" />
              </div>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.5 }} className="text-3xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">GastroHub</motion.h2>
            <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }} className="text-sm text-center text-gray-400 max-w-xs">Create your account to get started</motion.p>
          </div>
        </div>
        {/* Right side: Sign Up Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary-900 rounded-xl flex items-center justify-center mb-4">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-neutral-100">
              Join GastroHub
            </h2>
            <p className="mt-2 text-neutral-400">
              Create your account to get started
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {error && (
              <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Google Sign Up */}
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 min-h-[37.33px] px-4"
              onClick={handleGoogleSignUp}
              disabled={googleLoading}
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
                <span className="px-2 bg-[#090b13] text-neutral-400">Or sign up with email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder=""
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="pl-10"
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <Input
                    type="email"
                    placeholder=""
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                    autoComplete="email"
                  />
                </div>

                <Select
                  options={roleOptions}
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  label="I am a..."
                  required
                />

                {(formData.role === 'supplier' || formData.role === 'buyer') && (
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder=""
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                )}

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <Input
                    type="tel"
                    placeholder=""
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10"
                    autoComplete="tel"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <Input
                    type="password"
                    placeholder=""
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10"
                    required
                    autoComplete="new-password"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <Input
                    type="password"
                    placeholder=""
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10"
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-neutral-400">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-400 hover:text-primary-300">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy-policy" className="text-primary-400 hover:text-primary-300">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-neutral-400">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary-400 hover:text-primary-300">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}