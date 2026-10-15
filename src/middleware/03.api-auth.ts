import { defineMiddleware } from 'void';

import { requireAdmin } from '~/lib/auth-guards';

export default defineMiddleware(async (c, next) => {
  const path = c.req.path.replace(/\/$/, '');
  const publicDetail = ['GET', 'HEAD'].includes(c.req.method) && /^\/api\/posts\/[^/]+$/.test(path);
  const protectedRoute =
    /^\/api\/(?:posts(?:\/[^/]+)?|s3\/presigned-url|bookmark\/fetch-og-data)$/.test(path);
  if (protectedRoute && !publicDetail) {
    c.header('Cache-Control', 'private, no-store');
    const origin = c.req.header('Origin');
    if (
      !['GET', 'HEAD'].includes(c.req.method) &&
      ((origin && origin !== new URL(c.req.url).origin) ||
        c.req.header('Sec-Fetch-Site') === 'cross-site')
    ) {
      return c.json({ error: 'Forbidden' }, 403);
    }
    await requireAdmin(c.req.raw.headers);
  }
  await next();
});
