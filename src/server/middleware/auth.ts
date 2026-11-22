import { factory } from '../factory';

/**
 * 管理端接口鉴权与 CSRF 防护中间件。
 *
 * 刻意在请求体校验之前执行：先标记 `Cache-Control: private, no-store`，
 * 再校验非幂等请求的同源 Origin / Sec-Fetch-Site，最后确认当前用户具备 `admin` 角色。
 */
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
