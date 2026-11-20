import { createAuth } from './auth-options';
import { db, type Database } from './db';
import { env } from './env';

export function getAuth(database: Database = db()) {
  return createAuth(database, {
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    googleClientId: env.GOOGLE_CLIENT_ID,
    googleClientSecret: env.GOOGLE_CLIENT_SECRET,
  });
}
