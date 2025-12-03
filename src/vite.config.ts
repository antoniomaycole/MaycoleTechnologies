import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': '/src',
      '@/components': '/components',
      '@/styles': '/styles'
    }
  },
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === 'charset') {
                atRule.remove();
              }
            }
          }
        }
      ]
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable for production
    minify: 'terser',
    cssMinify: true,
    target: 'esnext',
    rollupOptions: {
      input: {
        main: './index.html',
        sw: './public/sw.js'
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', 'motion/react'],
          charts: ['recharts'],
          forms: ['react-hook-form@7.55.0'],
          toast: ['sonner@2.0.3'],
          utils: ['class-variance-authority', 'clsx', 'tailwind-merge']
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (chunkInfo) => {
          // Keep service worker at root level
          if (chunkInfo.name === 'sw.js') {
            return 'sw.js';
          }
          return 'assets/[name]-[hash].[ext]';
        }
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
        remove_unused: true,
        dead_code: true
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096
  },
  server: {
    port: 3000,
    open: true,
    hmr: {
      overlay: true
    }
  },
  preview: {
    port: 4173,
    strictPort: true
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react',
      'motion/react',
      'recharts',
      'react-hook-form@7.55.0',
      'sonner@2.0.3'
    ]
  }
})