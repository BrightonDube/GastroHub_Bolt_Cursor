import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/Button';
import { CurrencyDisplay } from '../ui/CurrencyDisplay';
import { useCart } from '../../context/CartProvider';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (!user) {
      // Save current cart and redirect to login
      onClose();
      navigate('/auth/login?redirect=/checkout');
    } else {
      // User is logged in, go to checkout
      onClose();
      navigate('/checkout');
    }
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Shopping Cart ({cart.totalItems})
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
                <Button 
                  onClick={onClose}
                  className="mt-4"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      {item.productImage && (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm">{item.productName}</h3>
                        <p className="text-xs text-muted-foreground">{item.supplierName}</p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="h-6 w-6 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <span className="text-sm font-medium">
                              {item.quantity} {item.unit}
                            </span>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.maxQuantity}
                              className="h-6 w-6 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <CurrencyDisplay 
                              amount={item.unitPrice * item.quantity}
                              className="font-medium text-sm"
                            />
                            <div className="text-xs text-muted-foreground">
                              <CurrencyDisplay amount={item.unitPrice} /> per {item.unit}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <CurrencyDisplay amount={cart.totalAmount} />
              </div>
              
              <div className="space-y-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                >
                  {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={clearCart}
                  className="w-full text-sm"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 