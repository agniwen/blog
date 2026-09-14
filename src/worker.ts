import handler from '@tanstack/react-start/server-entry';

import { canonicalRedirect } from './lib/canonical-redirect';
import { createDatabase, requestDatabase } from './lib/db';

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
