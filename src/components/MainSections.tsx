import { AboutSection } from './AboutSection';
import { ServicesSection } from './ServicesSection';
import { ProductsSection } from './ProductsSection';
import { FreeTrialSection } from './FreeTrialSection';
import { MobileAppSection } from './MobileAppSection';
import { AwardsSection } from './AwardsSection';
import { ROICalculator } from './ROICalculator';
import { TechnologiesSection } from './TechnologiesSection';
import { FAQSection } from './FAQSection';
import { NewsletterSection } from './NewsletterSection';
import { ContactSection } from './ContactSection';

interface MainSectionsProps {
  onLaunchTracker?: () => void;
}

/**
 * MainSections Component
 *
 * Combines all main content sections with consistent background styling.
 * Each section uses light gray background (#f9fafb) for subtle contrast.
 *
 * Background Strategy:
 * - Homepage hero uses pure white (#ffffff)
 * - All sections use light gray (#f9fafb)
 * - Strategic placement for conversion optimization
 */
export function MainSections({ onLaunchTracker }: MainSectionsProps) {
  return (
    <>
      {/* About Section */}
      <div className="maycole-section-about">
        <AboutSection />
      </div>

      {/* Services Section */}
      <div className="maycole-section-services">
        <ServicesSection />
      </div>

      {/* Products Section */}
      <div className="maycole-section-products">
        <ProductsSection onLaunchTracker={onLaunchTracker} />
      </div>

      {/* ROI Calculator - Show Value Proposition */}
      <div className="maycole-section-services bg-white">
        <ROICalculator />
      </div>

      {/* Free Trial Section - Capitalize on Trust Built */}
      <div className="maycole-section-about">
        <FreeTrialSection onLaunchTracker={onLaunchTracker} />
      </div>

      {/* Mobile App Section - Show Complete Solution */}
      <div className="maycole-section-services bg-white">
        <MobileAppSection />
      </div>

      {/* Awards & Recognition - Build Credibility */}
      <div className="maycole-section-about">
        <AwardsSection />
      </div>

      {/* Technologies Section */}
      <div className="maycole-section-technologies">
        <TechnologiesSection />
      </div>

      {/* FAQ Section - Address Objections Before Contact */}
      <div className="maycole-section-about">
        <FAQSection />
      </div>

      {/* Newsletter Section - Lead Generation */}
      <div className="maycole-section-services bg-white">
        <NewsletterSection />
      </div>

      {/* Contact Section - Final CTA */}
      <div className="maycole-section-contact">
        <ContactSection />
      </div>
    </>
  );
}
