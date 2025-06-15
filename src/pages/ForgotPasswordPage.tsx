import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { ChefHat, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate password reset request
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo purposes, always succeed
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via bg-[var(--background)] to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-success-100 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-success-600" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-[var(--foreground)]">
              Check Your Email
            </h2>
            <p className="mt-2 text-[var(--muted-foreground)]">
              We've sent a password reset link to {email}
            </p>
          </div>

          <Card padding="lg">
            <div className="text-center space-y-4">
              <p className="text-[var(--muted-foreground)]">
                If you don't see the email in your inbox, please check your spam folder. 
                The link will expire in 24 hours.
              </p>
              
              <div className="space-y-3">
                <Button 
                  className="w-full"
                  onClick={() => {
                    setSent(false);
                    setEmail('');
                  }}
                >
                  Send Another Email
                </Button>
                
                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via bg-[var(--background)] to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary-900 rounded-xl flex items-center justify-center mb-4">
            <ChefHat className="w-8 h-8 text-[var(--background)]" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-[var(--foreground)]">
            Forgot Password?
          </h2>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <Card padding="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-[var(--card-muted,#f9fafb)] border border-[var(--border)] text-[var(--error)] px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted-foreground)] w-5 h-5" />
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                className="pl-10"
                required
                autoComplete="email"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              size="lg"
            >
              Send Reset Link
            </Button>

            <div className="text-center">
              <Link to="/login">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </form>
        </Card>

        <div className="text-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-[var(--primary-600)] hover:text-[var(--primary-900)]">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;