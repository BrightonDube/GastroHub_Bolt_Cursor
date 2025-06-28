import { UserRole } from '../types/index';

/**
 * Get the default dashboard path for a user based on their role
 */
export function getDashboardPathByRole(role: UserRole | string): string {
  switch (role) {
    case 'buyer':
      return '/buyer/dashboard';
    case 'supplier':
      return '/supplier/dashboard';
    case 'delivery_partner':
      return '/delivery/dashboard';
    case 'super_admin':
      return '/super-admin/dashboard';
    case 'authenticated':
    case null:
    case undefined:
      // If user doesn't have a proper role, send to role selection
      return '/select-role';
    default:
      // For any unrecognized role, also send to role selection
      return '/select-role';
  }
}
