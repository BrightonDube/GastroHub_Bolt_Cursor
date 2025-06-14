import { AuthUser, Profile } from '../../types';

export const mockProfile: Profile = {
  id: 'user-123',
  email: 'test@example.com',
  full_name: 'Test User',
  avatar_url: null,
  role: 'buyer',
  company_name: 'Test Company',
  phone: '+1234567890',
  address: '123 Test St',
  city: 'Test City',
  state: 'TS',
  zip_code: '12345',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockAuthUser: AuthUser = {
  id: 'user-123',
  email: 'test@example.com',
  role: 'buyer',
  profile: mockProfile,
};

export const mockSupplierProfile: Profile = {
  ...mockProfile,
  id: 'supplier-123',
  email: 'supplier@example.com',
  role: 'supplier',
  company_name: 'Test Supplier Co',
};

export const mockSupplierAuthUser: AuthUser = {
  id: 'supplier-123',
  email: 'supplier@example.com',
  role: 'supplier',
  profile: mockSupplierProfile,
};

export const mockDeliveryPartnerProfile: Profile = {
  ...mockProfile,
  id: 'delivery-123',
  email: 'delivery@example.com',
  role: 'delivery_partner',
  company_name: 'Fast Delivery',
};

export const mockDeliveryPartnerAuthUser: AuthUser = {
  id: 'delivery-123',
  email: 'delivery@example.com',
  role: 'delivery_partner',
  profile: mockDeliveryPartnerProfile,
};