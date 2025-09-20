import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';

import { AppRouterProvider } from './router/index.js';

const container = document.getElementById('root');
const queryClient = new QueryClient();
if (container) {
  createRoot(container).render(
    <QueryClientProvider client={queryClient}>
      <AppRouterProvider />
    </QueryClientProvider>
  );
}
