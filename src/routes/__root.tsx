import { createRootRoute, HeadContent, Link, Outlet, Scripts } from '@tanstack/react-router';
import type { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';

import { QueryClientProvider } from '~/components/provider/query-client-provider';
import { Background } from '~/components/ui/background';
import { Button } from '~/components/ui/button';

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
  notFoundComponent: RootNotFound,
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
    <QueryClientProvider>
      <Outlet />
      <Background />
      <Toaster position='top-center' />
    </QueryClientProvider>
  );
}

function RootNotFound() {
  return (
    <div className='mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6'>
      <div className='flex max-w-md flex-col items-center gap-4 text-center'>
        <p className='text-4xl font-bold tracking-[0.4em] text-muted-foreground uppercase'>404</p>
        <h1 className='text-3xl font-semibold text-foreground'>Page not found</h1>
        <p className='text-sm text-muted-foreground'>
          The page you requested does not exist or has moved.
        </p>
        <Link to='/' preload='intent'>
          <Button variant='secondary' className='rounded-full px-6'>
            Back home
          </Button>
        </Link>
      </div>
    </div>
  );
}
