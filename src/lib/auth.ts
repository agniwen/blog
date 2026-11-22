import { createAuth } from './auth-options';
import { db, type Database } from './db';
import { env } from './env';

/** 基于当前请求的数据库实例构建 Better Auth 服务端实例（默认读取请求级 D1）。 */
export function getAuth(database: Database = db()) {
  return createAuth(database, {
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    googleClientId: env.GOOGLE_CLIENT_ID,
    googleClientSecret: env.GOOGLE_CLIENT_SECRET,
  });
}
