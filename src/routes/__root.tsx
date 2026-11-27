import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router';

import NotFound from '~/components/features/not-found';
import { Background } from '~/components/ui/background';
import { Button } from '~/components/ui/button';
import { ToastProvider } from '~/components/ui/toast';
import {
  buildHomeOgUrl,
  getSiteOrigin,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from '~/lib/site-meta';

import '~/styles/app.css';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const origin = getSiteOrigin();
    const ogImage = buildHomeOgUrl(origin);
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { title: SITE_TITLE },
        { name: 'description', content: SITE_DESCRIPTION },
        { property: 'og:site_name', content: SITE_TITLE },
        { property: 'og:locale', content: 'zh_CN' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: SITE_TITLE },
        { property: 'og:description', content: SITE_DESCRIPTION },
        { property: 'og:url', content: `${origin}/` },
        { property: 'og:image', content: ogImage },
        { property: 'og:image:width', content: String(OG_IMAGE_WIDTH) },
        { property: 'og:image:height', content: String(OG_IMAGE_HEIGHT) },
        { property: 'og:image:type', content: 'image/png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: SITE_TITLE },
        { name: 'twitter:description', content: SITE_DESCRIPTION },
        { name: 'twitter:image', content: ogImage },
      ],
      links: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        {
          rel: 'alternate',
          type: 'application/rss+xml',
          title: `${SITE_TITLE} RSS`,
          href: '/rss.xml',
        },
        { rel: 'preconnect', href: 'https://cdn.jsdelivr.net', crossOrigin: 'anonymous' },
        ...['Regular', 'Medium'].map((weight) => ({
          rel: 'stylesheet',
          href: `https://cdn.jsdelivr.net/npm/misans@4.1.0/lib/Normal/MiSans-${weight}.min.css`,
          crossOrigin: 'anonymous' as const,
        })),
      ],
    };
  },
  notFoundComponent: NotFound,
  errorComponent: ({ reset }) => (
    <main className='p-8'>
      <h1>页面加载失败</h1>
      <Button onClick={reset}>重试</Button>
    </main>
  ),
  component: () => <Outlet />,
  shellComponent: ({ children }) => (
    <html suppressHydrationWarning lang='zh-CN'>
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
