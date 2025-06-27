import React from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { Button } from './Button';
import { useCart } from '../../context/CartProvider';
import { CurrencyDisplay } from './CurrencyDisplay';

interface CartButtonProps {
  productId: string;
  productName: string;
  productImage?: string;
  supplierName: string;
  unitPrice: number;
  unit: string;
  minQuantity: number;
  maxQuantity: number;
  className?: string;
  variant?: 'default' | 'solid' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
}

export function CartButton({
  productId,
  productName,
  productImage,
  supplierName,
  unitPrice,
  unit,
  minQuantity,
  maxQuantity,
  className,
  variant = 'default',
  size = 'default',
}: CartButtonProps) {
  const { cart, addToCart, updateQuantity, removeFromCart, getItemQuantity, isInCart } = useCart();

  const currentQuantity = getItemQuantity(productId);
  const isProductInCart = isInCart(productId);

  const handleAddToCart = () => {
    addToCart({
      productId,
      productName,
      productImage,
      supplierName,
      unitPrice,
      quantity: minQuantity,
      unit,
      minQuantity,
      maxQuantity,
    });
  };

  const handleIncrement = () => {
    if (isProductInCart) {
      // Find the actual cart item ID
      const cartItem = cart.items.find(item => item.productId === productId);
      if (cartItem) {
        updateQuantity(cartItem.id, currentQuantity + 1);
      }
    } else {
      handleAddToCart();
    }
  };

  const handleDecrement = () => {
    // Find the actual cart item ID
    const cartItem = cart.items.find(item => item.productId === productId);
    if (cartItem) {
      if (currentQuantity > minQuantity) {
        updateQuantity(cartItem.id, currentQuantity - 1);
      } else if (currentQuantity === minQuantity) {
        removeFromCart(cartItem.id);
      }
    }
  };

  // If item not in cart, show "Add to Cart" button
  if (!isProductInCart) {
    return (
      <Button
        onClick={handleAddToCart}
        variant={variant}
        size={size}
        className={`gap-2 ${className}`}
      >
        <ShoppingCart className="h-4 w-4" />
        Add to Cart
      </Button>
    );
  }

  // If item is in cart, show quantity controls
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        onClick={handleDecrement}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
      >
        <Minus className="h-3 w-3" />
      </Button>
      
      <div className="flex flex-col items-center text-sm">
        <span className="font-semibold">{currentQuantity} {unit}</span>
        <CurrencyDisplay 
          amount={unitPrice * currentQuantity} 
          className="text-xs text-muted-foreground"
        />
      </div>
      
      <Button
        onClick={handleIncrement}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        disabled={currentQuantity >= maxQuantity}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}

// Simple Add to Cart button without quantity controls
export function SimpleCartButton({
  productId,
  productName,
  productImage,
  supplierName,
  unitPrice,
  unit,
  minQuantity = 1,
  maxQuantity = 999,
  className,
  children,
}: Omit<CartButtonProps, 'variant' | 'size'> & { children?: React.ReactNode }) {
  const { addToCart, isInCart } = useCart();
  const isProductInCart = isInCart(productId);

  const handleAddToCart = () => {
    addToCart({
      productId,
      productName,
      productImage,
      supplierName,
      unitPrice,
      quantity: minQuantity,
      unit,
      minQuantity,
      maxQuantity,
    });
  };

  return (
    <Button
      onClick={handleAddToCart}
      variant={isProductInCart ? 'solid' : 'default'}
      className={`gap-2 ${className}`}
    >
      <ShoppingCart className="h-4 w-4" />
      {children || (isProductInCart ? 'Added to Cart' : 'Add to Cart')}
    </Button>
  );
} 