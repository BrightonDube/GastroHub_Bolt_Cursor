export interface Profiles {
  id: string;
  email: string;
  full_name: string | null;
  business_name: string | null;
  phone: string | null;
  role: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  profiles: Profiles | null;
}

/**
 * Listing interface for marketplace products.
 * DB table: Listing
 * DB columns: id, supplierId, name, description, category, price, unit, minOrder, maxOrder, images, isActive, createdAt, updatedAt
 */
export interface Listing {
  id: string; // uuid
  supplierId: string; // uuid
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  minOrder: number;
  maxOrder: number;
  images: string[]; // ARRAY of image URLs
  isActive: boolean;
  createdAt: string; // timestamp (ISO string)
  updatedAt: string; // timestamp (ISO string)
}

/**
 * Insert type for creating a new listing (omit id, createdAt, updatedAt)
 */
export type ListingInsert = Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Update type for updating a listing (partial, but requires id)
 */
export type ListingUpdate = Partial<Omit<Listing, 'id'>> & { id: string };
