import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Truck,
  PlusCircle,
  BarChart3,
  Settings,
  Users,
  MapPin,
  CreditCard,
  FileText,
} from 'lucide-react';

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const getNavigationItems = () => {
    const baseItems = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ];

    const roleSpecificItems = {
      buyer: [
        {
          name: 'Marketplace',
          href: '/marketplace',
          icon: ShoppingCart,
        },
        {
          name: 'My Orders',
          href: '/orders',
          icon: FileText,
        },
        {
          name: 'Suppliers',
          href: '/suppliers',
          icon: Users,
        },
      ],
      supplier: [
        {
          name: 'My Listings',
          href: '/my-listings',
          icon: Package,
        },
        {
          name: 'Add Listing',
          href: '/add-listing',
          icon: PlusCircle,
        },
        {
          name: 'Orders',
          href: '/orders',
          icon: FileText,
        },
        {
          name: 'Analytics',
          href: '/analytics',
          icon: BarChart3,
        },
      ],
      delivery_partner: [
        {
          name: 'Available Deliveries',
          href: '/deliveries/available',
          icon: MapPin,
        },
        {
          name: 'My Deliveries',
          href: '/deliveries',
          icon: Truck,
        },
        {
          name: 'Earnings',
          href: '/earnings',
          icon: CreditCard,
        },
      ],
    };

    const settingsItems = [
      {
        name: 'Settings',
        href: '/settings',
        icon: Settings,
      },
    ];

    return [
      ...baseItems,
      ...roleSpecificItems[user.role],
      ...settingsItems,
    ];
  };

  const navigationItems = getNavigationItems();

  return (
   <div className="hidden md:flex md:w-64 md:flex-col">
     <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-card border-r border-neutral-200 dark:border-neutral-800">
        <div className="flex-grow flex flex-col">
          <nav className="flex-1 px-4 space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                    isActive
                     ? 'bg-primary-50 text-primary-900 border-r-2 border-primary-900 dark:bg-primary-900/20 dark:text-primary-300 dark:border-primary-500'
                     : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 flex-shrink-0 h-5 w-5 transition-colors',
                     isActive ? 'text-primary-900 dark:text-primary-400' : 'text-neutral-400 group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}