import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../App';
import { Badge } from '../ui/Badge';
import { ThemeToggle } from '../ui/ThemeToggle';
import { isSuperAdmin } from '../../utils/superAdmin';
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
import { NavLink } from '../ui/NavLink';
import { Button } from '../ui/Button';

export function Header() {
  const [legalOpen, setLegalOpen] = React.useState(false);
  const legalRef = React.useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (legalRef.current && !legalRef.current.contains(e.target as Node)) {
        setLegalOpen(false);
      }
    }
    if (legalOpen) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [legalOpen]);
  console.log('[Header] Render');
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();
  console.log('[Header] user:', user);
  if (user && isSuperAdmin(user)) {
    console.log('[Header] Super Admin detected, showing all role UI and navigation.');
  }
  console.log('[Header] signOut from context:', signOut, typeof signOut);

  const handleSignOut = async () => {
    console.log('[Header] handleSignOut called');
    try {
      console.log('[Header] About to await signOut');
      const result = await signOut();
      console.log('[Header] signOut result:', result);
      
      if (result.error) {
        console.error('[Header] signOut error:', result.error);
        alert('Logout failed: ' + result.error);
        return;
      }
      
      console.log('[Header] signOut successful, navigating to login');
      
      // Give a brief moment for auth state to clear
      setTimeout(() => {
        try {
          navigate('/login', { replace: true });
          console.log('[Header] Navigated to /login using navigate()');
        } catch (err) {
          console.warn('[Header] navigate() failed, falling back to window.location.replace');
          window.location.replace('/login');
        }
      }, 100);
      
    } catch (err) {
      console.error('[Header] signOut exception:', err);
      alert('Logout failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Use the business role from profiles if available
  const appRole = user?.profiles?.role || user?.role;

  const getRoleIcon = (role: string, user: any) => {
    if (user && isSuperAdmin(user)) {
      return <ChefHat className="w-4 h-4 text-primary-700" />;
    }
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

  const getRoleColor = (role: string, user: any) => {
    if (isSuperAdmin(user)) {
      return 'primary';
    }
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

  // Notification state (example: fetch from backend or context)
  const [unreadNotifications, setUnreadNotifications] = React.useState<number>(0);
  // TODO: Replace with real notification fetching logic
  React.useEffect(() => {
    // Simulate fetching unread notifications
    setUnreadNotifications(2); // Set to 0 for no badge, >0 to show badge
  }, []);

  // Navigation links for all roles
  // Responsive and role-aware nav links
  const navLinks = [
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/about', label: 'About' },
    { to: '/blog', label: 'Blog' },
    { to: '/careers', label: 'Careers' },
    // Role-specific links - only add if user has the right role or is super admin
    ...(user && (appRole === 'buyer' || isSuperAdmin(user)) ? [{ to: '/orders', label: 'Orders', role: 'buyer' }] : []),
    ...(user && (appRole === 'supplier' || isSuperAdmin(user)) ? [{ to: '/supplier/listings', label: 'My Listings', role: 'supplier' }] : []),
    ...(user && (appRole === 'delivery_partner' || isSuperAdmin(user)) ? [{ to: '/deliveries', label: 'Deliveries', role: 'delivery_partner' }] : []),
  ];

  // Super admin sees all links, others see by role
  const showLink = (link: any) => {
    if (!link.role) return true;
    if (user && isSuperAdmin(user)) return true;
    return appRole === link.role;
  };

  return (
    <header className="bg-card border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group" aria-label="Home">
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
            {navLinks.filter(showLink).map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className="text-neutral-600 hover:text-primary-900 font-medium transition-colors"
                aria-label={link.label}
              >
                {link.label}
              </NavLink>
            ))}
            {/* Legal Dropdown (click to open, matches navbar bg) */}
            <div className="relative" ref={legalRef}>
              <button
                className="text-neutral-600 hover:text-primary-900 font-medium transition-colors flex items-center focus:outline-none"
                onClick={() => setLegalOpen((prev: boolean) => !prev)}
                aria-haspopup="true"
                aria-expanded={legalOpen}
                type="button"
              >
                Legal
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {legalOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-card border border-neutral-200 dark:border-neutral-800 rounded shadow-lg z-50">
                  <Link to="/privacy-policy" className="block px-4 py-2 text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900" onClick={() => setLegalOpen(false)}>Privacy Policy</Link>
                  <Link to="/terms" className="block px-4 py-2 text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900" onClick={() => setLegalOpen(false)}>Terms</Link>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-neutral-600 hover:text-primary-900 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>

          {/* User Section */}
          {user ? (
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button
                className="relative p-2 text-neutral-400 hover:text-primary-600 dark:text-neutral-500 dark:hover:text-primary-400 transition-colors"
                aria-label={unreadNotifications > 0 ? `You have ${unreadNotifications} unread notifications` : 'Notifications'}
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full" />
                )}
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground">
                    {user?.profiles?.full_name || user?.email || 'User'}
                  </p>
                  <div className="flex items-center justify-end space-x-1">
                    <Badge 
                      variant={getRoleColor(appRole || '', user) as 'primary' | 'secondary' | 'success' | 'default'}
                      size="sm"
                    >
                      <span className="flex items-center space-x-1">
                        {getRoleIcon(appRole || '', user)}
                        <span className="capitalize">
                          {isSuperAdmin(user) ? 'Super Admin' : (appRole || '').replace('_', ' ')}
                        </span>
                      </span>
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={() => navigate('/profile')}
                    aria-label="Profile settings"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSignOut}
                    aria-label="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link
                to="/login"
                className="text-neutral-600 hover:text-primary-900 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-block px-4 py-2 text-center text-white bg-primary-600 hover:bg-primary-700 rounded-md shadow-sm transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}