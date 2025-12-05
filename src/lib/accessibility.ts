/**
 * Additional SEO and accessibility utilities
 */

/**
 * Skip to main content link for accessibility
 */
export function createSkipLink(): HTMLElement {
  const link = document.createElement('a');
  link.href = '#main-content';
  link.textContent = 'Skip to main content';
  link.className = 'sr-only focus:not-sr-only fixed top-0 left-0 z-50 bg-black text-white px-4 py-2';
  return link;
}

/**
 * Set ARIA labels for interactive elements
 */
export function setAriaLabel(element: HTMLElement, label: string): void {
  element.setAttribute('aria-label', label);
}

/**
 * Set ARIA description
 */
export function setAriaDescription(element: HTMLElement, description: string): void {
  const id = `aria-description-${Math.random().toString(36).substr(2, 9)}`;
  const desc = document.createElement('span');
  desc.id = id;
  desc.textContent = description;
  desc.className = 'sr-only';
  element.parentElement?.appendChild(desc);
  element.setAttribute('aria-describedby', id);
}

/**
 * Create accessible button with tooltip
 */
export function createAccessibleButton(
  text: string,
  onClick: () => void,
  tooltip?: string
): HTMLElement {
  const button = document.createElement('button');
  button.textContent = text;
  button.onclick = onClick;
  
  if (tooltip) {
    button.setAttribute('aria-label', tooltip);
    button.title = tooltip;
  }
  
  return button;
}

/**
 * Set focus management for modals
 */
export function focusTrap(element: HTMLElement): (() => void) => {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement?.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement?.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Announce content to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => announcement.remove(), 1000);
}

/**
 * Ensure color contrast ratio meets WCAG standards
 */
export function checkColorContrast(
  foreground: string,
  background: string
): { ratio: number; wcagAA: boolean; wcagAAA: boolean } {
  // This is a simplified version - for production use a library like polished
  // Get luminance of colors (simplified calculation)
  const getLuminance = (color: string): number => {
    const rgb = color.match(/\d+/g)?.map(Number) || [255, 255, 255];
    const [r, g, b] = rgb.map((val) => {
      const v = val / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (lighter + 0.05) / (darker + 0.05);

  return {
    ratio: Math.round(ratio * 100) / 100,
    wcagAA: ratio >= 4.5, // Normal text
    wcagAAA: ratio >= 7, // Enhanced contrast
  };
}

/**
 * Make component keyboard accessible
 */
export function makeKeyboardAccessible(
  element: HTMLElement,
  callback: (e: KeyboardEvent) => void
): void {
  if (!element.getAttribute('role')) {
    element.setAttribute('role', 'button');
  }

  if (!element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', '0');
  }

  element.addEventListener('click', callback);
  element.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback(e);
    }
  });
}

/**
 * Create live region for dynamic content updates
 */
export function createLiveRegion(
  id: string,
  priority: 'polite' | 'assertive' = 'polite'
): HTMLDivElement {
  const region = document.createElement('div');
  region.id = id;
  region.setAttribute('aria-live', priority);
  region.setAttribute('aria-atomic', 'true');
  region.className = 'sr-only';
  document.body.appendChild(region);
  return region;
}

/**
 * Update live region content
 */
export function updateLiveRegion(id: string, content: string): void {
  const region = document.getElementById(id);
  if (region) {
    region.textContent = content;
  }
}

/**
 * Get page readability metrics
 */
export function getReadabilityMetrics(): {
  headingCount: number;
  paragraphCount: number;
  listCount: number;
  imageCount: number;
  imagesWithoutAlt: number;
  linksCount: number;
  brokenLinks: number;
} {
  return {
    headingCount: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
    paragraphCount: document.querySelectorAll('p').length,
    listCount: document.querySelectorAll('ul, ol').length,
    imageCount: document.querySelectorAll('img').length,
    imagesWithoutAlt: document.querySelectorAll('img:not([alt])').length,
    linksCount: document.querySelectorAll('a').length,
    brokenLinks: Array.from(document.querySelectorAll('a')).filter(
      (a) => !a.href || a.href === '#'
    ).length,
  };
}
