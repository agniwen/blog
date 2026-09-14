import { drizzle } from 'drizzle-orm/node-postgres';

import { relations } from '~/db/relations';

let drizzleClient: ReturnType<typeof drizzle<typeof relations>> | null = null;

export function db() {
  if (!drizzleClient) {
    drizzleClient = drizzle(process.env.DATABASE_URL!, {
      relations,
    });
  }
  return drizzleClient;
}

export type Database = ReturnType<typeof db>;
