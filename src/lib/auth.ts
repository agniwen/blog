import { drizzleAdapter } from '@better-auth/drizzle-adapter/relations-v2';
import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';

import * as schema from '~/db/schema';

import { db, type Database } from './db';
import { env } from './env';

export function getAuth(database: Database = db()) {
  return betterAuth({
    database: drizzleAdapter(database, { provider: 'sqlite', schema }),
    plugins: [admin()],
    emailAndPassword: {
      enabled: true,
    },
    session: {
      modelName: 'sessions',
    },
    account: {
      modelName: 'accounts',
    },
    verification: {
      modelName: 'verifications',
    },
    user: {
      modelName: 'users',
    },
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
  });
}
