import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, Cart, CartContextType } from '../types/cart';

// Action types for cart reducer
type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'id' | 'addedAt'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: Cart };

// Initial cart state
const initialCart: Cart = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  lastUpdated: new Date(),
};

// Cart reducer
function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.productId === action.payload.productId
      );

      let newItems: CartItem[];
      
      if (existingItemIndex > -1) {
        // Update existing item quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          ...action.payload,
          id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          addedAt: new Date(),
        };
        newItems = [...state.items, newItem];
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

      return {
        items: newItems,
        totalItems,
        totalAmount,
        lastUpdated: new Date(),
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

      return {
        items: newItems,
        totalItems,
        totalAmount,
        lastUpdated: new Date(),
      };
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.itemId
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0); // Remove items with 0 quantity

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

      return {
        items: newItems,
        totalItems,
        totalAmount,
        lastUpdated: new Date(),
      };
    }

    case 'CLEAR_CART':
      return initialCart;

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart storage utilities
const CART_STORAGE_KEY = 'gastrohub_cart';

function saveCartToStorage(cart: Cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
      ...cart,
      items: cart.items.map(item => ({
        ...item,
        addedAt: item.addedAt.toISOString(),
      })),
      lastUpdated: cart.lastUpdated.toISOString(),
    }));
  } catch (error) {
    console.warn('[CartProvider] Failed to save cart to localStorage:', error);
  }
}

function loadCartFromStorage(): Cart | null {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      items: parsed.items.map((item: any) => ({
        ...item,
        addedAt: new Date(item.addedAt),
      })),
      lastUpdated: new Date(parsed.lastUpdated),
    };
  } catch (error) {
    console.warn('[CartProvider] Failed to load cart from localStorage:', error);
    return null;
  }
}

// Provider component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  const [isLoading, setIsLoading] = React.useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: savedCart });
    }
    setIsLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveCartToStorage(cart);
    }
  }, [cart, isLoading]);

  // Cart actions
  const addToCart = (item: Omit<CartItem, 'id' | 'addedAt'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (productId: string): number => {
    const item = cart.items.find(item => item.productId === productId);
    return item?.quantity || 0;
  };

  const isInCart = (productId: string): boolean => {
    return cart.items.some(item => item.productId === productId);
  };

  const contextValue: CartContextType = {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// Hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 