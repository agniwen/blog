# Cloudflare Workers 与 D1

当前应用通过官方 Cloudflare Vite 插件运行，开发、构建和生产均使用 Workers。数据库是已有 D1 `blog`，ID `7381a7aa-92cc-411d-aabe-35c74abebea6`，以 `wrangler.jsonc` 的 `DB` 绑定为准。公开地址为 https://blog.wenhouman.workers.dev。

## 开发与发布

1. `pnpm exec wrangler login`，用 `pnpm exec wrangler whoami` 确认目标账号。
2. 在 `.env` 设置 Better Auth、Google OAuth、R2 变量，运行 `pnpm dev`。当前 `remote: true` 表示本地开发和预览直接读写远程 D1。需要隔离测试时改用单独的数据库绑定，或设置 `remote: false` 并执行 `pnpm db:migrate:local`。
3. 生产 Secrets 继续使用 `pnpm cf:secrets` 配置八个认证和 R2 变量，不上传整个 `.env`。D1 无需数据库 URL 或密码。
4. 保持 `.env.cloudflare` 的公开认证地址、Wrangler 的 `BETTER_AUTH_URL`、Google OAuth 回调和 R2 CORS 一致。
5. 执行 `pnpm cf:typegen`、`pnpm lint`、`pnpm typecheck`、`pnpm build`。`pnpm start` 预览当前构建；`pnpm deploy` 重新使用 cloudflare mode 构建后发布。
6. 执行 `TEST_BASE_URL=https://blog.wenhouman.workers.dev pnpm test`。未授权请求检查不能替代成功登录、写入或上传验证。

静态文件走 Workers Static Assets；图片继续使用 R2，MiSans 使用 CDN。`pnpm exec wrangler deploy --dry-run` 可检查上传大小。保持 `dist`、`.dev.vars*`、`.env` 在忽略列表内。

## 数据访问与迁移

`src/worker.ts` 每次请求通过 `env.DB` 创建 Drizzle D1 实例，由 AsyncLocalStorage 传递给 server functions 和 Hono。`getAuth()` 使用相同实例与 SQLite adapter。无 PostgreSQL 回退路径或连接池。认证 schema CLI 的 `scripts/auth.config.ts` 使用本地模拟绑定，仅用于模型生成。

日期存储为 UTC Unix 毫秒，Drizzle 映射为 Date；布尔值使用 integer，编辑器 JSON 使用 JSON text。Relations v2 与 Better Auth 官方适配器保持不变。

```sh
pnpm db:generate
pnpm db:migrate:local # 仅本地
pnpm db:migrate       # 远程 blog D1
```

生成文件在 `drizzle/d1/<timestamp_name>/migration.sql`；Wrangler 通过 `migrations_pattern` 识别嵌套布局。不要手工修改生成的 migration/snapshot。`drizzle/migrations` 中的 PostgreSQL 历史不再应用到 D1。

## PostgreSQL 一次性迁入

`scripts/migrate-postgres-to-d1.mjs` 读取 `.env` 的 `DATABASE_URL`，使用 PostgreSQL 只读一致性快照。无参数仅检查；`--apply` 才导入。该脚本是切换时的维护工具，D1 开始接受新写入后禁止重新执行导入，以免旧源覆盖新数据。

```sh
node --env-file=.env scripts/migrate-postgres-to-d1.mjs
node --env-file=.env scripts/migrate-postgres-to-d1.mjs --apply
```

脚本核对目标 ID、表结构、唯一索引及主键集合，遇到 D1 独有记录即停止；使用 upsert 保留 ID，禁止 REPLACE 或清空表。时间戳按 UTC 转换，导入后比较八张表全部字段的 SHA-256 并检查外键。包含凭据的临时 SQL 使用私有目录和 0600 文件，结束后删除，不进入仓库或日志。

已有 D1 的表结构与生成基线 `20260914150827_hard_doorman/migration.sql` 等价，因此核验后登记到 `d1_migrations`，保留原迁移记录，不重复 CREATE TABLE。新建空库则正常执行迁移。原 PostgreSQL 与 Hyperdrive 资源保留，Worker 不再绑定它们。

参考：[D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/)、[D1 import/export](https://developers.cloudflare.com/d1/best-practices/import-export-data/)、[Drizzle D1](https://orm.drizzle.team/docs/sqlite/connect-cloudflare-d1)。

## 2026-09-14 切换记录

已将 PostgreSQL 的 5 篇文章（4 篇发布、1 篇草稿）、2 个用户、3 个账户、47 条会话迁入已有 `blog` D1，其余四张业务表为空。八张表全部字段经过 SHA-256 比较一致，外键检查通过。原 PostgreSQL 未执行写入。导入脚本检测到已登记基线时拒绝再次导入，防止旧源覆盖后续 D1 数据。

类型检查、lint（既有组件 warnings）、Workers 构建、远程迁移状态检查、本地空库应用生成迁移通过。开发和构建预览各 20 项 HTTP 检查通过。临时账户验证了 Better Auth 注册、登录、会话读取及退出，以及草稿创建、更新、编辑页 SSR、删除和日期/JSON/布尔转换；临时用户及关联数据已清理，清理后八张表再次与源库一致。

线上 D1 版本为 `30ccc8da-236d-4843-8909-941636f45e05`，绑定 `DB (blog)`。上传约 6506 KiB（gzip 1446 KiB），Cloudflare 启动耗时 25 ms。Google OAuth 与 R2 上传流程保持原实现，本次未重测。

发布后线上 20 项 HTTP 检查通过；再次用临时账户确认线上登录、会话读取、草稿创建/修改/删除和编辑页 SSR 正常。退出请求遭遇一次网络中断，随后通过 D1 删除该测试用户并确认测试账户为零，级联清理关联账户和会话。

生产构建统一使用 `cloudflare` mode，包括默认 `pnpm build`，使 Git 自动构建不依赖本机 `.env`。`.env.cloudflare` 记录公开认证地址和头像地址；认证与 R2 密钥仍由 Worker Secrets 提供。若需在 localhost 验证构建后的登录流程，使用 `pnpm exec vite build --mode development` 后再预览。
