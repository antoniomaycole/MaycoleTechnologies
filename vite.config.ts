import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
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
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
          ],
          'vendor-charts': ['recharts'],
          'vendor-forms': ['react-hook-form'],
          'vendor-utils': ['clsx', 'class-variance-authority'],
        },
      },
    },
  },
  server: {
    port: 3000,
    headers: {
      'Service-Worker-Allowed': '/',
    },
  },
});
