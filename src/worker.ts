import handler from '@tanstack/react-start/server-entry';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { relations } from './db/relations';
import { requestDatabase } from './lib/db';

export default {
  async fetch(request, env, ctx) {
    const pool = new Pool({ connectionString: env.HYPERDRIVE.connectionString, max: 5 });
    const database = drizzle({ client: pool, relations });
    return requestDatabase.run(database, async () => {
      try {
        return await handler.fetch(request);
      } finally {
        ctx.waitUntil(pool.end());
      }
    });
  },
} satisfies ExportedHandler<Cloudflare.Env>;
