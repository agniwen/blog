import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router';

import NotFound from '~/components/features/not-found';
import { Background } from '~/components/ui/background';
import { Button } from '~/components/ui/button';
import { ToastProvider } from '~/components/ui/toast';

import '~/styles/app.css';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'akumanoko' },
      { name: 'description', content: 'akumanoko' },
    ],
    links: [
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://cdn.jsdelivr.net', crossOrigin: 'anonymous' },
      ...['Regular', 'Medium'].map((weight) => ({
        rel: 'stylesheet',
        href: `https://cdn.jsdelivr.net/npm/misans@4.1.0/lib/Normal/MiSans-${weight}.min.css`,
        crossOrigin: 'anonymous' as const,
      })),
    ],
  }),
  notFoundComponent: NotFound,
  errorComponent: ({ reset }) => (
    <main className='p-8'>
      <h1>页面加载失败</h1>
      <Button onClick={reset}>重试</Button>
    </main>
  ),
  component: () => <Outlet />,
  shellComponent: ({ children }) => (
    <html suppressHydrationWarning lang='en'>
      <head>
        <HeadContent />
      </head>
      <body className='relative antialiased'>
        <ToastProvider position='top-center'>
          <div className='relative isolate min-h-svh'>{children}</div>
        </ToastProvider>
        <Background />
        <Scripts />
      </body>
    </html>
  ),
});
