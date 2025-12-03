import { motion } from 'motion/react';
import { Home, ArrowLeft, Search, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { AtomicLogo } from './AtomicLogo';

export function NotFound() {
  const popularPages = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/#products' },
    { name: 'Technologies', path: '/#technologies' },
    { name: 'Free Trial', path: '/#free-trial' },
    { name: 'Contact', path: '/#contact' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-4xl w-full">
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8 md:p-16">
            {/* Atomic Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <div className="w-[120px] h-[120px]">
                <AtomicLogo />
              </div>
            </motion.div>

            {/* 404 Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-7xl md:text-9xl font-bold mb-4">
                <span className="bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
                  404
                </span>
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Page Not Found
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                The page you're looking for doesn't exist or has been moved. 
                Don't worry, we'll help you find what you need.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Button
                onClick={() => (window.location.href = '/')}
                className="bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700 text-white flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go to Homepage
              </Button>
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            </motion.div>

            {/* Popular Pages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-8"
            >
              <h3 className="text-xl font-semibold text-center mb-6 flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                Popular Pages
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {popularPages.map((page, index) => (
                  <motion.a
                    key={page.name}
                    href={page.path}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    className="p-4 bg-secondary/50 hover:bg-secondary rounded-lg text-center transition-all hover:scale-105"
                  >
                    <span className="font-medium">{page.name}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Divider */}
            <div className="border-t border-gray-700 my-8"></div>

            {/* Help Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 bg-green-600/10 px-4 py-2 rounded-full mb-4">
                <Mail className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-600">Need Help?</span>
              </div>
              <p className="text-gray-300 mb-4">
                Can't find what you're looking for? Our team is here to help.
              </p>
              <a
                href="/#contact"
                className="text-green-600 hover:text-green-500 font-medium inline-flex items-center gap-2"
              >
                Contact Support
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </a>
            </motion.div>

            {/* Branding */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-12 pt-8 border-t border-gray-700 text-center"
            >
              <p className="text-sm text-gray-500">
                <span className="bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent font-semibold">
                  MaycoleTechnologies
                </span>
                <sup className="text-xs align-super">™</sup>
                {' '}- Changing The Future One Product At A Time
              </p>
            </motion.div>
          </CardContent>
        </Card>

        {/* Fun Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-center mt-8 text-gray-500 text-sm"
        >
          <p>Lost in the digital void? We've all been there. 🚀</p>
        </motion.div>
      </div>
    </div>
  );
}