import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.css';
import App from '@/app.tsx';
import { ResponseProvider } from '@/context/response-context.tsx';

// biome-ignore lint/style/noNonNullAssertion: Mandatory from REACT
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ResponseProvider>
      <App />
    </ResponseProvider>
  </StrictMode>
);
