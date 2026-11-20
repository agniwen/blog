# Cloudflare Workers 与 D1

当前应用使用 TanStack Start + TanStack Router + Hono + `@cloudflare/vite-plugin`，部署到 Cloudflare Workers。`wrangler.jsonc` 是 Worker、D1 与域名配置的唯一入口；`src/worker.ts` 负责 canonical redirect 与每请求的 Drizzle 上下文。工具版本由 `mise.toml` 管理：Node 24.21.0、Bun 1.4.2。

## 开发与验证

```sh
mise install
mise exec -- bun install --frozen-lockfile
cp .env.example .env # 已有文件时跳过
bun x wrangler login # 首次或会话过期时登录 Cloudflare 账户
bun run dev
```

本项目不使用本地 D1：`vite.config.ts` 固定启用 `remoteBindings: true`，`wrangler.jsonc` 显式配置生产 D1 `blog`（ID `7381a7aa-92cc-411d-aabe-35c74abebea6`，`"remote": true`）。开发服务与生产预览都会通过 Cloudflare 原生远程绑定直接访问线上 `blog` 数据库；文章、草稿、用户及会话均来自线上库。本地保存、删除、评论及登录会话操作会写入线上真实数据。开发与预览不部署 Worker，也不应用迁移。[远程绑定](https://developers.cloudflare.com/workers/local-development/#remote-bindings)

远程连接模式下只做已授权的线上操作，不运行数据填充、清理或认证写入测试脚本。

如果远程会话启动成功但页面查询超时，可先通过 `wrangler d1 execute blog --remote --command 'SELECT 1 AS connected'` 区分 D1 账户权限与远程绑定链路问题。本机 Surge 的 HTTP 系统代理能访问 D1 API，但 `workerd` 仍可能直接连接远程预览地址；这时需检查 Surge 增强模式等流量接管设置。增强模式会改变整机网络路由，需使用者确认后开启。[Surge 增强模式](https://manual.nssurge.com/features/enhanced-mode.html)

`src/worker.ts` 负责 canonical redirect 和每次请求的数据库上下文（`AsyncLocalStorage`）；`src/routes/_studio.tsx` 与 `src/server/functions.ts` 保护后台和私有读取，Hono `authMiddleware` 执行同源 CSRF 校验与管理员角色鉴权，并设置 `Cache-Control: private, no-store`。`getAuth()` 保留 Better Auth 官方 Relations v2 adapter（工厂位于 `src/lib/auth-options.ts`）。`scripts/auth.config.ts` 是独立 Node CLI schema 入口，仅在生成 schema 时使用 `remoteBindings: false` 隔离模拟绑定。

```sh
bun run lint
bun run typecheck
bun test
bun run build
bun run start
TEST_BASE_URL=http://localhost:3000 bun run test:http
```

本机存在 HTTP 代理时，为测试命令加 `NO_PROXY=localhost,127.0.0.1`，确保请求直接访问本地服务。

已有 `.env` 也需包含 `BETTER_AUTH_URL=http://localhost:3000`；只有旧的 `NEXT_PUBLIC_BETTER_AUTH_URL` 不会配置服务端的认证来源。也可用 `BETTER_AUTH_URL=http://localhost:3000 bun run dev --strictPort` 临时启动本地登录验证。来源不一致时 Better Auth 会返回 `403 Invalid origin`，不应放宽来源校验。

生产预览同样连接远程 `blog` D1。`bun run start --port 3102 --strictPort` 可单独验证构建产物。生产构建仍使用 `.env.cloudflare` 与 `wrangler.jsonc` 中的 `https://akumanoko.com` 认证配置和 Secure Cookie 前缀，不能把本地 HTTP 预览当作 OAuth 成功验证；本地浏览器登录使用 origin 匹配的开发服务。Google OAuth 回调和 R2 CORS 需单独核对。

## 变量与 Secrets

变量清单为根目录 `.env.example`，服务端 schema 为 `src/lib/env.ts`。生产 Secrets 通过项目 `bun run cf:secrets` 上传允许清单内的八项敏感变量（Never send `.env` 全部内容）；该操作会更改线上 Secrets，应明确获准后执行。`BETTER_AUTH_URL` 是公开 Worker variable，配置在 `wrangler.jsonc`；其余八项 server 值为 Secrets。

既有 `NEXT_PUBLIC_*` 公开值继续支持，由 `src/lib/client-env.ts` 和 `.env.cloudflare`（`--mode cloudflare`）处理，防止 `.env` 的 localhost 进入生产。浏览器认证始终使用当前页面 origin。

## 迁移兼容性

Drizzle ORM / Kit 配对固定 `1.0.0-rc.4`；Better Auth 的 `@better-auth/drizzle-adapter/relations-v2` 显式传 schema，Drizzle 连接传 relations。

既有 SQLite 文件继续保存在 `drizzle/d1/<timestamp>/migration.sql`，快照和 SQL 内容未重写。`wrangler.jsonc` 的 `d1_databases` 显式配置此 `migrations_dir` / `migrations_pattern`，保留 Wrangler 的 `d1_migrations` 历史。历史 PostgreSQL 文件仍在 `drizzle/migrations`，不应用到 D1。

```sh
bun run db:generate # 使用项目锁定的 Kit
bun run db:migrate  # 远程已有 blog：先确认目标和待应用列表
```

## 发布

```sh
bun run deploy # bun run build:cloudflare && bun x wrangler deploy
```

部署命令使用项目锁定的 Wrangler 和现有 OAuth 登录，上传 `@cloudflare/vite-plugin` 构建出的 Worker 与静态资源，复用显式配置的现有 D1、域名和 Secrets，不自动应用数据库迁移。发布前运行 `wrangler whoami` 和远程 migration list 检查账户与待应用列表。

### Cloudflare Workers Builds

Cloudflare 控制台的构建触发器基于根目录 `wrangler.jsonc` 与 `@cloudflare/vite-plugin` 生成的 `.wrangler/deploy/config.json`：

| 设置                     | 值                                               |
| ------------------------ | ------------------------------------------------ |
| 根目录                   | `/`                                              |
| 构建命令                 | `bun install --frozen-lockfile && bun run build` |
| 生产分支 `main` 部署命令 | `bun x wrangler deploy`                          |
| 非生产分支版本上传命令   | `bun x wrangler versions upload`                 |
| 构建变量                 | `BUN_VERSION=1.4.2`、`NODE_VERSION=24.21.0`      |

可先运行 `bun x wrangler deploy --dry-run` 验证产物。参见 [Workers Builds 构建设置](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)。

不要把 `.tanstack/`、`dist/`、`.wrangler/`、`.env` 或 `.dev.vars*` 提交。直接部署继续绑定 `akumanoko.com` 和 `www.akumanoko.com`；aliases 通过 `src/worker.ts` 308 到主域名并保留路径/查询，localhost 和预览域名不跳转。

## 历史记录（PostgreSQL 迁入）

## PostgreSQL 迁入记录

数据迁移已完成，一次性导入脚本及专用 `pg` 依赖已删除。后续 schema 变更使用上面的 Drizzle / D1 迁移命令。

已有 D1 的表结构与生成基线 `20260914150827_hard_doorman/migration.sql` 等价，因此核验后登记到 `d1_migrations`，保留原迁移记录，不重复 CREATE TABLE。新建空库则正常执行迁移。原 PostgreSQL 与 Hyperdrive 资源保留，Worker 不再绑定它们。

参考：[D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/)、[D1 import/export](https://developers.cloudflare.com/d1/best-practices/import-export-data/)、[Drizzle D1](https://orm.drizzle.team/docs/sqlite/connect-cloudflare-d1)。

## 2026-09-14 切换记录

已将 PostgreSQL 的 5 篇文章（4 篇发布、1 篇草稿）、2 个用户、3 个账户、47 条会话迁入已有 `blog` D1，其余四张业务表为空。八张表全部字段经过 SHA-256 比较一致，外键检查通过。原 PostgreSQL 未执行写入。一次性导入工具现已移除。

类型检查、lint（既有组件 warnings）、Workers 构建、远程迁移状态检查、本地空库应用生成迁移通过。开发和构建预览各 20 项 HTTP 检查通过。临时账户验证了 Better Auth 注册、登录、会话读取及退出，以及草稿创建、更新、编辑页 SSR、删除和日期/JSON/布尔转换；临时用户及关联数据已清理，清理后八张表再次与源库一致。

线上 D1 版本为 `30ccc8da-236d-4843-8909-941636f45e05`，绑定 `DB (blog)`。上传约 6506 KiB（gzip 1446 KiB），Cloudflare 启动耗时 25 ms。Google OAuth 与 R2 上传流程保持原实现，本次未重测。

发布后线上 20 项 HTTP 检查通过；再次用临时账户确认线上登录、会话读取、草稿创建/修改/删除和编辑页 SSR 正常。退出请求遭遇一次网络中断，随后通过 D1 删除该测试用户并确认测试账户为零，级联清理关联账户和会话。

生产构建统一使用 `cloudflare` mode，包括默认 `bun run build`，使 Git 自动构建不依赖本机 `.env`。`.env.cloudflare` 记录公开认证地址和头像地址；认证与 R2 密钥仍由 Worker Secrets 提供。若需在 localhost 验证构建后的登录流程，使用 `bun x vite build --mode development` 后再预览。

## 自定义域名

`wrangler.jsonc` 声明 `akumanoko.com` 和 `www.akumanoko.com` 两个 Custom Domains，均绑定 `blog`。生产认证地址与 `.env.cloudflare` 的公开地址统一为 `https://akumanoko.com`，sitemap 同步使用该域名。`www` 和 `blog.wenhouman.workers.dev` 在 Worker 入口返回 308 并保留路径、查询参数，统一到主域名；localhost 与预览域名不跳转。域名跳转测试：`bun run test:domains`。

Google OAuth 客户端需允许回调 `https://akumanoko.com/api/auth/callback/google`，如配置 JavaScript 来源则加入 `https://akumanoko.com`；Google 控制台设置不在仓库内，不能仅凭构建成功确认。R2 `blog` 的 CORS 已加入该来源，并保留 localhost 与原 workers.dev 来源。旧域名 Cookie 不共享，切换后需要在主域名重新登录。

认证客户端在浏览器中使用当前页面 origin，避免构建环境遗留的 `workers.dev` 地址把登录请求发往另一个域名。认证 API 与页面同源，不配置通配符 CORS；Better Auth 继续执行来源与 CSRF 校验。可运行 `bun run test:auth` 验证旧构建地址不会影响实际请求。
