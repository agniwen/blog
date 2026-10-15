import { defineMiddleware } from 'void';

import { getAuth } from '~/lib/auth';

export default defineMiddleware(async (c, next) => {
  const path = c.req.path.replace(/\/$/, '');
  if (!/^\/studio(?:\/login|\/posts(?:\/upsert(?:\/[^/]+)?)?)?$/.test(path)) return next();
  c.header('Cache-Control', 'private, no-store');
  const session = await getAuth().api.getSession({ headers: c.req.raw.headers });
  if (path === '/studio/login') {
    if (session?.user.role === 'admin') return c.redirect('/studio', 307);
    return next();
  }
  if (session?.user.role !== 'admin') {
    if (!['GET', 'HEAD'].includes(c.req.method)) return c.json({ error: 'Unauthorized' }, 401);
    return c.redirect('/', 307);
  }
  return next();
});
