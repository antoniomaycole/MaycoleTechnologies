/**
 * MaycoleTechnologies™ Component Index
 * 
 * Central export file for all components to improve import organization
 * and enable better tree-shaking in production builds.
 */

// Core Layout Components
export { default as App } from '../App';
export { Header } from './Header';
export { Footer } from './Footer';
export { TickerTape } from './TickerTape';

// Logo & Branding
export { AtomicLogo } from './AtomicLogo';

// Page Sections
export { HeroSection } from './HeroSection';
export { AboutSection } from './AboutSection';
export { ServicesSection } from './ServicesSection';
export { ProductsSection } from './ProductsSection';
export { TechnologiesSection } from './TechnologiesSection';
export { PaymentSection } from './PaymentSection';
export { ContactSection } from './ContactSection';
export { MainSections } from './MainSections';
export { LeadCapture } from './LeadCapture';

// UI Components (re-export from shadcn/ui)
export { Button } from './ui/button';
export { IconButton } from './ui/icon-button';
export { BrandedIconButton } from './ui/branded-icon-button';
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
export { Input } from './ui/input';
export { Label } from './ui/label';
export { Textarea } from './ui/textarea';
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
export { Badge } from './ui/badge';
export { Separator } from './ui/separator';
export { Toaster } from './ui/sonner';
export { toast } from 'sonner';

// Form Components
export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
export { Checkbox } from './ui/checkbox';

// Layout & Navigation
export { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from './ui/navigation-menu';
export { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

// Data Display
export { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
export { Progress } from './ui/progress';
export { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

// Utility Components
export { ImageWithFallback } from './ImageWithFallback';
export { PWAInstallPrompt, PWAStatusIndicator, PWAFeaturesStatus, PWAUpdatePrompt } from './PWAComponents';

// Types and Utilities
export type { ComponentProps } from 'react';

/**
 * Component Categories for Better Organization:
 * 
 * Layout: Header, Footer, TickerTape, MainSections
 * Sections: Hero, About, Services, Products, Technologies, Payment, Contact
 * Branding: AtomicLogo
 * Forms: All form-related UI components
 * Display: Cards, Tables, Progress, etc.
 * Utility: ImageWithFallback, toast functions
 */