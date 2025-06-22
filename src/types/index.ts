import { Database } from './database';

// Database table types
export type Profiles = Database['public']['Tables']['profiles']['Row'];
export type Listing = Database['public']['Tables']['listing']['Row'];
export type Order = Database['public']['Tables']['order']['Row'];
export type DeliveryTask = Database['public']['Tables']['delivery_task']['Row'];

// Insert types
export type ProfileInsert = Database['public']['Tables']['profile']['Insert'];
export type ListingInsert = Database['public']['Tables']['listing']['Insert'];
export type OrderInsert = Database['public']['Tables']['order']['Insert'];
export type DeliveryTaskInsert = Database['public']['Tables']['delivery_task']['Insert'];

// Update types
export type ProfileUpdate = Database['public']['Tables']['profile']['Update'];
export type ListingUpdate = Database['public']['Tables']['listing']['Update'];
export type OrderUpdate = Database['public']['Tables']['order']['Update'];
export type DeliveryTaskUpdate = Database['public']['Tables']['delivery_task']['Update'];

// Enum types
export type UserRole = 'buyer' | 'supplier' | 'delivery_partner';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'in_transit' | 'delivered' | 'cancelled';
export type DeliveryStatus = 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';

// Extended types with relations
export interface ListingWithSupplier extends Listing {
  supplier: Profile;
}

export interface OrderWithDetails extends Order {
  listing: Listing;
  buyer: Profile;
  supplier: Profile;
  delivery_partner?: Profile;
}

export interface DeliveryTaskWithDetails extends DeliveryTask {
  order: OrderWithDetails;
  delivery_partner: Profile;
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  profiles: Profiles;
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