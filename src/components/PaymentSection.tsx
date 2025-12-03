import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AtomicLogo } from './AtomicLogo';
import { CreditCard, Smartphone, Building2, DollarSign, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from "sonner";

export function PaymentSection() {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Credit Card Form State
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    email: ''
  });
  
  // Form Validation State
  const [formErrors, setFormErrors] = useState({});
  
  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };
  
  // Format expiry date MM/YY
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };
  
  // Handle input changes
  const handleCardInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4);
    }
    
    setCardForm(prev => ({
      ...prev,
      [field]: formattedValue
    }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!cardForm.cardNumber || cardForm.cardNumber.replace(/\s/g, '').length < 13) {
      errors.cardNumber = 'Please enter a valid card number';
    }
    
    if (!cardForm.expiryDate || !/^\d{2}\/\d{2}$/.test(cardForm.expiryDate)) {
      errors.expiryDate = 'Please enter expiry date in MM/YY format';
    }
    
    if (!cardForm.cvv || cardForm.cvv.length < 3) {
      errors.cvv = 'Please enter a valid CVV';
    }
    
    if (!cardForm.cardholderName.trim()) {
      errors.cardholderName = 'Please enter cardholder name';
    }
    
    if (!cardForm.billingAddress.trim()) {
      errors.billingAddress = 'Please enter billing address';
    }
    
    if (!cardForm.email.trim() || !/\S+@\S+\.\S+/.test(cardForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    return errors;
  };
  
  // Handle form submission
  const handlePaymentSubmit = async () => {
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fill in all required fields correctly');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Log payment details (in a real app, this would be sent to your payment processor)
      console.log('Payment Details:', {
        plan: selectedPlanData,
        paymentMethod,
        cardDetails: {
          ...cardForm,
          cardNumber: '**** **** **** ' + cardForm.cardNumber.slice(-4),
          cvv: '***'
        },
        timestamp: new Date().toISOString()
      });
      
      toast.success(`Payment successful! Welcome to ${selectedPlanData?.name}!`);
      
      // Reset form
      setCardForm({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        billingAddress: '',
        email: ''
      });
      setFormErrors({});
      
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const plans = [
    {
      id: 'basic',
      name: 'MaycoleTracker™ Basic',
      price: '$29',
      period: 'monthly',
      description: 'Essential inventory management features',
      features: [
        'Voice-Controlled Interface',
        'Basic Inventory Tracking',
        'Mobile App Access',
        'Cloud Sync',
        'Email Support'
      ],
      popular: false,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'pro',
      name: 'MaycoleTracker™ Pro',
      price: '$79',
      period: 'monthly',
      description: 'Advanced AI-powered inventory management',
      features: [
        'AI-Native Voice Commands',
        'Universal Inventory System',
        'Advanced Analytics',
        'Multi-Location Support',
        'Priority Support',
        'Custom Integrations',
        'API Access'
      ],
      popular: true,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 'enterprise',
      name: 'MaycoleTracker™ Enterprise',
      price: '$199',
      period: 'monthly',
      description: 'Complete enterprise inventory solution',
      features: [
        'Everything in Pro',
        'White-Label Solution',
        'Dedicated Support Team',
        'Custom AI Training',
        'Enterprise Security',
        'Unlimited Users',
        'Custom Deployment',
        'SLA Guarantee'
      ],
      popular: false,
      color: 'from-green-600 to-yellow-500'
    }
  ];

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, American Express',
      processingFee: '2.9% + $0.30'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: Building2,
      description: 'Secure PayPal payment',
      processingFee: '2.9% + $0.30'
    },
    {
      id: 'zelle',
      name: 'Zelle',
      icon: Smartphone,
      description: 'Direct bank transfer',
      processingFee: 'No fees'
    },
    {
      id: 'cashapp',
      name: 'Cash App',
      icon: DollarSign,
      description: 'Quick mobile payment',
      processingFee: 'No fees'
    }
  ];

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan);

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-gray-800">
            <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Simple, Transparent</span> <span className="bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent">Pricing</span>
          </h2>
          
          {/* Vision Statement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-8 max-w-3xl mx-auto"
          >
            <div className="bg-gradient-to-r from-green-50 via-white to-yellow-50 rounded-xl p-4 border border-green-100/50 shadow-sm">
              <p className="text-base font-medium bg-gradient-to-r from-green-700 to-yellow-600 bg-clip-text text-transparent">
                The FIRST truly AI-native, voice-controlled, universal inventory management system. Choose your plan and revolutionize your inventory management today.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative ${plan.popular ? 'scale-105' : ''}`}
            >
              <Card className={`h-full border-0 shadow-lg ${
                selectedPlan === plan.id 
                  ? 'ring-2 ring-green-500 shadow-green-100' 
                  : 'hover:shadow-xl'
              } transition-all duration-300 cursor-pointer`}
              onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1 text-xs">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mb-3 mx-auto shadow-md`}>
                    <AtomicLogo size="xs" />
                  </div>
                  <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                  <div className="mt-3">
                    <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 ml-2 text-sm">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-xs">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full mt-4 ${
                      selectedPlan === plan.id 
                        ? 'bg-gradient-to-r from-green-600 to-green-700' 
                        : 'bg-gradient-to-r from-gray-600 to-gray-700'
                    } py-2 text-sm`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Payment Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold flex items-center justify-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span>Secure Payment Processing</span>
              </CardTitle>
              {selectedPlanData && (
                <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-yellow-50 rounded-lg">
                  <p className="text-base">
                    <span className="font-medium">Selected: </span>
                    <span className="font-bold text-green-600">{selectedPlanData.name}</span>
                    <span className="ml-3 text-xl font-bold text-yellow-600">{selectedPlanData.price}/{selectedPlanData.period}</span>
                  </p>
                </div>
              )}
            </CardHeader>
            
            <CardContent>
              <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  {paymentMethods.map((method) => (
                    <TabsTrigger 
                      key={method.id} 
                      value={method.id}
                      className="flex flex-col items-center space-y-1 h-auto py-3"
                    >
                      <method.icon className="w-5 h-5" />
                      <span className="text-xs">{method.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Credit Card Payment */}
                <TabsContent value="card" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Card Number *</label>
                        <Input 
                          placeholder="1234 5678 9012 3456" 
                          className={`text-lg tracking-wider ${formErrors.cardNumber ? 'border-red-500' : ''}`}
                          value={cardForm.cardNumber}
                          onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                          maxLength={19}
                        />
                        {formErrors.cardNumber && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {formErrors.cardNumber}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Expiry Date *</label>
                          <Input 
                            placeholder="MM/YY" 
                            className={formErrors.expiryDate ? 'border-red-500' : ''}
                            value={cardForm.expiryDate}
                            onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                            maxLength={5}
                          />
                          {formErrors.expiryDate && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {formErrors.expiryDate}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">CVV *</label>
                          <Input 
                            placeholder="123" 
                            type="password"
                            className={formErrors.cvv ? 'border-red-500' : ''}
                            value={cardForm.cvv}
                            onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                            maxLength={4}
                          />
                          {formErrors.cvv && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {formErrors.cvv}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Cardholder Name *</label>
                        <Input 
                          placeholder="John Doe" 
                          className={formErrors.cardholderName ? 'border-red-500' : ''}
                          value={cardForm.cardholderName}
                          onChange={(e) => handleCardInputChange('cardholderName', e.target.value)}
                        />
                        {formErrors.cardholderName && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {formErrors.cardholderName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email Address *</label>
                        <Input 
                          placeholder="john@example.com"
                          type="email"
                          className={formErrors.email ? 'border-red-500' : ''}
                          value={cardForm.email}
                          onChange={(e) => handleCardInputChange('email', e.target.value)}
                        />
                        {formErrors.email && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {formErrors.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Billing Address *</label>
                        <Input 
                          placeholder="123 Main St, City, State 12345" 
                          className={formErrors.billingAddress ? 'border-red-500' : ''}
                          value={cardForm.billingAddress}
                          onChange={(e) => handleCardInputChange('billingAddress', e.target.value)}
                        />
                        {formErrors.billingAddress && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {formErrors.billingAddress}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <Shield className="w-4 h-4 inline mr-2" />
                    Processing Fee: 2.9% + $0.30 | Secured by 256-bit SSL encryption
                  </div>
                </TabsContent>

                {/* PayPal Payment */}
                <TabsContent value="paypal" className="space-y-6">
                  <div className="text-center py-8">
                    <div className="bg-blue-50 rounded-2xl p-8">
                      <Building2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">PayPal Secure Payment</h3>
                      <p className="text-gray-600 mb-6">
                        You'll be redirected to PayPal to complete your payment securely
                      </p>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>📧 PayPal Email: help@maycoletechnologies<sup className="text-xs align-super">™</sup>.com</p>
                        <p>💳 Processing Fee: 2.9% + $0.30</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Zelle Payment */}
                <TabsContent value="zelle" className="space-y-6">
                  <div className="text-center py-8">
                    <div className="bg-purple-50 rounded-2xl p-8">
                      <Smartphone className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Zelle Quick Pay</h3>
                      <p className="text-gray-600 mb-6">
                        Send payment directly from your bank app using Zelle
                      </p>
                      <div className="bg-white rounded-lg p-4 border-2 border-purple-200 mb-4">
                        <p className="font-bold text-lg">Zelle Details:</p>
                        <p className="text-purple-600 font-mono text-lg">help@maycoletechnologies<sup className="text-xs align-super">™</sup>.com</p>
                        <p className="text-sm text-gray-600 mt-2">
                          💰 No processing fees | ⚡ Instant transfer
                        </p>
                      </div>
                      <p className="text-xs text-gray-600">
                        Include your project reference in the payment memo
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Cash App Payment */}
                <TabsContent value="cashapp" className="space-y-6">
                  <div className="text-center py-8">
                    <div className="bg-green-50 rounded-2xl p-8">
                      <DollarSign className="w-16 h-16 text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Cash App Payment</h3>
                      <p className="text-gray-600 mb-6">
                        Quick and easy payment through Cash App
                      </p>
                      <div className="bg-white rounded-lg p-4 border-2 border-green-200 mb-4">
                        <p className="font-bold text-lg">Cash App Details:</p>
                        <p className="text-green-600 font-mono text-2xl">$MaycoleTech</p>
                        <p className="text-sm text-gray-600 mt-2">
                          💰 No processing fees | 📱 Mobile-first payments
                        </p>
                      </div>
                      <p className="text-xs text-gray-600">
                        Mention your project name when sending payment
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Payment Summary & Action */}
              <div className="mt-6 bg-gradient-to-r from-green-50 to-yellow-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-sm">Payment Summary</span>
                  <AtomicLogo size="xs" />
                </div>
                {selectedPlanData && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{selectedPlanData.name}</span>
                      <span className="font-bold">{selectedPlanData.price}/{selectedPlanData.period}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Processing Fee</span>
                      <span>{paymentMethods.find(m => m.id === paymentMethod)?.processingFee}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Monthly Total</span>
                      <span className="text-green-600">{selectedPlanData.price}</span>
                    </div>
                  </div>
                )}
                
                <Button 
                  className="w-full mt-4 bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700 text-white font-bold py-3 text-sm shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handlePaymentSubmit}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Start MaycoleTracker<sup className="text-xs align-super">™</sup> Subscription
                    </>
                  )}
                </Button>
                
                <div className="mt-3 text-center">
                  <p className="text-xs text-gray-600 flex items-center justify-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span>Secure | Cancel Anytime | 30-Day Free Trial</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}