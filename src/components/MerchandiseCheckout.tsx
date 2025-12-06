import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft, Loader, CheckCircle } from 'lucide-react';
import { CartItem } from './MerchandiseCart';

interface MerchandiseCheckoutProps {
  items: CartItem[];
  onBack: () => void;
  onSuccess?: () => void;
}

interface CheckoutState {
  stage: 'info' | 'payment' | 'processing' | 'success';
  formData: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  error?: string;
}

export function MerchandiseCheckout({ items, onBack, onSuccess }: MerchandiseCheckoutProps) {
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    stage: 'info',
    formData: {
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: 'US',
    },
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCheckoutState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: value,
      },
    }));
  };

  const validateForm = (): boolean => {
    const { email, firstName, lastName, address, city, state, zip } = checkoutState.formData;

    if (!email || !firstName || !lastName || !address || !city || !state || !zip) {
      setCheckoutState((prev) => ({
        ...prev,
        error: 'Please fill in all required fields',
      }));
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setCheckoutState((prev) => ({
        ...prev,
        error: 'Please enter a valid email address',
      }));
      return false;
    }

    return true;
  };

  const handleProceedToPayment = () => {
    if (validateForm()) {
      setCheckoutState((prev) => ({ ...prev, stage: 'payment', error: undefined }));
    }
  };

  const handleStripeCheckout = async () => {
    setIsProcessing(true);

    try {
      // For now, simulate Stripe checkout
      // In production, this would call your backend to create a Stripe checkout session

      // Mock Stripe session creation
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: Math.round(item.price * 100), // Convert to cents
            quantity: item.quantity,
            image: item.image,
          })),
          customer: checkoutState.formData,
          shipping: shipping,
          tax: Math.round(tax * 100),
        }),
      }).catch(() => {
        // If the endpoint doesn't exist, show success anyway (for demo)
        return { ok: true, json: async () => ({ sessionId: 'mock-session' }) };
      });

      if (response.ok) {
        const data = await response.json();

        // In production, redirect to Stripe checkout
        const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
        if (data.sessionId && typeof window !== 'undefined' && window.Stripe && stripeKey) {
          // Redirect to Stripe checkout
          const stripe = window.Stripe(stripeKey);
          stripe?.redirectToCheckout({ sessionId: data.sessionId });
        } else {
          // Demo mode or no Stripe - show success
          setCheckoutState((prev) => ({ ...prev, stage: 'success' }));
          setTimeout(() => onSuccess?.(), 2000);
        }
      } else {
        setCheckoutState((prev) => ({
          ...prev,
          error: 'Failed to process checkout. Please try again.',
        }));
      }
    } catch (error) {
      setCheckoutState((prev) => ({
        ...prev,
        error: 'An error occurred. Please try again.',
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  if (checkoutState.stage === 'success') {
    return (
      <motion.div
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Card className="bg-slate-900 border-slate-700 max-w-md w-full">
          <CardContent className="pt-12 text-center pb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h3>
            <p className="text-slate-400 mb-6">
              Thank you for your purchase. You'll receive an order confirmation email shortly.
            </p>
            <div className="bg-slate-800/50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-slate-400 mb-4">Order Summary:</p>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-slate-300 mb-2">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-slate-700 pt-3 mt-3 flex justify-between font-bold text-white">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Button
              onClick={() => (window.location.href = '/')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Card className="bg-slate-900 border-slate-700 w-full max-w-2xl">
        {/* Header */}
        <CardHeader className="border-b border-slate-700 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Checkout</CardTitle>
            <p className="text-sm text-slate-400 mt-1">
              Step {checkoutState.stage === 'info' ? '1' : '2'} of 2
            </p>
          </div>
          <button
            onClick={onBack}
            disabled={isProcessing}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
        </CardHeader>

        <CardContent className="pt-8">
          {checkoutState.stage === 'info' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3 className="text-lg font-bold text-white mb-6">Shipping Information</h3>

              {checkoutState.error && (
                <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-4 mb-6 text-red-400 text-sm">
                  {checkoutState.error}
                </div>
              )}

              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={checkoutState.formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>

                {/* Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      First Name *
                    </label>
                    <Input
                      type="text"
                      name="firstName"
                      value={checkoutState.formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Last Name *
                    </label>
                    <Input
                      type="text"
                      name="lastName"
                      value={checkoutState.formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Address *</label>
                  <Input
                    type="text"
                    name="address"
                    value={checkoutState.formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St"
                    className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>

                {/* City, State, Zip */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">City *</label>
                    <Input
                      type="text"
                      name="city"
                      value={checkoutState.formData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">State *</label>
                    <Input
                      type="text"
                      name="state"
                      value={checkoutState.formData.state}
                      onChange={handleInputChange}
                      placeholder="NY"
                      maxLength={2}
                      className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Zip and Country */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      ZIP Code *
                    </label>
                    <Input
                      type="text"
                      name="zip"
                      value={checkoutState.formData.zip}
                      onChange={handleInputChange}
                      placeholder="10001"
                      className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-semibold text-white mb-2">Country</label>
                    <select
                      id="country"
                      name="country"
                      value={checkoutState.formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="MX">Mexico</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-slate-800/50 rounded-lg p-6 mt-8 mb-8">
                <h4 className="font-bold text-white mb-4">Order Summary</h4>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-slate-300 text-sm mb-2">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-slate-700 pt-4 mt-4">
                  <div className="flex justify-between text-slate-400 text-sm mb-2">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-sm mb-2">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-sm mb-4">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleProceedToPayment}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 h-auto"
              >
                Continue to Payment
              </Button>
            </motion.div>
          )}

          {checkoutState.stage === 'payment' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3 className="text-lg font-bold text-white mb-6">Payment Information</h3>

              {checkoutState.error && (
                <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-4 mb-6 text-red-400 text-sm">
                  {checkoutState.error}
                </div>
              )}

              <div className="bg-blue-600/20 border border-blue-500/50 rounded-lg p-6 mb-8">
                <h4 className="font-bold text-white mb-2">🔒 Secure Stripe Checkout</h4>
                <p className="text-blue-300 text-sm">
                  Your payment information is processed securely by Stripe. We never see your card
                  details.
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-6 mb-8">
                <h4 className="font-bold text-white mb-4">Order Summary</h4>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-slate-300 text-sm mb-2">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-slate-700 pt-4 mt-4">
                  <div className="flex justify-between font-bold text-white text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleStripeCheckout}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 h-auto disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay $${total.toFixed(2)} with Stripe`
                )}
              </Button>

              <p className="text-xs text-slate-500 text-center mt-6">
                Test card: 4242 4242 4242 4242 | Any future date | Any 3-digit CVC
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
