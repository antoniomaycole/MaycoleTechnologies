import { AtomicLogo } from './AtomicLogo';
import { Button } from './ui/button';
import { BrandedIconButton } from './ui/branded-icon-button';

interface HeaderProps {
  onLaunchTracker?: () => void;
}

export function Header({ onLaunchTracker }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-gray-200 bg-white/95">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-1">
            <AtomicLogo size="xs" />
          </div>
          {/* Desktop Branding */}
          <div className="hidden sm:block leading-relaxed">
            <h1 className="text-base font-semibold maycole-gradient-text leading-tight pb-0.5">
              MaycoleTechnologies<sup className="maycole-trademark">™</sup>
            </h1>
            <p className="text-xs text-gray-700 leading-tight">
              Changing The Future One Product At A Time
            </p>
          </div>
          {/* Mobile Branded Icon Button */}
          <BrandedIconButton
            size="sm"
            variant="outline"
            className="sm:hidden"
            onClick={() => {
              if (onLaunchTracker) {
                onLaunchTracker();
              } else {
                console.warn('[Header] onLaunchTracker prop not provided');
              }
            }}
          />
        </div>

        <nav className="hidden lg:flex items-center space-x-6 text-sm">
          <a
            href="#home"
            className="text-gray-700 hover:text-maycole-green transition-colors whitespace-nowrap font-medium"
          >
            Home
          </a>
          <a
            href="#about"
            className="text-gray-700 hover:text-maycole-green transition-colors whitespace-nowrap font-medium"
          >
            About
          </a>
          <a
            href="#services"
            className="text-gray-700 hover:text-maycole-green transition-colors whitespace-nowrap font-medium"
          >
            Services
          </a>
          <a
            href="#products"
            className="text-gray-700 hover:text-maycole-green transition-colors whitespace-nowrap font-medium"
          >
            Products
          </a>
          <a
            href="#technologies"
            className="text-gray-700 hover:text-maycole-green transition-colors whitespace-nowrap font-medium"
          >
            Technology
          </a>
          <a
            href="#contact"
            className="text-gray-700 hover:text-maycole-green transition-colors whitespace-nowrap font-medium"
          >
            Contact
          </a>
        </nav>

        {/* Compact nav for medium screens */}
        <nav className="hidden md:flex lg:hidden items-center space-x-4 text-sm">
          <a
            href="#home"
            className="text-gray-700 hover:text-maycole-green transition-colors font-medium"
          >
            Home
          </a>
          <a
            href="#about"
            className="text-gray-700 hover:text-maycole-green transition-colors font-medium"
          >
            About
          </a>
          <a
            href="#services"
            className="text-gray-700 hover:text-maycole-green transition-colors font-medium"
          >
            Services
          </a>
          <a
            href="#products"
            className="text-gray-700 hover:text-maycole-green transition-colors font-medium"
          >
            Products
          </a>
          <a
            href="#contact"
            className="text-gray-700 hover:text-maycole-green transition-colors font-medium"
          >
            Contact
          </a>
        </nav>

        <Button
          size="sm"
          className="hidden lg:flex items-center gap-2 maycole-btn-primary"
          onClick={() => {
            if (onLaunchTracker) {
              onLaunchTracker();
            } else {
              console.warn('[Header] onLaunchTracker prop not provided');
            }
          }}
        >
          <span>Launch MaycoleCheckBook™</span>
        </Button>
      </div>
    </header>
  );
}
