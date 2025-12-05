import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import './styles/globals.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import {
  initializeAllServices,
  setupOnlineMonitoring,
  setupPWAInstallPrompt,
} from './lib/service-enforcer';

// Global error handler for uncaught promises (browser-compatible)
window.addEventListener('unhandledrejection', (event) => {
  console.warn('[UnhandledRejection]', event.reason);
});

window.addEventListener('error', (event) => {
  console.error('[GlobalError]', event.error);
});

// Setup PWA install prompt (non-blocking)
setupPWAInstallPrompt();

// Setup online status monitoring (non-blocking)
const unsubscribeOnline = setupOnlineMonitoring();

console.log('[App] Initial online status: ' + (navigator.onLine ? 'online' : 'offline'));

/**
 * Mount React app with enforced error handling
 */
const renderApp = () => {
  try {
    const rootElement = document.getElementById('root');

    if (!rootElement) {
      throw new Error('Root element (#root) not found in DOM');
    }

    console.log('[React] Mounting application...');

    createRoot(rootElement).render(
      <StrictMode>
        <HelmetProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </HelmetProvider>
      </StrictMode>
    );

    console.log('[React] ✓ Application mounted successfully');

    // Initialize background services AFTER React mounts (non-blocking)
    // This ensures the UI renders first, then services load
    initializeAllServices()
      .then((results) => {
        const status = results.map((r) => `${r.service}: ${r.success ? '✓' : '✗'}`).join(', ');
        console.log('[Services] Status:', status);
      })
      .catch((error) => {
        console.warn('[Services] Initialization error:', error);
      });
  } catch (error) {
    console.error('[React] Critical error - rendering error page:', error);
    renderErrorPage(error);
  }
};

/**
 * Render error page fallback
 */
const renderErrorPage = (error: any) => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        font-family: system-ui, -apple-system, sans-serif;
        background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
      ">
        <div style="
          text-align: center;
          padding: 40px;
          max-width: 600px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        ">
          <h1 style="
            color: #dc2626;
            margin: 0 0 16px 0;
            font-size: 28px;
          ">
            Application Error
          </h1>
          <p style="
            color: #666;
            margin: 0 0 20px 0;
            font-size: 16px;
            line-height: 1.5;
          ">
            The application failed to load. Please check the console for details.
          </p>
          <pre style="
            background: #f3f4f6;
            padding: 16px;
            border-radius: 6px;
            overflow: auto;
            text-align: left;
            font-size: 13px;
            color: #dc2626;
            border-left: 4px solid #dc2626;
            margin: 0 0 20px 0;
          ">
${String(error?.message || error)}
          </pre>
          <button onclick="location.reload()" style="
            padding: 10px 24px;
            background: #0ea5e9;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background 0.2s;
          " onmouseover="this.style.background='#0284c7'" onmouseout="this.style.background='#0ea5e9'">
            Reload Page
          </button>
        </div>
      </div>
    `;
  }
};

// Mount app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}

// Cleanup on unload
window.addEventListener('beforeunload', () => {
  unsubscribeOnline?.();
});

// Log successful initialization
console.log('[App] Initialization complete');
