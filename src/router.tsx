import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';

import { PENDING_DELAY_MS, PENDING_MIN_MS } from './lib/pending-indicator';
import { routeTree } from './routeTree.gen';

/**
 * 为每次请求 / 客户端初始化创建独立的 Router 与 QueryClient 实例。
 *
 * 使用 SSR Query 集成以避免跨请求共享缓存；`.blog-surface` 启用了自定义滚动容器，
 * 需要通过 `scrollToTopSelectors` 显式重置文章页滚动位置。
 */
export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
  });
  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    scrollToTopSelectors: ['.blog-surface [data-slot="scroll-area-viewport"]'],
    defaultViewTransition: true,
    defaultPendingMs: PENDING_DELAY_MS,
    defaultPendingMinMs: PENDING_MIN_MS,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  });
  setupRouterSsrQueryIntegration({ router, queryClient });
  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
