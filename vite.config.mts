import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  plugins: [
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        autoStaticPathsDiscovery: false,
        filter: ({ path }) => {
          if (path.startsWith('/api')) {
            return false;
          }
          if (path.startsWith('/studio')) {
            return false;
          }
          return true;
        },
      },
      pages: [
        {
          path: '/',
          prerender: { enabled: true },
        },
        {
          path: '/blog',
          prerender: { enabled: true },
        },
      ],
      router: {
        routesDirectory: 'routes',
      },
    }),
    nitro(),
    react(),
  ],
});
