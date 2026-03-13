import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: false,
        autoStaticPathsDiscovery: false,
        filter: ({ path }) => {
          if (path.startsWith('/api')) {
            return false;
          }
          if (path.startsWith('/studio')) {
            return false;
          }
          if (/^\/blog\/[^/]+$/.test(path)) {
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
  lint: {
    plugins: ['typescript', 'react', 'import', 'jsx-a11y', 'unicorn', 'promise', 'node', 'oxc'],
    categories: {
      correctness: 'warn',
      suspicious: 'warn',
    },
    env: {
      browser: true,
      node: true,
    },
    ignorePatterns: ['dist/**', '.output/**', 'src/generated/**', 'src/routeTree.gen.ts'],
    settings: {
      react: {
        version: '19.2.4',
        linkComponents: [
          {
            attribute: 'to',
            name: 'Link',
          },
        ],
      },
      'jsx-a11y': {
        components: {
          Link: 'a',
        },
      },
    },
    rules: {
      eqeqeq: 'warn',
      'no-empty': 'off',
      'array-callback-return': 'off',
      'arrow-body-style': 'off',
      'prefer-regex-literals': 'off',
      'import/no-anonymous-default-export': 'off',
      'import/no-unassigned-import': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'react/no-array-index-key': 'off',
      'react/no-children-prop': 'off',
      'react/react-in-jsx-scope': 'off',
      'typescript/no-empty-object-type': 'warn',
      'typescript/no-use-before-define': 'off',
    },
    overrides: [
      {
        files: ['src/components/tiptap/**/*.tsx'],
        rules: {
          'jsx-a11y/click-events-have-key-events': 'off',
          'jsx-a11y/no-autofocus': 'off',
          'jsx-a11y/no-static-element-interactions': 'off',
          'jsx-a11y/prefer-tag-over-role': 'off',
        },
      },
      {
        files: ['src/components/features/banner-upload.tsx'],
        rules: {
          'jsx-a11y/prefer-tag-over-role': 'off',
        },
      },
    ],
  },
  fmt: {
    printWidth: 100,
    tabWidth: 2,
    singleQuote: true,
    jsxSingleQuote: true,
    semi: true,
    trailingComma: 'all',
    quoteProps: 'as-needed',
    sortImports: {
      internalPattern: ['~/'],
      sortSideEffects: false,
    },
    sortTailwindcss: {
      functions: ['cn', 'cva', 'clsx'],
      stylesheet: './src/styles/globals.css',
    },
    ignorePatterns: ['dist/**', '.output/**', 'src/generated/**', 'src/routeTree.gen.ts'],
  },
});
