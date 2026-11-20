import { factory } from '../factory';

export const authMiddleware = factory.createMiddleware(async (c, next) => {
  c.header('Cache-Control', 'private, no-store');

  if (!['GET', 'HEAD'].includes(c.req.method)) {
    const origin = c.req.header('Origin');
    if (
      (origin && origin !== new URL(c.req.url).origin) ||
      c.req.header('Sec-Fetch-Site') === 'cross-site'
    ) {
      return c.json({ message: 'Forbidden' }, 403);
    }
  }

  if (c.var.user?.role !== 'admin') {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  return next();
});
