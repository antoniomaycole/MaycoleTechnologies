import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';

// ⚠️ ENFORCER: Prevent visualizer from blocking dev server
const isProduction = process.env.NODE_ENV === 'production';
const isBuild = process.argv.includes('build');

export default defineConfig({
  plugins: [
    react(),
    // Bundle analysis plugin - ONLY enable during production builds
    isProduction || isBuild
      ? (visualizer({
          open: false,
          gzipSize: true,
          brotliSize: true,
          filename: 'dist/bundle-analysis.html',
        }) as any)
      : null,
  ].filter(Boolean),
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': '/src',
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Aggressive code splitting for optimal performance
        manualChunks: (id: string) => {
          // Core framework
          if (id.includes('node_modules/react/')) return 'vendor-react';
          if (id.includes('node_modules/react-dom/')) return 'vendor-react';
          if (id.includes('node_modules/react-router-dom/')) return 'vendor-react-router';

          // UI Components
          if (id.includes('@radix-ui')) return 'vendor-ui';

          // Charts & Data Visualization
          if (id.includes('recharts')) return 'vendor-charts';

          // Forms & Validation
          if (id.includes('react-hook-form') || id.includes('zod')) return 'vendor-forms';

          // Utilities
          if (
            id.includes('clsx') ||
            id.includes('class-variance-authority') ||
            id.includes('zustand') ||
            id.includes('jotai')
          )
            return 'vendor-utils';

          // Icons & Assets
          if (id.includes('lucide-react') || id.includes('react-icons')) return 'vendor-icons';

          // Animation & Motion
          if (id.includes('framer-motion') || id.includes('motion')) return 'vendor-motion';

          // HTTP Client
          if (id.includes('axios') || id.includes('swr')) return 'vendor-http';

          // Monitoring & Analytics
          if (id.includes('@sentry')) return 'vendor-monitoring';

          // Date & Time
          if (id.includes('date-fns') || id.includes('dayjs')) return 'vendor-date';

          // Email & Services
          if (id.includes('@sendgrid')) return 'vendor-services';

          // Compression & Optimization
          if (id.includes('react-lazy-load-image-component')) return 'vendor-optimization';

          // React Helmet
          if (id.includes('react-helmet-async')) return 'vendor-seo';
        },
        // Optimize chunk filenames for better caching
        entryFileNames: 'js/[name].[hash:8].js',
        chunkFileNames: 'js/[name].[hash:8].js',
        assetFileNames: (assetInfo: any) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|gif|svg|webp|ico/i.test(ext)) {
            return `images/[name].[hash:8][extname]`;
          } else if (/woff|woff2|eot|ttf|otf/.test(ext)) {
            return `fonts/[name].[hash:8][extname]`;
          } else if (ext === 'css') {
            return `css/[name].[hash:8][extname]`;
          }
          return `[name].[hash:8][extname]`;
        },
      },
    },
  },
  server: {
    port: 3000,
    headers: {
      'Service-Worker-Allowed': '/',
      // Performance headers for dev server
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    },
    // Enable compression for dev server
    middlewareMode: false,
  },
  // Optimize dependencies for faster builds (only include available deps)
  optimizeDeps: {
    include: ['react', 'react-dom', 'clsx', 'recharts', 'motion/react'],
  },
});
