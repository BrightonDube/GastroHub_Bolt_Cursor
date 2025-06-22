import { UserRole } from '../types/auth';

/**
 * Get the default dashboard path for a user based on their role
 */
export function getDashboardPathByRole(role: UserRole): string {
  switch (role) {
    case 'buyer':
      return '/buyer/dashboard';
    case 'supplier':
      return '/supplier/dashboard';
    case 'delivery_partner':
      return '/delivery/dashboard';
    default:
      return '/dashboard';
  }
}
