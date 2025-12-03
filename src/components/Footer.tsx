import { AtomicLogo } from './AtomicLogo';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Calculator, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-6 py-12">
        {/* Launch MaycoleCheckBook CTA Banner */}
        <div className="mb-12 text-center">
          <div className="bg-gradient-to-r from-green-600 via-green-700 to-yellow-600 rounded-2xl p-8 shadow-xl">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Launch MaycoleCheckBook<sup className="text-sm">™</sup>
              </h3>
              <p className="text-white/90 max-w-2xl">
                AI-Powered Financial Intelligence • Voice-Enabled Transactions • Smart Sorting
              </p>
              <Button 
                className="bg-white text-green-700 hover:bg-gray-100 px-8 py-3 font-semibold"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Coming Soon - Join Waitlist
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <AtomicLogo size="sm" />
              <div className="leading-relaxed">
                <h3 className="text-lg font-semibold maycole-gradient-text leading-tight pb-0.5">
                  MaycoleTechnologies<sup className="maycole-trademark">™</sup>
                </h3>
                <p className="text-sm text-gray-700 leading-tight">Changing The Future One Product At A Time</p>
              </div>
            </div>
            <p className="text-gray-600 max-w-md">
              We are an innovative intelligent company leveraging agile practices and spring logic 
              to create technology solutions that make a meaningful impact.
            </p>
            <div className="pt-2">
              <a 
                href="mailto:help@maycoletechnologies.com" 
                className="inline-flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors group"
              >
                <Mail className="w-4 h-4 group-hover:text-green-600" />
                <span className="font-medium">help@maycoletechnologies.com</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Quick Links</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#home" className="hover:text-maycole-green transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-maycole-green transition-colors">About</a></li>
              <li><a href="#services" className="hover:text-maycole-green transition-colors">Services</a></li>
              <li><a href="#technologies" className="hover:text-maycole-green transition-colors">Technologies</a></li>
              <li><a href="#contact" className="hover:text-maycole-green transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Services</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-maycole-green transition-colors">Custom Development</a></li>
              <li><a href="#" className="hover:text-maycole-green transition-colors">Mobile Apps</a></li>
              <li><a href="#" className="hover:text-maycole-green transition-colors">Cloud Solutions</a></li>
              <li><a href="#" className="hover:text-maycole-green transition-colors">AI & ML</a></li>
              <li><a href="#" className="hover:text-maycole-green transition-colors">Consulting</a></li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-200" />

        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-600 text-sm">
            © {currentYear} <span className="maycole-gradient-text">MaycoleTechnologies</span><sup className="maycole-trademark">™</sup> - Volume XI. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="/privacy-policy" className="text-gray-600 hover:text-maycole-green transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-gray-600 hover:text-maycole-green transition-colors text-sm">
              Terms of Service
            </a>
            <a href="/cookie-policy" className="text-gray-600 hover:text-maycole-green transition-colors text-sm">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}