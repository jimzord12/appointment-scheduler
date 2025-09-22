import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';

import './index.css';
import { initI18nFromCache } from './lib/i18n/index.js';
import { initThemeFromCache } from './lib/theme/index.js';
import { AppRouterProvider } from './router/index.js';
import { preferencesStore } from './stores/preferences.js';

// Initialize cached preferences before rendering to reduce flashes
initThemeFromCache();
initI18nFromCache();
preferencesStore.getState().hydrateFromDevice();

const container = document.getElementById('root');
const queryClient = new QueryClient();
if (container) {
  createRoot(container).render(
    <QueryClientProvider client={queryClient}>
      <AppRouterProvider />
    </QueryClientProvider>
  );
}
