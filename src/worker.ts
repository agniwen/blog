import handler from '@tanstack/react-start/server-entry';

import { canonicalRedirect } from './lib/canonical-redirect';
import { createDatabase, requestDatabase } from './lib/db';

/**
 * Cloudflare Worker HTTP 入口。
 *
 * 1. 先执行规范域名 308 重定向，保证 Better Auth Cookie 与 OAuth 回调始终落在同一主域名下；
 * 2. 为每个请求创建独立的 Drizzle D1 实例并通过 AsyncLocalStorage 向下游隔离传递，严禁跨请求共享。
 */
export default {
  async fetch(request, env) {
    const redirect = canonicalRedirect(request.url, env.BETTER_AUTH_URL);
    if (redirect)
      return new Response(null, {
        status: 308,
        headers: { Location: redirect, 'Cache-Control': 'private, no-store' },
      });
    return requestDatabase.run(createDatabase(env.DB), () => handler.fetch(request));
  },
} satisfies ExportedHandler<Cloudflare.Env>;
