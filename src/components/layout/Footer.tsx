import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { useAuthContext } from '../../App';

export function Footer() {
  const { user } = useAuthContext();

  // Helper function to get role-specific analytics path
  const getAnalyticsPath = () => {
    if (!user) return '/analytics';
    
    const role = user.profiles?.role || user.role;
    if (!role) return '/analytics';
    
    // Map role to role-specific analytics path
    switch (role) {
      case 'buyer':
        return '/buyer/analytics';
      case 'supplier':
        return '/supplier/analytics';
      case 'delivery_partner':
        return '/delivery/analytics';
      case 'super_admin':
        return '/super-admin/analytics';
      default:
        return '/analytics';
    }
  };

  return (
    <footer className="bg-background text-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ChefHat className="w-8 h-8 text-primary-900 dark:text-secondary-400" />
              <span className="text-xl font-heading font-bold text-primary-900 dark:text-white">GastroHub</span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">
              The leading B2B marketplace for the food & beverage industry.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Platform</h3>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li><Link to="/marketplace" className="hover:text-primary-600 dark:hover:text-white">Marketplace</Link></li>
              {/* Only show analytics link for logged-in users with roles */}
              {user && (user.profiles?.role || user.role) && (
                <li>
                  <Link 
                    to={getAnalyticsPath()} 
                    className="hover:text-primary-600 dark:hover:text-white"
                  >
                    Analytics
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Company</h3>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li>
                <Link 
                  to="/about" 
                  className="hover:text-primary-600 dark:hover:text-white"
                  target={user ? "_blank" : "_self"}
                  rel={user ? "noopener noreferrer" : ""}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/careers" 
                  className="hover:text-primary-600 dark:hover:text-white"
                  target={user ? "_blank" : "_self"}
                  rel={user ? "noopener noreferrer" : ""}
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="hover:text-primary-600 dark:hover:text-white"
                  target={user ? "_blank" : "_self"}
                  rel={user ? "noopener noreferrer" : ""}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="hover:text-primary-600 dark:hover:text-white"
                  target={user ? "_blank" : "_self"}
                  rel={user ? "noopener noreferrer" : ""}
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Support</h3>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li><Link to="/help" className="hover:text-primary-600 dark:hover:text-white" tabIndex={-1} aria-disabled="true" style={{pointerEvents: 'none', opacity: 0.5}}>Help Center (Coming Soon)</Link></li>
              <li>
                <Link 
                  to="/terms" 
                  className="hover:text-primary-600 dark:hover:text-white"
                  target={user ? "_blank" : "_self"}
                  rel={user ? "noopener noreferrer" : ""}
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy-policy" 
                  className="hover:text-primary-600 dark:hover:text-white"
                  target={user ? "_blank" : "_self"}
                  rel={user ? "noopener noreferrer" : ""}
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-200 dark:border-neutral-800 mt-8 pt-8 text-center text-neutral-600 dark:text-neutral-400">
          <p>&copy; {new Date().getFullYear()} GastroHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
