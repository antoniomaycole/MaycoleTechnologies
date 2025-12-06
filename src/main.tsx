import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import './styles/globals.css';
import { ErrorBoundary } from './components/ErrorBoundary';

console.log('[main.tsx] Script loaded');

// Mount React immediately - services will load after
const rootElement = document.getElementById('root');
const loaderElement = document.getElementById('app-loader');

console.log('[main.tsx] Root element:', rootElement);
console.log('[main.tsx] Loader element:', loaderElement);

if (rootElement) {
  console.log('[main.tsx] Root element found, mounting React app');
  try {
    const root = createRoot(rootElement);
    console.log('[main.tsx] createRoot successful');
    
    root.render(
      <StrictMode>
        <HelmetProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </HelmetProvider>
      </StrictMode>
    );
    console.log('[main.tsx] React app rendered to DOM');
    
    // Hide loader after React renders
    if (loaderElement) {
      setTimeout(() => {
        console.log('[main.tsx] Hiding loader');
        loaderElement.classList.add('hidden');
      }, 500);
    }
  } catch (error) {
    console.error('[main.tsx] Error mounting React app:', error);
    if (loaderElement) {
      loaderElement.innerHTML = '<div style="color: #ff4444; padding: 20px; text-align: center; background: #111;"><h2>Error Loading App</h2><p>' + String(error) + '</p></div>';
    }
  }
} else {
  console.error('[main.tsx] Root element not found!');
  if (loaderElement) {
    loaderElement.innerHTML = '<div style="color: #ff4444; padding: 20px; text-align: center; background: #111;"><h2>Error</h2><p>Root element not found</p></div>';
  }
}

// Load services after React mounts (lazy, non-blocking)
import('./lib/service-enforcer')
  .then(({ initializeAllServices, setupOnlineMonitoring, setupPWAInstallPrompt }) => {
    setupPWAInstallPrompt();
    setupOnlineMonitoring();
    initializeAllServices().catch(() => {});
  })
  .catch(() => {});

// Load services after React mounts (lazy, non-blocking)
import('./lib/service-enforcer')
  .then(({ initializeAllServices, setupOnlineMonitoring, setupPWAInstallPrompt }) => {
    setupPWAInstallPrompt();
    setupOnlineMonitoring();
    initializeAllServices().catch(() => {});
  })
  .catch(() => {});
