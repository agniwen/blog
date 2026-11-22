import { AsyncLocalStorage } from 'node:async_hooks';

import { drizzle } from 'drizzle-orm/d1';

import { relations } from '~/db/relations';

/** 基于当前请求的 D1 绑定创建隔离的 Drizzle 实例（挂载 Relations v2 定义）。 */
export function createDatabase(binding: D1Database) {
  return drizzle(binding, { relations });
}
export type Database = ReturnType<typeof createDatabase>;
// Worker 入口与 Server Function 在 Vite HMR 下可能独立重载；
// 通过 globalThis + Symbol.for 共享 AsyncLocalStorage 容器本身（而非数据库实例）以保证上下文连通。
const contextKey = Symbol.for('blog.requestDatabase');
const runtime = globalThis as typeof globalThis & {
  [contextKey]?: AsyncLocalStorage<Database>;
};
export const requestDatabase = (runtime[contextKey] ??= new AsyncLocalStorage<Database>());
/** 获取当前请求作用域内的 Drizzle D1 数据库实例，必须在 Worker 请求上下文中调用。 */
export function db(): Database {
  const database = requestDatabase.getStore();
  if (!database)
    throw new Error('D1 database is only available inside a Worker request. Use bun run dev.');
  return database;
}
