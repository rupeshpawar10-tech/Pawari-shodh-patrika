import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Intercept harmless browser events (such as IndexedDB tab lock transitions or ResizeObserver)
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reasonMsg = String(event.reason?.message || event.reason || '');
    if (
      reasonMsg.includes('closing/hidden') ||
      reasonMsg.includes('Database is closing') ||
      reasonMsg.includes('database is closing') ||
      reasonMsg.includes('IndexedDB')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const errorMsg = String(event.message || event.error?.message || event.error || '');
    if (
      errorMsg.includes('closing/hidden') ||
      errorMsg.includes('Database is closing') ||
      errorMsg.includes('database is closing') ||
      errorMsg.includes('ResizeObserver')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

