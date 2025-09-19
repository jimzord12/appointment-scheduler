import { createRoot } from 'react-dom/client';

import { AppRouterProvider } from './router/index.js';

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<AppRouterProvider />);
}
