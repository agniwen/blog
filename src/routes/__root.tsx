import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import type { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';

import { QueryClientProvider } from '~/components/provider/query-client-provider';
import { ThemeProvider } from '~/components/provider/theme-provider';

import appCss from '~/styles/globals.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'akumanoko' },
      { name: 'description', content: 'akumanoko' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
  component: RootOutlet,
});

function RootDocument({ children }: PropsWithChildren) {
  return (
    <html suppressHydrationWarning lang='en'>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootOutlet() {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
      <QueryClientProvider>
        <Outlet />
      </QueryClientProvider>
      <Toaster position='top-center' />
    </ThemeProvider>
  );
}
