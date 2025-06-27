export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  supplierName: string;
  unitPrice: number;
  quantity: number;
  unit: string;
  minQuantity: number;
  maxQuantity: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  lastUpdated: Date;
}

export interface CartContextType {
  cart: Cart;
  isLoading: boolean;
  addToCart: (item: Omit<CartItem, 'id' | 'addedAt'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
} 