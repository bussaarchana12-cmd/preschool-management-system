import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global fetch interceptor to support cross-origin API calls (like from GitHub Pages to Render)
const originalFetch = window.fetch;
window.fetch = function (input, init) {
  let url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
  if (url.startsWith("/api/")) {
    const defaultApiUrl = "https://preschool-management-system.onrender.com";
    const apiBase = (import.meta as any).env?.VITE_API_URL || localStorage.getItem("VITE_API_URL") || (window.location.hostname.includes("github.io") ? defaultApiUrl : "");
    const newUrl = apiBase + url;
    if (typeof input === "string") {
      input = newUrl;
    } else if (input instanceof URL) {
      input = new URL(newUrl);
    } else {
      input = new Request(newUrl, input);
    }
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
