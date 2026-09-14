import { fileURLToPath } from 'node:url';

import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => ({
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  resolve: { alias: { '~': fileURLToPath(new URL('./src', import.meta.url)) } },
  plugins: [
    cloudflare({
      viteEnvironment: { name: 'ssr' },
      config:
        mode === 'cloudflare'
          ? undefined
          : (config) => ({
              vars: {
                ...config.vars,
                BETTER_AUTH_URL:
                  loadEnv(mode, process.cwd(), 'BETTER_AUTH_URL').BETTER_AUTH_URL ||
                  'http://localhost:3000',
              },
            }),
    }),
    tanstackStart(),
    tailwindcss(),
    react(),
  ],
}));
