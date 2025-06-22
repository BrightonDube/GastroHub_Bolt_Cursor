// Utility to check if a user is the super admin

export const SUPER_ADMIN_EMAIL = 'bradubes2009@gmail.com';

export function isSuperAdmin(user: { email?: string }): boolean {
  return user?.email?.toLowerCase() === SUPER_ADMIN_EMAIL;
}
