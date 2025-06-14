import { Listing, ListingInsert, ListingUpdate } from '../../types';

export const mockListing: Listing = {
  id: 'listing-123',
  supplier_id: 'supplier-123',
  title: 'Fresh Organic Tomatoes',
  description: 'Premium quality organic tomatoes, locally grown',
  category: 'Fresh Produce',
  price: 25.50,
  unit: 'kg',
  min_quantity: 1,
  max_quantity: 100,
  availability: true,
  image_urls: ['https://example.com/tomato1.jpg', 'https://example.com/tomato2.jpg'],
  location: 'Test Farm, Test City',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockListingInsert: ListingInsert = {
  supplier_id: 'supplier-123',
  title: 'Fresh Organic Tomatoes',
  description: 'Premium quality organic tomatoes, locally grown',
  category: 'Fresh Produce',
  price: 25.50,
  unit: 'kg',
  min_quantity: 1,
  max_quantity: 100,
  availability: true,
  image_urls: ['https://example.com/tomato1.jpg'],
  location: 'Test Farm, Test City',
};

export const mockListingUpdate: ListingUpdate = {
  title: 'Updated Fresh Organic Tomatoes',
  price: 27.00,
  availability: false,
  updated_at: '2024-01-02T00:00:00Z',
};

export const mockListings: Listing[] = [
  mockListing,
  {
    ...mockListing,
    id: 'listing-456',
    title: 'Fresh Basil',
    category: 'Fresh Produce',
    price: 15.00,
    unit: 'bunch',
  },
  {
    ...mockListing,
    id: 'listing-789',
    title: 'Premium Olive Oil',
    category: 'Pantry Staples',
    price: 45.00,
    unit: 'bottle',
    availability: false,
  },
];