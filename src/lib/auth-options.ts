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

/**
 * 与运行环境解耦的 Better Auth 配置工厂（同时复用于 Worker 运行时与离线 schema 生成脚本）。
 *
 * 显式传入 Drizzle `schema` 与复数表名，与 `relations-v2` 适配器及现有 D1 表结构保持一致。
 */
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
