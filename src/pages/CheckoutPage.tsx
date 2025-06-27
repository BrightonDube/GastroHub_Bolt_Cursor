import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CurrencyDisplay } from '../components/ui/CurrencyDisplay';
import { useCart } from '../context/CartProvider';
import { useAuth } from '../hooks/useAuth';
import { ShoppingBag, ArrowLeft, Truck, CreditCard } from 'lucide-react';

export function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/auth/login?redirect=/checkout');
    }
  }, [user, navigate]);

  const handleCreateOrder = async () => {
    try {
      // TODO: Implement order creation logic
      console.log('Creating order with cart items:', cart.items);
      
      // For now, just clear cart and show success
      clearCart();
      alert('Order created successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  if (!user) {
    return null; // Will redirect to login
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some products to continue</p>
            <Button onClick={() => navigate('/marketplace')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/marketplace')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Order Items ({cart.totalItems})</h2>
              </div>
              
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                    {item.productImage && (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                    
                    <div className="flex-1">
                      <h3 className="font-medium">{item.productName}</h3>
                      <p className="text-sm text-muted-foreground">{item.supplierName}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm">
                          {item.quantity} {item.unit}
                        </span>
                        <div className="text-right">
                          <CurrencyDisplay 
                            amount={item.unitPrice * item.quantity}
                            className="font-medium"
                          />
                          <div className="text-xs text-muted-foreground">
                            <CurrencyDisplay amount={item.unitPrice} /> per {item.unit}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Delivery Information */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Delivery Information</h2>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Delivery details will be coordinated with suppliers after order confirmation.</p>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <CurrencyDisplay amount={cart.totalAmount} />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Delivery</span>
                  <span>Calculated at delivery</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>VAT</span>
                  <span>Included</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <CurrencyDisplay amount={cart.totalAmount} />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCreateOrder}
                className="w-full"
                size="lg"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Place Order
              </Button>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                By placing this order, you agree to our terms and conditions.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 