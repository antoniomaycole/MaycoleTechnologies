/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    // MaycoleTechnologies™ Brand Classes
    'maycole-gradient-text',
    'maycole-gradient-bg',
    'maycole-company-name',
    'maycole-tagline',
    'maycole-trademark',
    'maycole-btn-primary',
    'maycole-btn-secondary',
    'maycole-card',
    'maycole-section',
    'maycole-container',
    'atomic-spin',
    'atomic-orbit',
    // Color utilities
    'text-maycole-green',
    'text-maycole-gold',
    'bg-maycole-green',
    'bg-maycole-gold',
    'border-maycole-green',
    'border-maycole-gold',
    'hover:bg-maycole-green',
    'hover:text-background',
    'hover:border-maycole-green/30',
    // Gradient utilities
    'from-maycole-green',
    'to-maycole-gold',
    'bg-gradient-to-r',
  ],
  theme: {
    extend: {
      colors: {
        // MaycoleTechnologies™ Brand Colors
        'maycole-green': 'var(--maycole-green)',
        'maycole-gold': 'var(--maycole-gold)',
        'maycole-dark': 'var(--maycole-dark)',
        'maycole-light': 'var(--maycole-light)',

        // System Colors
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        chart: {
          1: 'var(--chart-1)',
          2: 'var(--chart-2)',
          3: 'var(--chart-3)',
          4: 'var(--chart-4)',
          5: 'var(--chart-5)',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif',
        ],
      },
      spacing: {
        unit: 'var(--spacing-unit)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow:
              '0 0 5px var(--maycole-green), 0 0 10px var(--maycole-green), 0 0 15px var(--maycole-green)',
          },
          '50%': {
            boxShadow:
              '0 0 10px var(--maycole-gold), 0 0 20px var(--maycole-gold), 0 0 30px var(--maycole-gold)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'gradient-shift': 'gradient-shift 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        ':root, :host': {
          // MaycoleTechnologies™ Core Brand Variables
          '--maycole-green': '#1e7f3e',
          '--maycole-gold': '#ffd700',
          '--maycole-dark': '#252525',
          '--maycole-light': '#fafafa',

          // Typography & Display
          '--font-display':
            '"Satoshi", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          '--font-size': '16px',
          '--font-weight-medium': '500',
          '--font-weight-normal': '400',

          // Spacing & Layout
          '--spacing-unit': '1rem',
          '--radius': '0.625rem',

          // Light Theme (Website)
          '--background': '#ffffff',
          '--foreground': '#0a0a0a',
          '--card': '#ffffff',
          '--card-foreground': '#0a0a0a',
          '--popover': '#ffffff',
          '--popover-foreground': '#0a0a0a',
          '--primary': 'var(--maycole-green)',
          '--primary-foreground': '#ffffff',
          '--secondary': '#f3f4f6',
          '--secondary-foreground': 'var(--maycole-green)',
          '--muted': '#e5e7eb',
          '--muted-foreground': '#6b7280',
          '--accent': '#f0f9ff',
          '--accent-foreground': 'var(--maycole-green)',
          '--destructive': '#ef4444',
          '--destructive-foreground': '#ffffff',
          '--border': '#e5e7eb',
          '--input': '#ffffff',
          '--input-background': '#f9fafb',
          '--ring': '#1e7f3e',

          // Chart Colors
          '--chart-1': 'var(--maycole-green)',
          '--chart-2': 'var(--maycole-gold)',
          '--chart-3': '#f97316',
          '--chart-4': '#8b5cf6',
          '--chart-5': '#06b6d4',

          // Sidebar Variables
          '--sidebar': '#f9fafb',
          '--sidebar-foreground': '#0a0a0a',
          '--sidebar-primary': 'var(--maycole-green)',
          '--sidebar-primary-foreground': '#ffffff',
          '--sidebar-accent': '#e5e7eb',
          '--sidebar-accent-foreground': 'var(--maycole-green)',
          '--sidebar-border': '#e5e7eb',
          '--sidebar-ring': '1e7f3e',
        },
      });
    },
  ],
};
