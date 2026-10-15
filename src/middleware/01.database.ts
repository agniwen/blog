import { defineMiddleware } from 'void';

import { canonicalRedirect } from '~/lib/canonical-redirect';
import { createDatabase, requestDatabase } from '~/lib/db';

export default defineMiddleware(async (c, next) => {
  const redirect = canonicalRedirect(c.req.url, String(c.env.BETTER_AUTH_URL ?? ''));
  if (redirect)
    return new Response(null, {
      status: 308,
      headers: { Location: redirect, 'Cache-Control': 'private, no-store' },
    });
  return requestDatabase.run(createDatabase(c.env.DB), async () => {
    await next();
    // Void's error renderer returns a new Response; apply private headers afterwards too.
    const privatePath =
      /^\/studio(?:\/|$)|^\/api\/(?:auth(?:\/|$)|posts\/?$|s3(?:\/|$)|bookmark(?:\/|$))/.test(
        c.req.path,
      );
    if (privatePath || !['GET', 'HEAD'].includes(c.req.method)) {
      c.header('Cache-Control', 'private, no-store');
    }
  });
});
