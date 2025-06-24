import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';

export function Footer() {
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
              The leading B2B marketplace for the food industry.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Platform</h3>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li><Link to="/marketplace" className="hover:text-primary-600 dark:hover:text-white">Marketplace</Link></li>
              <li><Link to="/suppliers" className="hover:text-primary-600 dark:hover:text-white">Suppliers</Link></li>
              <li><Link to="/delivery" className="hover:text-primary-600 dark:hover:text-white">Delivery</Link></li>
              <li><Link to="/analytics" className="hover:text-primary-600 dark:hover:text-white">Analytics</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Company</h3>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li><Link to="/about" className="hover:text-primary-600 dark:hover:text-white">About</Link></li>
              <li><Link to="/careers" className="hover:text-primary-600 dark:hover:text-white">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-primary-600 dark:hover:text-white">Contact</Link></li>
              <li><Link to="/blog" className="hover:text-primary-600 dark:hover:text-white">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Support</h3>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li><Link to="/help" className="hover:text-primary-600 dark:hover:text-white">Help Center</Link></li>
              <li><Link to="/terms" className="hover:text-primary-600 dark:hover:text-white">Terms</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-primary-600 dark:hover:text-white">Privacy</Link></li>
              <li><Link to="/security" className="hover:text-primary-600 dark:hover:text-white">Security</Link></li>
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
