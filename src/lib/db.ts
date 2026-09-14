import { AsyncLocalStorage } from 'node:async_hooks';

import { drizzle } from 'drizzle-orm/node-postgres';

import { relations } from '~/db/relations';

type DrizzleDatabase = ReturnType<typeof drizzle<typeof relations>>;
export const requestDatabase = new AsyncLocalStorage<DrizzleDatabase>();
let nodeDatabase: DrizzleDatabase | undefined;

export function db(): DrizzleDatabase {
  const scoped = requestDatabase.getStore();
  if (scoped) return scoped;
  if (!process.env.DATABASE_URL)
    throw new Error('DATABASE_URL is required outside the Worker request context');
  nodeDatabase ??= drizzle(process.env.DATABASE_URL, { relations });
  return nodeDatabase;
}

export type Database = ReturnType<typeof db>;
