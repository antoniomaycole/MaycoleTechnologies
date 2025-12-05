import { useState } from 'react';
import { motion } from 'motion/react';
import { MerchandiseSection, MerchandiseProduct } from './MerchandiseSection';
import { MerchandiseCart, CartItem } from './MerchandiseCart';
import { MerchandiseCheckout } from './MerchandiseCheckout';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';

export function StorePage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleAddToCart = (product: MerchandiseProduct) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
          selectedColor: product.colors?.[0],
          selectedSize: product.sizes?.[0],
        },
      ];
    });

    // Show toast notification
    alert(`${product.name} added to cart!`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
      );
    }
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-black">
      {/* Header with Cart Button */}
      <motion.header
        className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MT Store
            </h1>
            <p className="text-xs text-slate-500">Official Merchandise</p>
          </motion.div>

          <Button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Cart</span>
            {cartCount > 0 && (
              <motion.span
                className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
              >
                {cartCount}
              </motion.span>
            )}
          </Button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <MerchandiseSection onAddToCart={handleAddToCart} />
      </main>

      {/* Cart Sidebar */}
      <MerchandiseCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <MerchandiseCheckout
          items={cartItems}
          onBack={() => {
            setIsCheckoutOpen(false);
            setIsCartOpen(true);
          }}
          onSuccess={() => {
            setIsCheckoutOpen(false);
            setIsCartOpen(false);
            setCartItems([]);
            // Redirect to home after 3 seconds
            setTimeout(() => {
              window.location.href = '/';
            }, 3000);
          }}
        />
      )}
    </div>
  );
}
