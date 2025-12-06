import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { X, Plus, Minus, ShoppingBag, TrendingUp } from 'lucide-react';
import { MerchandiseProduct } from './MerchandiseSection';

export interface CartItem extends MerchandiseProduct {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface MerchandiseCartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export function MerchandiseCart({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: MerchandiseCartProps) {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="absolute right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col"
        initial={{ x: 500 }}
        animate={{ x: 0 }}
        exit={{ x: 500 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-white">Shopping Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <ShoppingBag className="w-12 h-12 text-slate-700 mb-4" />
              <p className="text-slate-400">Your cart is empty</p>
              <p className="text-sm text-slate-500 mt-2">Add some items to get started!</p>
            </div>
          ) : (
            items.map((item) => (
              <motion.div
                key={item.id}
                className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Product Info */}
                <div className="flex gap-3 mb-3">
                  <div className="w-16 h-16 rounded bg-slate-700 overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm line-clamp-1">{item.name}</h4>
                    {item.selectedColor && (
                      <p className="text-xs text-slate-400">Color: {item.selectedColor}</p>
                    )}
                    {item.selectedSize && (
                      <p className="text-xs text-slate-400">Size: {item.selectedSize}</p>
                    )}
                    <p className="text-blue-500 font-bold mt-1">${item.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-slate-500 hover:text-red-500 transition-colors"
                    aria-label="Remove item from cart"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-slate-900 rounded p-2 w-fit">
                  <button
                    onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="p-1 hover:bg-slate-800 rounded transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4 text-slate-400" />
                  </button>
                  <span className="w-8 text-center text-white font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-slate-800 rounded transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Summary and Checkout */}
        {items.length > 0 && (
          <div className="border-t border-slate-700 p-6 space-y-4">
            {/* Pricing */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-500 font-semibold' : ''}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping === 0 && <p className="text-xs text-green-500">✓ Free shipping!</p>}
              <div className="flex justify-between text-slate-400">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-slate-600 pt-4 flex justify-between items-center">
              <span className="text-white font-semibold">Total</span>
              <span className="text-2xl font-bold text-blue-500">${total.toFixed(2)}</span>
            </div>

            {/* Upsell Message */}
            {subtotal < 50 && (
              <motion.div
                className="bg-blue-600/20 border border-blue-500/50 rounded p-3 text-sm text-blue-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex gap-2">
                  <TrendingUp className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Add ${(50 - subtotal).toFixed(2)} more for <strong>FREE shipping</strong>!
                  </span>
                </div>
              </motion.div>
            )}

            {/* Checkout Button */}
            <Button
              onClick={onCheckout}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 h-auto"
            >
              Proceed to Checkout
            </Button>

            {/* Continue Shopping */}
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
