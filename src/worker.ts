import handler from '@tanstack/react-start/server-entry';

import { createDatabase, requestDatabase } from './lib/db';

export default {
  async fetch(request, env) {
    return requestDatabase.run(createDatabase(env.DB), () => handler.fetch(request));
  },
} satisfies ExportedHandler<Cloudflare.Env>;
