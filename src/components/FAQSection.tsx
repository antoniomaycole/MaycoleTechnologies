import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { ChevronDown, HelpCircle, Shield, CreditCard, Clock, Zap, Users, Lock } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: 'general' | 'pricing' | 'technical' | 'security';
  icon: any;
}

const faqs: FAQItem[] = [
  {
    id: 1,
    question: "What makes MaycoleTechnologies™ different from other solutions?",
    answer: "We leverage the proprietary MAYCOLE Method™, combining Agile Practices with Spring Logic to deliver AI-native solutions that are not only cutting-edge but also highly adaptable. Our approach focuses on changing lives through technology, with enterprise-grade quality at every level. Plus, our atomic-themed innovation philosophy ensures every component works in perfect harmony.",
    category: 'general',
    icon: Zap
  },
  {
    id: 2,
    question: "How long does implementation take?",
    answer: "Most implementations are completed within 2-4 weeks. Our agile methodology allows us to deploy core functionality quickly, then iterate based on your specific needs. For MaycoleTracker™, basic setup can be done in as little as 48 hours, with full customization completed within 2 weeks. We provide white-glove onboarding and dedicated support throughout.",
    category: 'technical',
    icon: Clock
  },
  {
    id: 3,
    question: "Is my data secure with MaycoleTechnologies™?",
    answer: "Absolutely. Security is our top priority. We use bank-level 256-bit AES encryption for all data at rest and in transit. Our infrastructure is SOC 2 Type II compliant, with regular third-party security audits. We maintain 99.9% uptime SLA, implement multi-factor authentication, and follow GDPR compliance standards. Your data is backed up in real-time across multiple secure data centers.",
    category: 'security',
    icon: Shield
  },
  {
    id: 4,
    question: "What's included in the free trial?",
    answer: "Our 14-day free trial gives you complete access to all Professional tier features with no credit card required. You'll get up to 1,000 inventory items for MaycoleTracker™ or 500 transactions for MaycoleCheckBook™, full AI capabilities, real-time analytics, mobile access, and dedicated onboarding support. No limitations, no obligations - experience the full power of our platform risk-free.",
    category: 'pricing',
    icon: CreditCard
  },
  {
    id: 5,
    question: "Can I integrate with my existing systems?",
    answer: "Yes! Our platforms offer robust API access and pre-built integrations with popular tools including QuickBooks, Xero, Salesforce, SAP, Oracle, Microsoft Dynamics, Shopify, and more. Our RESTful API allows custom integrations, and our technical team provides integration support for Enterprise clients. We support webhooks, OAuth 2.0, and real-time data synchronization.",
    category: 'technical',
    icon: Zap
  },
  {
    id: 6,
    question: "What kind of support do you provide?",
    answer: "We offer tiered support based on your plan. Professional users get email support with 24-hour response time. Enterprise clients receive priority support with 4-hour response SLA, dedicated account manager, phone support, and quarterly business reviews. All plans include access to our comprehensive knowledge base, video tutorials, and community forum. Premium support includes Slack/Teams integration for instant communication.",
    category: 'general',
    icon: Users
  },
  {
    id: 7,
    question: "How does pricing work? Are there any hidden fees?",
    answer: "We believe in transparent pricing with no surprises. Professional is $99/month, Enterprise is $299/month, billed monthly or annually (save 20% with annual billing). What you see is what you pay - no setup fees, no hidden charges, no per-user fees up to the tier limit. You can upgrade, downgrade, or cancel anytime. Custom plans include volume discounts and special pricing for non-profits and educational institutions.",
    category: 'pricing',
    icon: CreditCard
  },
  {
    id: 8,
    question: "What happens to my data if I cancel?",
    answer: "You maintain full ownership of your data always. If you cancel, you can export all your data in standard formats (CSV, JSON, Excel) for 90 days after cancellation. We'll never hold your data hostage. After 90 days, data is permanently deleted from our servers per our data retention policy. You can request a complete data export at any time during your active subscription.",
    category: 'security',
    icon: Lock
  },
  {
    id: 9,
    question: "Do you offer training for my team?",
    answer: "Yes! All Enterprise plans include comprehensive team training. We offer live onboarding sessions, customized video tutorials, and ongoing training webinars. Professional users have access to our self-service training portal with step-by-step guides. We also provide certification programs for power users and administrators who want to maximize platform efficiency.",
    category: 'general',
    icon: Users
  },
  {
    id: 10,
    question: "Can I try both MaycoleTracker™ and MaycoleCheckBook™?",
    answer: "Absolutely! You can start free trials for both products simultaneously. Many of our clients use both solutions together for complete business management. We offer bundle pricing for combined subscriptions - contact our sales team for custom bundle quotes that can save you up to 25% compared to individual subscriptions.",
    category: 'pricing',
    icon: CreditCard
  }
];

const categories = [
  { id: 'all', label: 'All Questions', icon: HelpCircle },
  { id: 'general', label: 'General', icon: HelpCircle },
  { id: 'pricing', label: 'Pricing', icon: CreditCard },
  { id: 'technical', label: 'Technical', icon: Zap },
  { id: 'security', label: 'Security', icon: Shield }
];

export function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openId, setOpenId] = useState<number | null>(null);

  const filteredFAQs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-maycole-green to-maycole-gold rounded-2xl mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="maycole-gradient-text inline-block leading-tight pb-1">
              Frequently Asked Questions
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about <span className="maycole-gradient-text">MaycoleTechnologies</span><span className="maycole-trademark">™</span> and our products
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-maycole-green to-maycole-gold text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-maycole-green hover:text-maycole-green'
              }`}
            >
              <category.icon className="w-4 h-4" />
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto space-y-4">
          <AnimatePresence mode="sync">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="maycole-card overflow-hidden">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          openId === faq.id
                            ? 'bg-gradient-to-br from-maycole-green to-maycole-gold'
                            : 'bg-gray-100'
                        }`}>
                          <faq.icon className={`w-5 h-5 ${
                            openId === faq.id ? 'text-white' : 'text-gray-600'
                          }`} />
                        </div>
                        <span className="font-semibold text-gray-900 text-lg">
                          {faq.question}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: openId === faq.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown className={`w-6 h-6 ${
                          openId === faq.id ? 'text-maycole-green' : 'text-gray-400'
                        }`} />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {openId === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-2 pl-20">
                            <p className="text-gray-700 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Still Have Questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="maycole-card max-w-2xl mx-auto bg-gradient-to-br from-maycole-green/5 to-maycole-gold/5 border-2 border-maycole-green/20">
            <CardContent className="p-8">
              <HelpCircle className="w-12 h-12 text-maycole-green mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Still have questions?
              </h3>
              <p className="text-gray-600 mb-6">
                Our team is here to help. Get in touch and we'll answer any questions you have.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="#contact" 
                  className="maycole-btn-primary inline-block px-8 py-3"
                >
                  Contact Our Team
                </a>
                <a 
                  href="#free-trial" 
                  className="bg-white border-2 border-maycole-green text-maycole-green px-8 py-3 rounded-lg font-medium hover:bg-maycole-green hover:text-white transition-all duration-300 inline-block"
                >
                  Start Free Trial
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
