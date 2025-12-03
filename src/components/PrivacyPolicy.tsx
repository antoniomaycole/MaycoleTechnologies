import { motion } from 'motion/react';
import { Shield, Lock, Eye, Database, UserCheck, Mail } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export function PrivacyPolicy() {
  const lastUpdated = "December 1, 2025";

  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Personal Information: Name, email address, phone number, company name when you fill out forms or create an account",
        "Usage Data: IP address, browser type, device information, pages visited, time spent on pages",
        "Cookies: We use cookies to enhance your experience. See our Cookie Policy for details",
        "Payment Information: Credit card details are processed securely through Stripe and never stored on our servers",
      ]
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: [
        "To provide and maintain our services, including MaycoleTracker™",
        "To notify you about changes to our services or important updates",
        "To provide customer support and respond to your inquiries",
        "To monitor usage and improve our services",
        "To detect, prevent, and address technical issues and fraudulent activity",
        "To send marketing communications (with your consent, which you can withdraw at any time)",
      ]
    },
    {
      icon: Eye,
      title: "Information Sharing",
      content: [
        "We do NOT sell your personal information to third parties",
        "Service Providers: We share data with trusted partners (Stripe for payments, SendGrid for emails, etc.) who help us operate our services",
        "Legal Requirements: We may disclose information if required by law or to protect our rights",
        "Business Transfers: In the event of a merger or acquisition, your information may be transferred",
      ]
    },
    {
      icon: Shield,
      title: "Data Security",
      content: [
        "We implement industry-standard security measures to protect your data",
        "SSL/TLS encryption for all data transmission",
        "Regular security audits and vulnerability assessments",
        "Limited access to personal information on a need-to-know basis",
        "However, no method of transmission over the Internet is 100% secure",
      ]
    },
    {
      icon: UserCheck,
      title: "Your Rights (GDPR & CCPA)",
      content: [
        "Access: Request a copy of your personal data",
        "Rectification: Request correction of inaccurate data",
        "Erasure: Request deletion of your data (\"right to be forgotten\")",
        "Portability: Request transfer of your data to another service",
        "Objection: Object to processing of your data for marketing purposes",
        "Withdraw Consent: Opt-out of communications at any time",
        "To exercise these rights, contact us at privacy@maycoletechnologies.com",
      ]
    },
    {
      icon: Mail,
      title: "Cookies & Tracking",
      content: [
        "Essential Cookies: Required for site functionality",
        "Analytics Cookies: Help us understand how visitors use our site",
        "Marketing Cookies: Used to deliver relevant advertisements",
        "You can control cookies through your browser settings",
        "See our detailed Cookie Policy for more information",
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
              Privacy Policy
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-4">
            Your privacy is important to us. This policy explains how MaycoleTechnologies
            <sup className="text-xs align-super">™</sup> collects, 
            uses, and protects your personal information.
          </p>
          <p className="text-sm text-gray-400">
            Last Updated: {lastUpdated}
          </p>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <Card className="border-yellow-600/50 bg-yellow-600/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-yellow-600">
                    Important Notice
                  </h3>
                  <p className="text-gray-300">
                    <strong>MaycoleTechnologies™ is NOT designed for collecting Personally Identifiable 
                    Information (PII) or securing highly sensitive data.</strong> Our platform is intended 
                    for inventory management and business operations. Do not store sensitive personal information, 
                    medical records, financial account details, or other highly confidential data in our system. 
                    For questions about data security, contact us at security@maycoletechnologies.com.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sections */}
        <div className="space-y-8 mb-16">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-semibold mt-2">{section.title}</h2>
                    </div>
                    <ul className="space-y-3 ml-16">
                      {section.content.map((item, i) => (
                        <li key={i} className="text-gray-300 flex items-start">
                          <span className="text-green-600 mr-3 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="space-y-8"
        >
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
              <p className="text-gray-300 mb-4">
                We retain your personal information only for as long as necessary to provide our services 
                and comply with legal obligations. When you delete your account, we will delete or anonymize 
                your personal data within 30 days, except where we are legally required to retain it.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
              <p className="text-gray-300 mb-4">
                Our services are not intended for children under the age of 13 (or 16 in the EU). 
                We do not knowingly collect personal information from children. If you believe we have 
                collected information from a child, please contact us immediately at privacy@maycoletechnologies.com.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
              <p className="text-gray-300 mb-4">
                Your information may be transferred to and processed in countries other than your country 
                of residence. These countries may have different data protection laws. We ensure appropriate 
                safeguards are in place to protect your information in accordance with this Privacy Policy.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
              <p className="text-gray-300 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by 
                posting the new policy on this page and updating the "Last Updated" date. You are advised 
                to review this Privacy Policy periodically for any changes.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have any questions about this Privacy Policy or how we handle your data, 
                please don't hesitate to contact us:
              </p>
              <div className="space-y-2 text-gray-300">
                <p><strong>General Support:</strong> help@maycoletechnologies.com</p>
                <p><strong>Privacy Inquiries:</strong> privacy@maycoletechnologies.com</p>
                <p><strong>Phone:</strong> (213) 312-7814</p>
                <p><strong>Address:</strong> MaycoleTechnologies™, Global Remote Team</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-12"
        >
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-yellow-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            Return to Home
          </a>
        </motion.div>
      </div>
    </div>
  );
}