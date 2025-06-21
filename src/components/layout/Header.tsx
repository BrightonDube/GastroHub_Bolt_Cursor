import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../App';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ThemeToggle } from '../ui/ThemeToggle';
import { 
  ChefHat, 
  Bell, 
  User, 
  LogOut, 
  Settings,
  ShoppingCart,
  Package,
  Truck
} from 'lucide-react';

export function Header() {
  console.log('[Header] Render');
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();
  console.log('[Header] user:', user);

  const handleSignOut = async () => {
    console.log('[Header] handleSignOut called');
    try {
      const result = await signOut();
      console.log('[Header] signOut result:', result);
      setTimeout(() => {
        console.log('[Header] Cookies after signOut:', document.cookie);
      }, 200);
      setTimeout(() => {
        console.log('[Header] Forcing full reload to /login...');
        window.location.replace('/login');
      }, 300);
    } catch (err) {
      console.error('[Header] signOut error:', err);
      alert('Logout failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  };



  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'buyer':
        return <ShoppingCart className="w-4 h-4" />;
      case 'supplier':
        return <Package className="w-4 h-4" />;
      case 'delivery_partner':
        return <Truck className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'buyer':
        return 'primary';
      case 'supplier':
        return 'secondary';
      case 'delivery_partner':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <header className="bg-card border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-primary-900 rounded-lg group-hover:bg-primary-800 transition-colors">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-primary-900">
                GastroHub
              </h1>
              <p className="text-xs text-neutral-500 -mt-1">B2B Marketplace</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/marketplace" 
              className="text-neutral-600 hover:text-primary-900 font-medium transition-colors"
            >
              Marketplace
            </Link>
            <Link 
              to="/orders" 
              className="text-neutral-600 hover:text-primary-900 font-medium transition-colors"
            >
              Orders
            </Link>
            {user?.role === 'supplier' && (
              <Link 
                to="/my-listings" 
                className="text-neutral-600 hover:text-primary-900 font-medium transition-colors"
              >
                My Listings
              </Link>
            )}
            {user?.role === 'delivery_partner' && (
              <Link 
                to="/deliveries" 
                className="text-neutral-600 hover:text-primary-900 font-medium transition-colors"
              >
                Deliveries
              </Link>
            )}
          </nav>

          {/* User Section */}
          {user ? (
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-neutral-400 hover:text-primary-600 dark:text-neutral-500 dark:hover:text-primary-400 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground">
                    {user?.profile?.full_name || user?.email || 'User'}
                  </p>
                  <div className="flex items-center justify-end space-x-1">
                    <Badge 
                      variant={getRoleColor(user.role) as 'primary' | 'secondary' | 'success' | 'default'}
                      size="sm"
                    >
                      <span className="flex items-center space-x-1">
                        {getRoleIcon(user.role)}
                        <span className="capitalize">
                          {user.role.replace('_', ' ')}
                        </span>
                      </span>
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/profile')}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}