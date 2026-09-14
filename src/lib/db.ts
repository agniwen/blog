import { AsyncLocalStorage } from 'node:async_hooks';

import { drizzle } from 'drizzle-orm/d1';

import { relations } from '~/db/relations';

export function createDatabase(binding: D1Database) {
  return drizzle(binding, { relations });
}
export type Database = ReturnType<typeof createDatabase>;
export const requestDatabase = new AsyncLocalStorage<Database>();
export function db(): Database {
  const database = requestDatabase.getStore();
  if (!database)
    throw new Error('D1 database is only available inside a Worker request. Use bun run dev.');
  return database;
}
