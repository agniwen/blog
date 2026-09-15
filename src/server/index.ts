import { spotifyRouter } from './routes/spotify';

import { Hono } from 'hono';

import { getAuth } from '~/lib/auth';

import type { Env } from './env';
import { betterAuthMiddleware } from './middleware/better-auth';
import { drizzleMiddleware } from './middleware/drizzle';
import { bookmarkRouter } from './routes/bookmark';
import { postsRouter } from './routes/posts/route';
import { s3Router } from './routes/s3';

export const app = new Hono<Env>()
  .on(['POST', 'GET'], '/api/auth/*', (c) => {
    return getAuth().handler(c.req.raw);
  })
  .route('/api/spotify', spotifyRouter)
  .use(drizzleMiddleware, betterAuthMiddleware)
  .basePath('/api')
  .route('/s3', s3Router)
  .route('/posts', postsRouter)
  .route('/bookmark', bookmarkRouter);
