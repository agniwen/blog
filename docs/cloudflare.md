# Cloudflare Workers 与 D1

当前应用通过官方 Cloudflare Vite 插件运行，开发、构建和生产均使用 Workers。数据库是已有 D1 `blog`，ID `7381a7aa-92cc-411d-aabe-35c74abebea6`，以 `wrangler.jsonc` 的 `DB` 绑定为准。主域名为 https://akumanoko.com。

## 开发与发布

1. `bun x wrangler login`，用 `bun x wrangler whoami` 确认目标账号。
2. 在 `.env` 设置 Better Auth、Google OAuth、R2 变量，运行 `bun run dev`。当前 `remote: true` 表示本地开发和预览直接读写远程 D1。需要隔离测试时改用单独的数据库绑定，或设置 `remote: false` 并执行 `bun run db:migrate:local`。
3. 生产 Secrets 继续使用 `bun run cf:secrets` 配置八个认证和 R2 变量，不上传整个 `.env`。D1 无需数据库 URL 或密码。
4. 保持 `.env.cloudflare` 的公开认证地址、Wrangler 的 `BETTER_AUTH_URL`、Google OAuth 回调和 R2 CORS 一致。
5. 执行 `bun run cf:typegen`、`bun run lint`、`bun run typecheck`、`bun run build`。`bun run start` 预览当前构建；`bun run deploy` 重新使用 cloudflare mode 构建后发布。
6. 执行 `TEST_BASE_URL=https://akumanoko.com bun run test:http`。未授权请求检查不能替代成功登录、写入或上传验证。

静态文件走 Workers Static Assets；图片继续使用 R2，MiSans 使用 CDN。`bun x wrangler deploy --dry-run` 可检查上传大小。保持 `dist`、`.dev.vars*`、`.env` 在忽略列表内。

## 数据访问与迁移

`src/worker.ts` 每次请求通过 `env.DB` 创建 Drizzle D1 实例，由 AsyncLocalStorage 传递给 server functions 和 Hono。`getAuth()` 使用相同实例与 SQLite adapter。无 PostgreSQL 回退路径或连接池。认证 schema CLI 的 `scripts/auth.config.ts` 使用本地模拟绑定，仅用于模型生成。

日期存储为 UTC Unix 毫秒，Drizzle 映射为 Date；布尔值使用 integer，编辑器 JSON 使用 JSON text。Relations v2 与 Better Auth 官方适配器保持不变。

```sh
bun run db:generate
bun run db:migrate:local # 仅本地
bun run db:migrate       # 远程 blog D1
```

生成文件在 `drizzle/d1/<timestamp_name>/migration.sql`；Wrangler 通过 `migrations_pattern` 识别嵌套布局。不要手工修改生成的 migration/snapshot。`drizzle/migrations` 中的 PostgreSQL 历史不再应用到 D1。

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

## Bun 构建

全项目使用 Bun 1.4.2 与 `bun.lock`。Cloudflare 生产和预览构建均设置 `BUN_VERSION=1.4.2`，构建命令为 `bun install --frozen-lockfile && bun run build`；main 部署命令为 `bun x wrangler deploy`，其他分支使用 `bun x wrangler versions upload`。分支规则保持不变。包管理器切换与登录修复需一起提交后推送，下一次构建才能使用新的锁文件。

`bunfig.toml` 禁止 Bun 预加载 `.env`，避免覆盖 Vite 选定的生产环境。测试使用 `bun:test` 和 Bun 原生假时钟；Node 继续用于 Wrangler/Vite 的 shebang，线上仍运行在 workerd。

Bun 切换验证：冻结安装、lint（既有 warnings）、类型检查、7 项回归测试、Workers 构建和部署 dry-run 通过。Bun 启动开发服务和首页正常；远程 D1 读取出现与切换前一致的连接等待，因此未将完整开发 HTTP 冒烟记为通过。
