import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, PluginOption } from 'vite';

const ReactCompilerConfig = {};
const srcDir = resolve(process.cwd(), 'src');

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
      },
    }),
    // Enable bundle analysis when running in analyze mode
    mode === 'analyze'
      ? [
          visualizer({
            filename: 'dist/bundle-analysis.html',
          }) as PluginOption,
        ]
      : [],
  ].filter(Boolean),
  optimizeDeps: {
    include: ['zod'],
  },
  resolve: {
    alias: {
      '@': srcDir,
    },
    dedupe: ['zod'],
  },
  server: {
    proxy: {
      // Proxy frontend /api/* requests to the backend and remove the /api prefix
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
}));
