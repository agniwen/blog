import { devD1Binding } from './lib/dev-remote';
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
    const localUrl = (env as Cloudflare.Env & { DEV_REMOTE_URL?: string }).DEV_REMOTE_URL;
    const binding = import.meta.env.DEV && localUrl ? devD1Binding(localUrl) : env.DB;
    return requestDatabase.run(createDatabase(binding), () => handler.fetch(request));
  },
} satisfies ExportedHandler<Cloudflare.Env>;
