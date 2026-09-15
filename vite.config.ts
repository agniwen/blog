import { readFileSync } from 'node:fs';
import { parse } from 'jsonc-parser';
import { startRemoteBridge } from './scripts/dev/remote-bridge';
import { fileURLToPath } from 'node:url';

import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(async ({ mode, command, isPreview }) => {
  const config = parse(readFileSync('wrangler.jsonc', 'utf8'));
  const bridge = command === 'serve' && !isPreview && mode !== 'cloudflare'
    ? await startRemoteBridge(config.account_id, config.d1_databases.find((binding: { binding: string }) => binding.binding === 'DB').database_id)
    : undefined;
  return ({
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  resolve: { alias: { '~': fileURLToPath(new URL('./src', import.meta.url)) } },
  plugins: [
    ...(bridge ? [{ name: 'local-remote-connection', configureServer(server: import('vite').ViteDevServer) { server.httpServer?.once('close', () => void bridge.close()); } }] : []),
    cloudflare({
      viteEnvironment: { name: 'ssr' },
      remoteBindings: !bridge,
      config:
        mode === 'cloudflare'
          ? undefined
          : (config) => ({
              vars: {
                ...config.vars,
                ...(bridge ? { DEV_REMOTE_URL: bridge.url } : {}),
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
});
});
