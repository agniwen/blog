import { drizzleAdapter } from '@better-auth/drizzle-adapter/relations-v2';
import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';

import * as schema from '~/db/schema';

import type { Database } from './db';

interface AuthConfig {
  secret: string;
  baseURL?: string;
  googleClientId: string;
  googleClientSecret: string;
}

export function createAuth(database: Database, config: AuthConfig) {
  return betterAuth({
    secret: config.secret,
    baseURL: config.baseURL,
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
        clientId: config.googleClientId,
        clientSecret: config.googleClientSecret,
      },
    },
  });
}
