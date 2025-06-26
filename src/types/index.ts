import { Database } from './database';

// Database table types
export type Profiles = Database['public']['Tables']['profiles']['Row'];
export type Listing = Database['public']['Tables']['listing']['Row'];
export type Order = Database['public']['Tables']['order']['Row'];

// Insert types
export type ProfilesInsert = Database['public']['Tables']['profiles']['Insert'];
export type ListingInsert = Database['public']['Tables']['listing']['Insert'];
export type OrderInsert = Database['public']['Tables']['order']['Insert'];

// Update types
export type ProfilesUpdate = Database['public']['Tables']['profiles']['Update'];
export type ListingUpdate = Database['public']['Tables']['listing']['Update'];
export type OrderUpdate = Database['public']['Tables']['order']['Update'];

// Enum types
export type UserRole = 'buyer' | 'supplier' | 'delivery_partner' | 'super_admin';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'in_transit' | 'delivered' | 'cancelled';
export type DeliveryStatus = 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';

// Extended types with relations
export interface ListingWithSupplier extends Listing {
  supplier: Profiles;
}

export interface OrderWithDetails extends Order {
  listing: Listing;
  buyer: Profiles;
  supplier: Profiles;
  delivery_partner?: Profiles;
}

// Auth types
export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  phone: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  profiles: Profiles | null;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  businessName?: string;
  phone?: string;
}

export interface ListingForm {
  title: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  minQuantity: number;
  maxQuantity?: number;
  location: string;
  imageUrls: string[];
}

export interface OrderForm {
  listingId: string;
  quantity: number;
  deliveryAddress: string;
  deliveryNotes?: string;
  scheduledDelivery?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// Dashboard stats
export interface DashboardStats {
  totalOrders: number;
  activeListings: number;
  totalRevenue: number;
  completedDeliveries: number;
}