import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import { voidReact } from '@void/react/plugin';
import { defineConfig, loadEnv } from 'vite';
import { voidPlugin } from 'void';

export default defineConfig(({ mode, command }) => {
  // Void only auto-loads .env. Retain the existing public build variables.
  const publicEnv = command === 'serve' ? loadEnv(mode, process.cwd(), 'NEXT_PUBLIC_') : {};
  const publicValues = {
    NEXT_PUBLIC_BETTER_AUTH_URL:
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL ??
      publicEnv.NEXT_PUBLIC_BETTER_AUTH_URL ??
      'https://akumanoko.com',
    NEXT_PUBLIC_AVATAR_URL:
      process.env.NEXT_PUBLIC_AVATAR_URL ??
      publicEnv.NEXT_PUBLIC_AVATAR_URL ??
      'https://avatars.githubusercontent.com/u/35162226?v=4',
  };
  return {
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: Object.fromEntries(
      Object.entries(publicValues).map(([key, value]) => [
        `import.meta.env.${key}`,
        JSON.stringify(value),
      ]),
    ),
    resolve: { alias: { '~': fileURLToPath(new URL('./src', import.meta.url)) } },
    // Generated server-route imports are invisible to Vite's page-only dependency crawl.
    // Scan them at startup so later route visits do not switch React module instances.
    environments: {
      void_worker: {
        optimizeDeps: {
          entries: ['src/pages/**/*.{ts,tsx}', 'src/routes/**/*.ts', 'src/middleware/**/*.ts'],
        },
      },
    },
    plugins: [voidPlugin(), voidReact(), tailwindcss()],
  };
});
