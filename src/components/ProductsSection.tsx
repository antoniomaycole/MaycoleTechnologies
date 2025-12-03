import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AtomicLogo } from './AtomicLogo';
import { TrackerIcon } from './TrackerIcon';
import { CheckbookIcon } from './CheckbookIcon';
import { 
  CheckCircle, 
  Star, 
  Zap, 
  Shield, 
  Globe, 
  Mic, 
  Brain, 
  BarChart3,
  Database,
  Smartphone,
  Monitor,
  Cloud,
  Lock,
  Users,
  FileText,
  Utensils,
  Heart,
  HardHat,
  ShoppingCart,
  Factory,
  Car,
  Code,
  GraduationCap,
  Wifi,
  WifiOff,
  Scan,
  Bell,
  Calendar,
  Play,
  QrCode,
  AlertTriangle,
  Crown,
  DollarSign,
  TrendingUp,
  PieChart,
  Receipt,
  Wallet,
  CreditCard,
  ArrowUpDown,
  Tags
} from 'lucide-react';

import { Mail } from 'lucide-react';

interface ProductsSectionProps {
  onLaunchTracker?: () => void;
}

export function ProductsSection({ onLaunchTracker }: ProductsSectionProps) {
  // MaycoleTracker Features
  const trackerFeatures = [
    {
      icon: Brain,
      title: "AI-Native Intelligence",
      description: "Built from the ground up with artificial intelligence at its core, providing intelligent insights and automated decision-making capabilities."
    },
    {
      icon: Mic,
      title: "Voice Control & Commands",
      description: "Revolutionary hands-free voice commands for seamless inventory management in any environment, supporting natural language processing."
    },
    {
      icon: Scan,
      title: "Barcode Scanning",
      description: "Advanced barcode and QR code scanning with real-time recognition and automatic data capture for lightning-fast inventory updates."
    },
    {
      icon: WifiOff,
      title: "Offline Functionality",
      description: "Full PWA capabilities with robust offline mode, ensuring continuous operation even without internet connectivity."
    },
    {
      icon: Globe,
      title: "Multi-Device Support",
      description: "Native support for iOS, Android, and desktop platforms with seamless synchronization across all devices."
    },
    {
      icon: Database,
      title: "Real-Time Tracking",
      description: "Instant updates and real-time inventory visibility with live data synchronization across all connected systems."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive reporting and analytics with predictive insights, trend analysis, and performance optimization recommendations."
    },
    {
      icon: Bell,
      title: "Emergency Mode",
      description: "Critical alert system with emergency mode functionality for urgent inventory situations and crisis management."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption, audit trails, and compliance with FDA, OSHA, and other industry regulations for maximum security."
    }
  ];

  // MaycoleCheckBook Features
  const checkbookFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Transaction Analysis",
      description: "Intelligent parsing and categorization of transactions using advanced AI to understand natural language inputs and automatically organize your finances."
    },
    {
      icon: Mic,
      title: "Voice-Enabled Entry",
      description: "Speak your transactions naturally and watch as AI instantly captures payee, amount, category, and transaction type with visual feedback indicators."
    },
    {
      icon: ArrowUpDown,
      title: "Smart Sorting System",
      description: "Advanced multi-column sorting for dates (chronological), amounts (numerical), and text fields (alphabetical) with intuitive visual indicators."
    },
    {
      icon: TrendingUp,
      title: "Intelligent Insights",
      description: "Real-time financial analytics with spending patterns, budget tracking, and predictive forecasting to optimize your money management."
    },
    {
      icon: Tags,
      title: "Auto-Categorization",
      description: "Automatically categorize expenses and income with machine learning that adapts to your spending habits and financial patterns."
    },
    {
      icon: Receipt,
      title: "Digital Ledger",
      description: "Complete transaction history with searchable records, detailed entries, and comprehensive audit trails for perfect financial clarity."
    },
    {
      icon: PieChart,
      title: "Visual Reporting",
      description: "Beautiful charts and graphs showing spending breakdowns, income trends, and budget performance at a glance."
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Military-grade encryption, secure data storage, and compliance with financial industry standards to protect your sensitive information."
    },
    {
      icon: Smartphone,
      title: "Cross-Platform Sync",
      description: "Seamless synchronization across all your devices with real-time updates and offline capability for managing finances anywhere."
    }
  ];

  const subscriptionTiers = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for small businesses getting started",
      features: [
        "Basic inventory tracking",
        "Up to 100 items",
        "Mobile app access",
        "Basic reporting",
        "Email support"
      ],
      highlighted: false,
      cta: "Get Started Free"
    },
    {
      name: "Professional",
      price: "$89",
      period: "per month",
      description: "Advanced features for growing businesses",
      features: [
        "Unlimited inventory items",
        "Voice control & commands",
        "Barcode scanning",
        "Advanced analytics",
        "Multi-location support",
        "API integrations",
        "Priority support",
        "Offline functionality"
      ],
      highlighted: true,
      cta: "Start 14-Day Trial"
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "per month",
      description: "Full enterprise features and customization",
      features: [
        "All Professional features",
        "Custom integrations",
        "White-label options",
        "Advanced security",
        "Dedicated support",
        "Custom training",
        "SLA guarantees",
        "Enterprise reporting"
      ],
      highlighted: false,
      cta: "Contact Sales"
    }
  ];

  return (
    <div className="maycole-section-products">
      <section id="products" className="py-24">
        <div className="container mx-auto px-6">
          
          {/* Products Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
                Our SaaS Products
              </span>
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Enterprise-grade solutions powered by AI, designed to transform your business operations
            </p>
          </motion.div>

          {/* Green MaycoleCheckBook Hero Section - NOW FIRST */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20 relative overflow-hidden rounded-3xl"
          >
            {/* Green/Gold Gradient Background */}
            <div className="bg-gradient-to-br from-green-950 via-black to-yellow-900 p-16 relative">
              
              {/* Green Background Effects */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-yellow-400/10" />
                <motion.div
                  className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-500/20 to-transparent rounded-full blur-3xl"
                  animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-yellow-400/20 to-transparent rounded-full blur-3xl"
                  animate={{
                    x: [0, -100, 0],
                    y: [0, 50, 0],
                    scale: [1.2, 1, 1.2]
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>

              {/* Content */}
              <div className="relative z-10">
                
                {/* App Title */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h1 className="text-5xl md:text-7xl font-bold mb-4 flex items-center justify-center gap-3">
                    <CheckbookIcon className="w-12 h-12 text-green-400" animated={false} />
                    <span className="bg-gradient-to-r from-green-400 via-yellow-300 to-green-500 bg-clip-text text-transparent">
                      MaycoleCheckBook
                    </span>
                    <sup className="text-yellow-400 text-lg">™</sup>
                  </h1>
                  <p className="text-xl md:text-2xl text-green-300 mb-2">
                    Intelligent Money Management
                  </p>
                  <p className="text-sm md:text-base text-green-400/80 mb-8">
                    AI-Powered Financial Intelligence • Voice-Enabled Transactions
                  </p>
                </motion.div>

                {/* Status Indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="flex flex-wrap items-center justify-center gap-4 mb-12"
                >
                  <Badge className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 border-green-500/30">
                    <Brain className="w-4 h-4" />
                    AI-Powered
                  </Badge>
                  
                  <Badge className="flex items-center gap-2 px-3 py-2 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                    <Mic className="w-4 h-4" />
                    Voice Control
                  </Badge>
                  
                  <Badge className="flex items-center gap-2 px-3 py-2 bg-green-600/20 text-green-400 border-green-600/30">
                    <ArrowUpDown className="w-4 h-4" />
                    Smart Sorting
                  </Badge>
                  
                  <Badge className="flex items-center gap-2 px-3 py-2 bg-yellow-600/20 text-yellow-400 border-yellow-600/30">
                    <Shield className="w-4 h-4" />
                    Bank-Level Security
                  </Badge>
                </motion.div>

                {/* Launch Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="mb-8"
                >
                  <Button
                    className="bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white px-12 py-6 text-xl font-medium group relative overflow-hidden border-none shadow-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <CheckbookIcon className="w-6 h-6 text-white" animated={false} />
                      Coming Soon
                    </div>
                    
                    {/* Animated background effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ['-100%', '100%']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </Button>
                </motion.div>

                {/* Quick Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  viewport={{ once: true }}
                  className="flex flex-wrap items-center justify-center gap-4 mb-8"
                >
                  <Button
                    variant="outline"
                    className="border-green-500/50 text-green-300 hover:bg-green-500/10"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Voice Transactions
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/10"
                  >
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    Smart Sorting
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="border-green-500/50 text-green-300 hover:bg-green-500/10"
                  >
                    <PieChart className="w-4 h-4 mr-2" />
                    Financial Analytics
                  </Button>
                </motion.div>

                {/* Feature Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  viewport={{ once: true }}
                  className="text-xs text-green-400/60"
                >
                  <p>Features: AI Transaction Parsing • Voice Entry • Multi-Column Sorting • Budget Tracking</p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Blue MaycoleTracker Hero Section - NOW SECOND */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mb-20 relative overflow-hidden rounded-3xl"
          >
            {/* Blue Gradient Background */}
            <div className="bg-gradient-to-br from-blue-950 via-black to-blue-900 p-16 relative">
              
              {/* Blue Background Effects */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-400/10" />
                <motion.div
                  className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-transparent rounded-full blur-3xl"
                  animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-blue-400/20 to-transparent rounded-full blur-3xl"
                  animate={{
                    x: [0, -100, 0],
                    y: [0, 50, 0],
                    scale: [1.2, 1, 1.2]
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

              </div>

              {/* Content */}
              <div className="relative z-10">
                
                {/* Hero Logo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="flex justify-center mb-8"
                >
                  <TrackerIcon 
                    size={120} 
                    animated={false}
                    interactive={true}
                  />
                </motion.div>

                {/* App Title */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h1 className="text-5xl md:text-7xl font-bold mb-4 flex items-center gap-3">
                    <TrackerIcon size={48} animated={false} interactive={false} />
                    <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
                      MaycoleTracker
                    </span>
                    <sup className="text-blue-400 text-lg">™</sup>
                  </h1>
                  <p className="text-xl md:text-2xl text-blue-300 mb-2">
                    AI-Native Inventory Intelligence
                  </p>
                  <p className="text-sm md:text-base text-blue-400/80 mb-8">
                    Restaurant Operations • Professional Plan
                  </p>
                </motion.div>

                {/* Status Indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="flex flex-wrap items-center justify-center gap-4 mb-12"
                >
                  <Badge className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 border-green-500/30">
                    <Wifi className="w-4 h-4" />
                    Online
                  </Badge>
                  
                  <Badge className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-300 border-blue-500/30">
                    <Crown className="w-4 h-4" />
                    Professional Plan
                  </Badge>
                  
                  <Badge className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 text-blue-400 border-blue-600/30">
                    <Shield className="w-4 h-4" />
                    Enterprise Security
                  </Badge>
                  
                  <Badge className="flex items-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 border-red-500/30">
                    <Bell className="w-4 h-4" />
                    3 Alerts
                  </Badge>
                </motion.div>

                {/* Launch Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="mb-8"
                >
                  <Button
                    onClick={onLaunchTracker}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-12 py-6 text-xl font-medium group relative overflow-hidden border-none shadow-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <Play className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                      Launch App
                    </div>
                    
                    {/* Animated background effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ['-100%', '100%']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </Button>
                </motion.div>

                {/* Quick Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  viewport={{ once: true }}
                  className="flex flex-wrap items-center justify-center gap-4 mb-8"
                >
                  <Button
                    variant="outline"
                    className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Voice Control
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Barcode Scanner
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Emergency Mode
                  </Button>
                </motion.div>

                {/* Keyboard Shortcuts Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  viewport={{ once: true }}
                  className="text-xs text-blue-400/60"
                >
                  <p>Keyboard Shortcuts: Ctrl+1-5 (Navigate) • Space (Voice) • Esc (Home)</p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* MaycoleTracker Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <TrackerIcon 
                  size={48} 
                  animated={false}
                />
                <h2 className="text-3xl md:text-4xl font-bold ml-4">
                  <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                    MaycoleTracker™
                  </span>
                  <span className="text-white ml-3">Features</span>
                </h2>
              </div>
              <p className="text-lg text-white max-w-2xl mx-auto">
                9 Core Features with advanced AI capabilities and premium functionality
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trackerFeatures.map((feature, index) => {
                const Icon = feature.icon;
                const isFirstFeature = index === 0;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className={`maycole-card h-full group ${isFirstFeature ? 'ring-2 ring-blue-500/30' : ''}`}>
                      <CardHeader className="pb-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 relative ${
                          isFirstFeature 
                            ? 'bg-gradient-to-br from-blue-600 to-blue-500' 
                            : 'bg-gradient-to-br from-maycole-green to-maycole-gold'
                        }`}>
                          <Icon className="w-7 h-7 text-white" />
                          {isFirstFeature && (
                            <>
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center">
                                <Database className="w-2 h-2 text-white" />
                              </div>
                              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center">
                                <Zap className="w-1.5 h-1.5 text-white" />
                              </div>
                            </>
                          )}
                        </div>
                        <CardTitle className={`text-xl font-bold ${isFirstFeature ? 'text-blue-300' : 'text-white'}`}>
                          <div className="flex items-center gap-2">
                            {feature.title}
                            {isFirstFeature && (
                              <>
                                <TrackerIcon 
                                  size={24} 
                                  animated={false}
                                  interactive={true}
                                />
                                <Badge className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs">
                                  MaycoleTracker™
                                </Badge>
                              </>
                            )}
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-white leading-relaxed">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* MaycoleCheckBook Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <CheckbookIcon className="w-12 h-12 text-green-400" animated={false} />
                <h2 className="text-3xl md:text-4xl font-bold ml-4">
                  <span className="bg-gradient-to-r from-green-400 to-yellow-500 bg-clip-text text-transparent">
                    MaycoleCheckBook™
                  </span>
                  <span className="text-white ml-3">Features</span>
                </h2>
              </div>
              <p className="text-lg text-white max-w-2xl mx-auto">
                9 Core Features for intelligent financial management and money tracking
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {checkbookFeatures.map((feature, index) => {
                const Icon = feature.icon;
                const isFirstFeature = index === 0;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className={`maycole-card h-full group ${isFirstFeature ? 'ring-2 ring-green-500/30' : ''}`}>
                      <CardHeader className="pb-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 relative ${
                          isFirstFeature 
                            ? 'bg-gradient-to-br from-green-600 to-green-500' 
                            : 'bg-gradient-to-br from-green-600 to-yellow-500'
                        }`}>
                          <Icon className="w-7 h-7 text-white" />
                          {isFirstFeature && (
                            <>
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                                <DollarSign className="w-2 h-2 text-white" />
                              </div>
                              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center">
                                <Zap className="w-1.5 h-1.5 text-white" />
                              </div>
                            </>
                          )}
                        </div>
                        <CardTitle className={`text-xl font-bold ${isFirstFeature ? 'text-green-300' : 'text-white'}`}>
                          <div className="flex items-center gap-2">
                            {feature.title}
                            {isFirstFeature && (
                              <>
                                <CheckbookIcon className="w-5 h-5 text-green-400" animated={false} />
                                <Badge className="bg-gradient-to-r from-green-600 to-yellow-500 text-white text-xs">
                                  MaycoleCheckBook™
                                </Badge>
                              </>
                            )}
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-white leading-relaxed">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Subscription Tiers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold maycole-gradient-text mb-6">
                💎 Subscription Plans
              </h2>
              <p className="text-lg text-white max-w-2xl mx-auto">
                Choose the perfect plan for your business needs
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {subscriptionTiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`${tier.highlighted ? 'lg:scale-105 lg:-mt-4' : ''}`}
                >
                  <Card className={`maycole-card h-full ${tier.highlighted ? 'border-blue-500 shadow-xl bg-gradient-to-br from-blue-950/50 to-blue-900/50' : ''}`}>
                    <CardHeader className="text-center pb-6">
                      {tier.highlighted && (
                        <Badge className="bg-gradient-to-r from-blue-600 to-blue-500 text-white mb-4 self-center">
                          Most Popular
                        </Badge>
                      )}
                      <CardTitle className={`text-2xl font-bold mb-2 ${tier.highlighted ? 'text-blue-300' : 'text-maycole-green'}`}>
                        {tier.name}
                      </CardTitle>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-white">{tier.price}</span>
                        <span className={`ml-2 ${tier.highlighted ? 'text-blue-300' : 'text-maycole-gold'}`}>
                          / {tier.period}
                        </span>
                      </div>
                      <p className="text-white text-sm">{tier.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-8">
                        {tier.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <CheckCircle className={`w-5 h-5 flex-shrink-0 ${tier.highlighted ? 'text-blue-400' : 'text-maycole-green'}`} />
                            <span className="text-white text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button 
                        className={tier.highlighted 
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white w-full border-none' 
                          : 'maycole-btn-secondary w-full'
                        }
                        onClick={tier.highlighted ? onLaunchTracker : undefined}
                      >
                        {tier.cta}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Questions Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <Card className="maycole-card border-green-500/30">
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-yellow-500 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Questions About Our Products?
                  </h3>
                  <p className="text-white max-w-2xl">
                    Our team is here to help you choose the right solution for your business. 
                    Whether you need guidance on MaycoleCheckBook™ or MaycoleTracker™, we're ready to assist.
                  </p>
                  <a 
                    href="mailto:help@maycoletechnologies.com"
                    className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors text-lg font-medium group"
                  >
                    <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    help@maycoletechnologies.com
                  </a>
                  <p className="text-sm text-gray-400">
                    Typical response time: Within 24 hours
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-green-950 via-green-900 to-yellow-900 rounded-3xl p-12 text-white relative overflow-hidden border border-green-500/30">
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-6">
                  <CheckbookIcon 
                    className="w-16 h-16 text-green-400"
                    animated={false}
                  />
                  <h3 className="text-3xl md:text-4xl font-bold ml-4">
                    🚀 Join the AI Revolution - Transform Your Business Today
                  </h3>
                </div>
                <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                  Experience intelligent automation with <span className="text-green-300 font-semibold">MaycoleCheckBook™</span> - 
                  The future of AI-powered financial management. Plus explore <span className="text-blue-300 font-semibold">MaycoleTracker™</span> for inventory intelligence.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    className="bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white px-8 py-4 font-medium text-lg group border-none"
                  >
                    <div className="flex items-center gap-3">
                      <CheckbookIcon className="w-5 h-5 text-white" animated={false} />
                      Join MaycoleCheckBook™ Waitlist
                    </div>
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-4 font-medium text-lg group border-none"
                    onClick={onLaunchTracker}
                  >
                    <div className="flex items-center gap-3">
                      <TrackerIcon 
                        size={20} 
                        animated={false}
                        interactive={false}
                      />
                      Launch MaycoleTracker™
                      <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </Button>
                </div>
              </div>
              
              {/* Background decoration */}
              <motion.div
                className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}