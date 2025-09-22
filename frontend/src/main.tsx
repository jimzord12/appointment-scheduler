import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';

import { initI18nFromCache } from './lib/i18n/index.js';
import { initThemeFromCache } from './lib/theme/index.js';
import { AppRouterProvider } from './router/index.js';
import './index.css';

// Initialize cached preferences before rendering to reduce flashes
initThemeFromCache();
initI18nFromCache();

const container = document.getElementById('root');
const queryClient = new QueryClient();
if (container) {
  createRoot(container).render(
    <QueryClientProvider client={queryClient}>
      <AppRouterProvider />
    </QueryClientProvider>
  );
}
