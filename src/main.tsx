
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Define process.env if it doesn't exist (browser environment)
if (typeof process === 'undefined') {
  window.process = { env: {} } as any;
}

createRoot(document.getElementById("root")!).render(
  <App />
);
