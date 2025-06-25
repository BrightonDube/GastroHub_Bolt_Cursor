import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../App';
import { cn } from '../../utils/cn';
import { isSuperAdmin } from '../../utils/superAdmin';
import { getDashboardPathByRole } from '../../utils/dashboardPaths';
import { UserRole } from '../../types/index';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Truck,
  PlusCircle,
  BarChart3,
  Settings,
  Users,
  FileText,
} from 'lucide-react';

export function Sidebar() {
  console.log('[Sidebar] Render');
  const { user } = useAuthContext();
  const location = useLocation();
  console.log('[Sidebar] user:', user);

  const validRoles: UserRole[] = ['buyer', 'supplier', 'delivery_partner'];

  const getNavigationItems = () => {
    const baseItems = [
      {
        name: 'Dashboard',
        href: getDashboardPathByRole(user.role as UserRole),
        icon: LayoutDashboard,
      },
    ];

    const roleSpecificItems: Record<UserRole, Array<{name: string, href: string, icon: any}>> = {
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
          href: '/supplier/listings',
          icon: Package,
        },
        {
          name: 'Add Listing',
          href: '/supplier/listings/new',
          icon: PlusCircle,
        },
        {
          name: 'Orders',
          href: '/supplier/orders',
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
          name: 'My Deliveries',
          href: '/deliveries',
          icon: Truck,
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

    // Always show base and settings items for public/unauthenticated users
    if (!user) {
      return [
        ...baseItems,
        ...settingsItems,
      ];
    }
    // If user exists but has no role, show minimal nav
    if (!user.role) {
      console.warn('[Sidebar] User exists but has no role; showing minimal navigation.');
      return [
        ...baseItems,
        ...settingsItems,
      ];
    }
    if (isSuperAdmin(user)) {
      // Show all navigation items for all roles
      return [
        ...baseItems,
        ...roleSpecificItems['buyer'],
        ...roleSpecificItems['supplier'],
        ...roleSpecificItems['delivery_partner'],
        ...settingsItems,
      ];
    }
    if (!validRoles.includes(user.role as UserRole)) {
      // Unknown or invalid role: show only base and settings
      console.warn(`[Sidebar] Unexpected user.role: '${user.role}'. Showing minimal navigation.`);
      return [
        ...baseItems,
        ...settingsItems,
      ];
    }
    return [
      ...baseItems,
      ...roleSpecificItems[user.role as UserRole],
      ...settingsItems,
    ];
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div
        className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto"
        style={{
          background: 'var(--card)',
          borderRight: '1px solid var(--stroke)'
        }}
      >
        <div className="flex-grow flex flex-col">
          <nav className="flex-1 px-4 space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              // Disable links to unimplemented or placeholder routes
              const disabledRoutes = [
                '/suppliers',
                '/delivery',
              ];
              const isDisabled = disabledRoutes.includes(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-var(--primary-50) text-var(--primary-900) border-r-2 border-var(--primary-900)'
                      : 'text-var(--neutral-600) hover:bg-var(--neutral-50) hover:text-var(--neutral-900)',
                    isDisabled && 'opacity-50 pointer-events-none'
                  )}
                  tabIndex={isDisabled ? -1 : undefined}
                  aria-disabled={isDisabled ? 'true' : undefined}
                >
                  <item.icon
                    className={cn(
                      'mr-3 flex-shrink-0 h-5 w-5 transition-colors',
                      isActive
                        ? 'text-var(--primary-900)'
                        : 'text-var(--neutral-400) group-hover:text-var(--neutral-600)'
                    )}
                  />
                  {item.name}
                  {isDisabled && <span className="ml-2 text-xs">(Coming Soon)</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}