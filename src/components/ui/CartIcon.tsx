import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartProvider';
import { Button } from './Button';

interface CartIconProps {
  onClick?: () => void;
  className?: string;
}

export function CartIcon({ onClick, className }: CartIconProps) {
  const { cart } = useCart();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`relative ${className}`}
    >
      <ShoppingCart className="h-5 w-5" />
      {cart.totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
          {cart.totalItems > 99 ? '99+' : cart.totalItems}
        </span>
      )}
    </Button>
  );
} 