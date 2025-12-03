import { motion } from 'motion/react';
import { FileText, AlertTriangle, Scale, UserX, Shield, DollarSign } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export function TermsOfService() {
  const lastUpdated = "December 1, 2025";
  const effectiveDate = "December 1, 2025";

  const sections = [
    {
      icon: FileText,
      title: "1. Acceptance of Terms",
      content: [
        "By accessing or using MaycoleTechnologies™ services, including MaycoleTracker™, you agree to be bound by these Terms of Service",
        "If you do not agree to these terms, you may not access or use our services",
        "We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance",
        "You must be at least 18 years old to use our services",
      ]
    },
    {
      icon: UserX,
      title: "2. User Accounts",
      content: [
        "You must provide accurate, current, and complete information during registration",
        "You are responsible for maintaining the confidentiality of your account credentials",
        "You are responsible for all activities that occur under your account",
        "You must notify us immediately of any unauthorized use of your account",
        "We reserve the right to suspend or terminate accounts that violate these terms",
        "One person or entity may not maintain multiple accounts",
      ]
    },
    {
      icon: Shield,
      title: "3. Acceptable Use Policy",
      content: [
        "You agree to use our services only for lawful purposes",
        "You will not use our services to store, transmit, or distribute illegal content",
        "You will not attempt to gain unauthorized access to our systems or other users' accounts",
        "You will not use our services to send spam, malware, or malicious code",
        "You will not reverse engineer, decompile, or disassemble our software",
        "You will not use automated systems (bots, scrapers) without our written permission",
        "You will not resell or redistribute our services without authorization",
      ]
    },
    {
      icon: DollarSign,
      title: "4. Subscription & Payment",
      content: [
        "Access to MaycoleTracker™ requires a paid subscription (except free trial period)",
        "Subscription fees are billed in advance on a monthly or annual basis",
        "All fees are non-refundable except as required by law or stated in our Refund Policy",
        "We reserve the right to change pricing with 30 days notice to existing subscribers",
        "Failure to pay may result in suspension or termination of your account",
        "You authorize us to charge your payment method for all fees",
        "Free trials are limited to one per customer. Additional trials require approval",
      ]
    },
    {
      icon: Scale,
      title: "5. Intellectual Property",
      content: [
        "All content, software, and materials are owned by MaycoleTechnologies™ or our licensors",
        "MaycoleTechnologies™, MaycoleTracker™, and MAYCOLE Method™ are our trademarks",
        "You retain ownership of data you upload to our services",
        "You grant us a license to use your data solely to provide our services",
        "You may not use our trademarks, logos, or branding without written permission",
        "We respect intellectual property rights and expect users to do the same",
      ]
    },
    {
      icon: AlertTriangle,
      title: "6. Limitation of Liability",
      content: [
        "OUR SERVICES ARE PROVIDED \"AS IS\" WITHOUT WARRANTIES OF ANY KIND",
        "We do not guarantee uninterrupted, secure, or error-free service",
        "We are not liable for data loss, business interruption, or indirect damages",
        "Our total liability is limited to the amount you paid us in the last 12 months",
        "We are not responsible for third-party services or integrations",
        "Some jurisdictions do not allow liability limitations, so these may not apply to you",
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
              Terms of Service
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-4">
            Please read these terms carefully before using MaycoleTechnologies
            <sup className="text-xs align-super">™</sup> services.
            These terms govern your use of our platform and services.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <p>Effective Date: {effectiveDate}</p>
            <span>•</span>
            <p>Last Updated: {lastUpdated}</p>
          </div>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <Card className="border-red-600/50 bg-red-600/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-red-600">
                    Important Legal Notice
                  </h3>
                  <p className="text-gray-300">
                    <strong>READ CAREFULLY:</strong> These Terms of Service constitute a legally binding 
                    agreement between you and MaycoleTechnologies™. By using our services, you acknowledge 
                    that you have read, understood, and agree to be bound by these terms. If you do not 
                    agree, you must immediately discontinue use of our services.
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

        {/* Additional Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="space-y-8"
        >
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">7. Data Privacy & Security</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span>Your use of our services is also governed by our Privacy Policy</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span>We implement reasonable security measures but cannot guarantee absolute security</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span>You are responsible for backing up your data. We recommend regular exports</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span><strong>IMPORTANT:</strong> MaycoleTechnologies™ is NOT designed for storing PII or highly sensitive data</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span>You may cancel your subscription at any time through your account settings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span>We may suspend or terminate your account for violations of these terms</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span>Upon termination, your right to access our services ceases immediately</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span>You have 30 days to export your data after termination. After that, data may be deleted</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span>Sections that should survive termination (e.g., Limitation of Liability) will continue to apply</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
              <p className="text-gray-300 mb-4">
                You agree to indemnify and hold harmless MaycoleTechnologies™, its officers, directors, 
                employees, and agents from any claims, damages, losses, or expenses (including attorney fees) 
                arising from your use of our services, your violation of these terms, or your violation of 
                any rights of another party.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">10. Dispute Resolution</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span><strong>Governing Law:</strong> These terms are governed by the laws of the United States</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span><strong>Arbitration:</strong> Disputes will be resolved through binding arbitration, not court proceedings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span><strong>Class Action Waiver:</strong> You agree not to participate in class action lawsuits against us</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span><strong>Informal Resolution:</strong> Before arbitration, contact us to attempt informal resolution</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">11. Modifications to Service</h2>
              <p className="text-gray-300 mb-4">
                We reserve the right to modify, suspend, or discontinue any part of our services at any time, 
                with or without notice. We will not be liable to you or any third party for any modification, 
                suspension, or discontinuance of our services.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">12. Miscellaneous</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span><strong>Entire Agreement:</strong> These terms constitute the entire agreement between you and MaycoleTechnologies™</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span><strong>Severability:</strong> If any provision is found invalid, the remaining provisions continue in effect</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span><strong>Waiver:</strong> Our failure to enforce any right does not waive that right</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span><strong>Assignment:</strong> You may not assign these terms. We may assign our rights without restriction</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span><strong>Force Majeure:</strong> We are not liable for delays or failures due to circumstances beyond our control</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="space-y-2 text-gray-300">
                <p><strong>General Support:</strong> help@maycoletechnologies.com</p>
                <p><strong>Legal Inquiries:</strong> legal@maycoletechnologies.com</p>
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