import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { relations } from '~/db/relations';
import * as schema from '~/db/schema';
import { getServerEnv } from '~/lib/env';

let drizzleClient: ReturnType<typeof drizzle<typeof schema, typeof relations>> | null = null;
let clientUrl: string | null = null;

export function db() {
  const { DATABASE_URL } = getServerEnv();

  if (!drizzleClient || clientUrl !== DATABASE_URL) {
    const queryClient = postgres(DATABASE_URL, {
      max: 1,
      prepare: false,
    });

    drizzleClient = drizzle({
      client: queryClient,
      schema,
      relations,
    });
    clientUrl = DATABASE_URL;
  }

  return drizzleClient;
}

export type Database = ReturnType<typeof db>;
