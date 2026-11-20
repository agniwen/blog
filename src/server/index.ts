import { Hono } from 'hono';

import { getAuth } from '~/lib/auth';

import type { Env } from './env';
import { betterAuthMiddleware } from './middleware/better-auth';
import { drizzleMiddleware } from './middleware/drizzle';
import { bookmarkRouter } from './routes/bookmark';
import { postsRouter } from './routes/posts/route';
import { s3Router } from './routes/s3';
import { spotifyRouter } from './routes/spotify';

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
  .route('/s3', s3Router)
  .route('/posts', postsRouter)
  .route('/bookmark', bookmarkRouter);
