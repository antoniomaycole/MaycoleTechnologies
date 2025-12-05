/**
 * MaycoleTracker Website Logo Transfer
 *
 * Bridge component that exports the CleanIcon used by HeroSection
 * and MaycoleTrackerButton for consistent branding across the app
 */

import { AtomicLogo } from './components/AtomicLogo';

/**
 * CleanIcon - Alias for AtomicLogo used in website sections
 * Provides a clean, minimal logo representation
 */
export const CleanIcon = AtomicLogo;

/**
 * Export types for logo components
 */
export type { ComponentProps } from 'react';
