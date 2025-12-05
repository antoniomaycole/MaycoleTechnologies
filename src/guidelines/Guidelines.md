# MaycoleTechnologies™ Development Guidelines

## Brand Identity & Messaging

### Core Brand Elements

- **Company Name**: Always write as "MaycoleTechnologies" (one word, no spaces)
- **Tagline**: "Changing Lives One Product At A Time"
- **Trademark**: Always include ™ symbol after company name using `<sup style={{ fontSize: '0.4em', verticalAlign: 'super' }}>™</sup>`
- **Founder**: Antonio G. Maycole
- **MAYCOLE Method™**: Proprietary framework - always include ™ symbol

### Color Scheme

- **Primary Green**: `#1e7f3e` (company name, primary buttons, accents)
- **Primary Gold**: `#ffd700` (tagline, secondary accents, highlights)
- **Background**: Dark theme with `oklch(0.25 0 0)` base
- **Text**: Light foreground `oklch(0.85 0 0)` for readability

### Logo & Branding

- **Atomic Logo**: Red spinning ball at center with orbiting particles
- **Consistency**: Use AtomicLogo component for all logo instances
- **Icons**: Replace generic icons with atomic-themed branding when possible

## Design System Guidelines

### Typography

- **Company Name**: Always use green color (`text-green-600` or gradient)
- **Tagline**: Always use gold/yellow color (`text-yellow-600` or gradient)
- **Headings**: Use gradient text for impact: `bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent`
- **Body Text**: Maintain proper contrast for accessibility

### Layout & Structure

- **Responsive Design**: Mobile-first approach, all components must be responsive
- **Sections**: Each major section should have proper spacing (`py-20` minimum)
- **Cards**: Use consistent shadow and hover effects
- **Animations**: Use motion/react for smooth transitions and micro-interactions

### Components

#### Buttons

- **Primary**: Green to yellow gradient background
- **Secondary**: Outlined with green border
- **Hover States**: Always include hover animations and shadow effects
- **Loading States**: Include spinner animations for form submissions

#### Forms

- **Validation**: Real-time validation with clear error messages
- **Input Formatting**: Auto-format card numbers, phone numbers, dates
- **Required Fields**: Mark with asterisk (\*) and proper labels
- **Security**: Mask sensitive inputs (CVV, passwords)

#### Navigation

- **Header**: Fixed/sticky navigation with smooth scroll to sections
- **Mobile**: Hamburger menu with slide-out animation
- **Active States**: Highlight current section in navigation

## Technical Guidelines

### Code Quality

- **TypeScript**: Use strict typing, avoid `any` types
- **Component Structure**: One component per file, proper imports/exports
- **State Management**: Use React hooks appropriately
- **Performance**: Implement lazy loading for images and components

### File Organization

```
components/
├── ui/           # Reusable UI components (shadcn/ui)
├── sections/     # Page sections (Hero, About, etc.)
├── forms/        # Form components
└── shared/       # Shared utility components
```

### Styling

- **Tailwind V4**: Use CSS variables from globals.css
- **No Font Overrides**: Don't use `text-*` classes for size/weight unless specifically requested
- **Consistent Spacing**: Use standard Tailwind spacing scale
- **Dark Theme**: Default to dark theme with proper contrast

### Animations & Interactions

- **Motion**: Use motion/react for all animations
- **Viewport Animations**: Elements animate in when scrolled into view
- **Hover Effects**: Smooth transitions on interactive elements
- **Loading States**: Visual feedback for all async operations

## Content Guidelines

### Product Information

- **MaycoleTracker™**: Primary product - AI-native inventory management
- **Subscription Plans**: Professional ($99/mo), Enterprise ($299/mo), Custom (contact)
- **Technologies**: Focus on Agile Practices, Spring Logic, AI/ML
- **Target Audience**: Enterprise clients, professional businesses

### Messaging Tone

- **Professional**: Oracle/Apple level presentation quality
- **Innovative**: Emphasize cutting-edge technology
- **Trustworthy**: Enterprise-grade security and reliability
- **Approachable**: Technical excellence made accessible

## Security & Privacy

### Forms & Data

- **PII Protection**: Clearly state data usage policies
- **Payment Security**: Highlight SSL encryption and security measures
- **Validation**: Client-side validation with server-side verification
- **Error Handling**: Graceful error messages, no sensitive data exposure

### Best Practices

- **Environment Variables**: Use for API keys and sensitive config
- **Input Sanitization**: Validate and sanitize all user inputs
- **HTTPS Only**: Ensure all communications are encrypted
- **Regular Updates**: Keep dependencies updated for security

## Accessibility

### Requirements

- **WCAG 2.1 AA**: Meet accessibility standards
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Ensure sufficient contrast ratios
- **Focus States**: Clear focus indicators for all interactive elements

### Implementation

- **Alt Text**: Descriptive alt text for all images
- **Form Labels**: Proper label associations
- **Headings**: Logical heading hierarchy (h1 → h2 → h3)
- **Skip Links**: Navigation skip links for keyboard users

## Performance

### Optimization

- **Image Optimization**: Use ImageWithFallback component
- **Code Splitting**: Lazy load components when appropriate
- **Bundle Size**: Monitor and optimize bundle size
- **Core Web Vitals**: Maintain good performance metrics

### Monitoring

- **Analytics**: Track user interactions and performance
- **Error Tracking**: Monitor and fix runtime errors
- **Performance Metrics**: Regular performance auditing
- **User Experience**: Monitor user feedback and behavior

---

**MaycoleTechnologies™** - Maintaining Oracle-level professional quality in every pixel.
