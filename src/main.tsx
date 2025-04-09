
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react';

// Define process.env if it doesn't exist (browser environment)
if (typeof process === 'undefined') {
  window.process = { env: {} } as any;
}

const PUBLISHABLE_KEY = "pk_test_dG91Y2hlZC1zdGFnLTk0LmNsZXJrLmFjY291bnRzLmRldiQ";
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key. Set VITE_CLERK_PUBLISHABLE_KEY in your .env file");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
