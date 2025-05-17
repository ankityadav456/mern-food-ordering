import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext'; // 👈 Import ThemeProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider> {/* 👈 Wrap your app */}
      <App />
    </ThemeProvider>
  </StrictMode>,
);
