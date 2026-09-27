import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Register PWA service worker for offline caching in production
if ('serviceWorker' in navigator && !import.meta.env.DEV) {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      console.log('ToolBox BD update available');
    },
    onOfflineReady() {
      console.log('ToolBox BD is ready to work offline');
    },
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
