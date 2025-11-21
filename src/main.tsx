import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';

// Hide initial loader once React is ready
const hideInitialLoader = () => {
  const loader = document.getElementById('initial-loader');
  if (loader) {
    loader.classList.add('hidden');
    // Remove from DOM after transition
    setTimeout(() => {
      loader.remove();
    }, 300);
  }
};

// Component wrapper to handle loader hiding
function AppWrapper() {
  useEffect(() => {
    // Hide loader after a brief moment to ensure smooth transition
    const timer = setTimeout(() => {
      hideInitialLoader();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AppWrapper />
    </ThemeProvider>
  </StrictMode>
);
