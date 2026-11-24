import { Hono } from 'hono';

import { getAuth } from '~/lib/auth';
import { success } from '~/lib/result';

import type { Env } from './env';
import { betterAuthMiddleware } from './middleware/better-auth';
import { drizzleMiddleware } from './middleware/drizzle';
import { aiRouter } from './routes/ai';
import { bookmarkRouter } from './routes/bookmark';
import { commentsRouter } from './routes/comments';
import { dashboardRouter } from './routes/dashboard';
import { postsRouter } from './routes/posts/route';
import { s3Router } from './routes/s3';
import { spotifyRouter } from './routes/spotify';
import { tagsRouter } from './routes/tags';
import { usersRouter } from './routes/users';

/**
 * Hono API 主应用（由 `/api/*` 捕获路由转发）。
 *
 * 公开路由（`/api/auth/*` 鉴权端点与 `/api/spotify` 元数据代理）挂载在管理端中间件之前；
 * 所有鉴权响应强制禁用缓存，避免会话状态被 CDN 或浏览器缓存。
 */
export const app = new Hono<Env>()
  .on(['POST', 'GET'], '/api/auth/*', async (c) => {
    const response = await getAuth().handler(c.req.raw);
    const cloned = new Response(response.body, response);
    cloned.headers.set('Cache-Control', 'private, no-store');
    return cloned;
  })
  .route('/api/spotify', spotifyRouter)
  .use(drizzleMiddleware, betterAuthMiddleware)
  .basePath('/api')
  .get('/session', (c) => {
    c.header('Cache-Control', 'private, no-store');
    return c.json(
      success(
        c.var.user ? { user: { id: c.var.user.id, role: c.var.user.role ?? null } } : null,
      ),
    );
  })
  .route('/s3', s3Router)
  .route('/posts', postsRouter)
  .route('/tags', tagsRouter)
  .route('/comments', commentsRouter)
  .route('/users', usersRouter)
  .route('/dashboard', dashboardRouter)
  .route('/ai', aiRouter)
  .route('/bookmark', bookmarkRouter);
