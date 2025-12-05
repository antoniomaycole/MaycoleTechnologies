import { motion } from 'motion/react';
import { Cookie, Settings, BarChart3, Target, Shield, CheckCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export function CookiePolicy() {
  const lastUpdated = 'December 1, 2025';

  const cookieTypes = [
    {
      icon: Shield,
      title: 'Essential Cookies',
      description: 'Required for the website to function properly',
      canDisable: false,
      examples: [
        'Session cookies - Keep you logged in',
        'Security cookies - Protect against fraud',
        'Cookie consent preferences - Remember your choices',
        'Load balancing - Distribute server load',
      ],
      duration: 'Session or up to 1 year',
    },
    {
      icon: BarChart3,
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors use our website',
      canDisable: true,
      examples: [
        'Google Analytics - Traffic analysis and user behavior',
        'Page view tracking - Most visited pages',
        'Session duration - Time spent on site',
        'Bounce rate - Single page visits',
        'Conversion tracking - Goal completions',
      ],
      duration: 'Up to 2 years',
    },
    {
      icon: Target,
      title: 'Marketing Cookies',
      description: 'Used to deliver relevant advertisements',
      canDisable: true,
      examples: [
        'Google Ads - Remarketing campaigns',
        'Facebook Pixel - Social media advertising',
        'LinkedIn Insights - B2B targeting',
        'Ad personalization - Relevant product recommendations',
      ],
      duration: 'Up to 2 years',
    },
    {
      icon: Settings,
      title: 'Functional Cookies',
      description: 'Enhance functionality and personalization',
      canDisable: true,
      examples: [
        'Language preferences - Remember your language',
        'Region settings - Location-based content',
        'UI preferences - Theme, layout choices',
        'Video player settings - Volume, quality preferences',
      ],
      duration: 'Up to 1 year',
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
          <div className="flex items-center justify-center mb-6">
            <Cookie className="w-16 h-16 text-yellow-600" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
              Cookie Policy
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-4">
            This policy explains what cookies are, how MaycoleTechnologies
            <sup className="text-xs align-super">™</sup> uses them, and how you can manage your
            cookie preferences.
          </p>
          <p className="text-sm text-gray-400">Last Updated: {lastUpdated}</p>
        </motion.div>

        {/* What Are Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">What Are Cookies?</h2>
              <p className="text-gray-300 mb-4">
                Cookies are small text files stored on your device (computer, tablet, or mobile)
                when you visit a website. They help websites remember information about your visit,
                making your next visit easier and the site more useful to you.
              </p>
              <p className="text-gray-300">
                Cookies can be "session cookies" (deleted when you close your browser) or
                "persistent cookies" (remain on your device for a set period or until you delete
                them).
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cookie Types */}
        <div className="space-y-8 mb-16">
          {cookieTypes.map((cookie, index) => {
            const Icon = cookie.icon;
            return (
              <motion.div
                key={cookie.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-semibold mb-2">{cookie.title}</h2>
                          <p className="text-gray-400 mb-4">{cookie.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {cookie.canDisable ? (
                          <span className="px-3 py-1 bg-yellow-600/20 text-yellow-600 rounded-full text-sm">
                            Optional
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-green-600/20 text-green-600 rounded-full text-sm">
                            Required
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="ml-16 space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Examples:</h3>
                        <ul className="space-y-2">
                          {cookie.examples.map((example, i) => (
                            <li key={i} className="text-gray-300 flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-3 mt-1 flex-shrink-0" />
                              <span>{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 border-t border-gray-700">
                        <p className="text-sm text-gray-400">
                          <strong>Duration:</strong> {cookie.duration}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Third-Party Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
              <p className="text-gray-300 mb-4">
                In addition to our own cookies, we use third-party services that may set cookies on
                your device:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-green-600">Analytics Services:</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Google Analytics</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Mixpanel</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Hotjar</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-green-600">Marketing Services:</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Google Ads</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Facebook Pixel</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>LinkedIn Insights</span>
                    </li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                These third parties have their own privacy policies. We recommend reviewing them.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* How to Manage Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-12"
        >
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">How to Manage Your Cookie Preferences</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-green-600">
                    Option 1: Cookie Consent Banner
                  </h3>
                  <p className="text-gray-300 mb-2">
                    When you first visit our site, you'll see a cookie consent banner. You can:
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="text-gray-300 flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Accept all cookies</span>
                    </li>
                    <li className="text-gray-300 flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Customize your preferences (accept only certain types)</span>
                    </li>
                    <li className="text-gray-300 flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Reject optional cookies (essential cookies will still be used)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-green-600">
                    Option 2: Browser Settings
                  </h3>
                  <p className="text-gray-300 mb-2">
                    You can also manage cookies through your browser settings:
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="text-gray-300 flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>
                        <strong>Chrome:</strong> Settings → Privacy and security → Cookies and other
                        site data
                      </span>
                    </li>
                    <li className="text-gray-300 flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>
                        <strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site
                        Data
                      </span>
                    </li>
                    <li className="text-gray-300 flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>
                        <strong>Safari:</strong> Preferences → Privacy → Cookies and website data
                      </span>
                    </li>
                    <li className="text-gray-300 flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>
                        <strong>Edge:</strong> Settings → Privacy, search, and services → Cookies
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-green-600">
                    Option 3: Do Not Track
                  </h3>
                  <p className="text-gray-300">
                    Most browsers support "Do Not Track" (DNT) settings. However, there is no
                    universal standard for DNT, and we may not respond to DNT signals. We recommend
                    using the cookie consent banner or browser settings instead.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Impact of Disabling Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-12"
        >
          <Card className="border-yellow-600/50 bg-yellow-600/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Settings className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-yellow-600">
                    Impact of Disabling Cookies
                  </h3>
                  <p className="text-gray-300 mb-2">
                    If you disable cookies, some features of our website may not function properly:
                  </p>
                  <ul className="space-y-2">
                    <li className="text-gray-300 flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span>You may be logged out frequently</span>
                    </li>
                    <li className="text-gray-300 flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span>Your preferences won't be saved</span>
                    </li>
                    <li className="text-gray-300 flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span>Some features may not work as intended</span>
                    </li>
                    <li className="text-gray-300 flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span>You may see less relevant content and advertisements</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Updates to Policy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mb-12"
        >
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
              <p className="text-gray-300 mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our
                practices or for legal, operational, or regulatory reasons. We will notify you of
                any material changes by posting the updated policy on this page with a new "Last
                Updated" date.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mb-12"
        >
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Questions About Cookies?</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have questions about our cookie practices, please contact us:
              </p>
              <div className="space-y-2 text-gray-300">
                <p>
                  <strong>General Support:</strong> help@maycoletechnologies.com
                </p>
                <p>
                  <strong>Privacy Inquiries:</strong> privacy@maycoletechnologies.com
                </p>
                <p>
                  <strong>Phone:</strong> (213) 312-7814
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
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
