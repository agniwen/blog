# Cloudflare Workers 部署

Cloudflare 使用官方 Vite 插件；默认 `pnpm dev` / `pnpm build` 仍使用 Node/Nitro，`NITRO_PRESET=vercel` 仍可构建 Vercel 产物。选择 `cloudflare` mode 时只启用 Cloudflare 适配器，避免两个适配器处理同一 SSR 构建。

## 首次发布

目标账号、Worker 名称、兼容日期和绑定以 `wrangler.jsonc` 为准。当前目标是已有 `blog` Worker，默认地址为 `https://blog.wenhouman.workers.dev`，尚未配置自定义域名。

1. 执行 `pnpm exec wrangler login`，然后用 `pnpm exec wrangler whoami` 确认账号。
2. 创建指向现有 Neon 数据库的 Hyperdrive 配置；使用同一数据库的直接连接地址，关闭 Neon connection pooling。关闭 Hyperdrive 查询缓存，避免会话和管理端读取旧数据。将返回的 ID 写入 `wrangler.jsonc` 的 `HYPERDRIVE`。当前已绑定 `blog-db`（`13b2029329504bf1bc4dc948a6aaf1ab`）；迁移到其他账号时重新创建绑定，`pnpm deploy` 会拒绝空 ID 或全零占位 ID。

   ```sh
   pnpm exec wrangler hyperdrive create blog-db \
     --connection-string '<Neon direct connection URL>' \
     --caching-disabled --origin-connection-limit 5
   ```

   实际凭据从本机环境读取后通过进程参数传递，不要将真实连接字符串写入仓库、聊天或共享日志。创建 Hyperdrive 会验证连接，不需要执行数据库迁移。

3. 检查 `.env` 的服务端变量，执行 `pnpm cf:secrets`。脚本只将认证、Google OAuth 和 R2 所需的八个变量通过 stdin 发送给 Wrangler，不上传整个 `.env`。Worker 数据库凭据由 Hyperdrive 管理，`DATABASE_URL` 只用于 Node 开发和迁移工具。已存在的认证密钥应与现有服务保持一致。
4. 检查 `.env.cloudflare` 的公开认证地址和 `wrangler.jsonc` 的 `BETTER_AUTH_URL` 一致。Google OAuth 中添加对应的 `/api/auth/callback/google` 回调地址；R2 bucket 的 CORS 需要允许新页面 origin 的 PUT 上传。
5. 执行 `pnpm cf:typegen`、`pnpm typecheck`、`pnpm lint`，然后 `pnpm deploy`。每次发布都会重新构建 Cloudflare 产物；不要把 Node/Vercel 构建直接交给 Wrangler。
6. 执行 `TEST_BASE_URL=https://blog.wenhouman.workers.dev pnpm test`，再使用实际管理员验证登录、保存和上传。

若改用自定义域名，同步修改服务端认证 URL、`.env.cloudflare` 的公开 URL、OAuth 回调和 R2 CORS，再重建发布。不要把开发环境的 localhost 地址打包到线上。

## 数据库生命周期

`src/worker.ts` 在每次请求内创建 pg Pool 和 Drizzle 实例，通过 AsyncLocalStorage 传递到现有 server functions / Hono 中间件。请求结束后通过 `ctx.waitUntil(pool.end())` 关闭本次请求的连接；Hyperdrive 维护到源数据库的连接池。

`getAuth()` 在请求中获取当前 Drizzle 实例，避免 Better Auth 在模块初始化时捕获 Node 全局连接池。Node 环境继续使用原有模块级连接池。认证 schema CLI 使用 `scripts/auth.config.ts`，不要在 Worker 入口导入这个 Node CLI 配置。

此适配没有改变 schema、relations 或 migration 文件，无需 `db:push` / `db:migrate`。

## 本地 Workers 验证

先执行 `pnpm build:cloudflare`。本地 Hyperdrive 需要设置 `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` 为本机 `.env` 的数据库连接字符串，再运行 `pnpm preview:cloudflare --port 3130`。该变量只用于本地运行，不提交到 Wrangler 配置。测试命令为 `TEST_BASE_URL=http://localhost:3130 pnpm test`。

Cloudflare 插件会在忽略的 `dist/server/.dev.vars` 中写入本地预览用变量；保持 `dist` 和 `.dev.vars*` 在 Git 忽略列表内。生产 Secrets 使用 `pnpm cf:secrets` 单独配置。

## 产物与大小

```sh
pnpm build:cloudflare
pnpm exec wrangler deploy --dry-run
pnpm exec wrangler check startup
```

静态 CSS、浏览器 JS、图标走 Workers Static Assets；文章图片继续在 R2，MiSans 继续使用 CDN。上传服务继续使用 S3 预签名 URL，保留浏览器直传流程。

2026-09-14 首轮 dry-run：Worker 未压缩约 6.46 MiB，gzip 约 1.43 MiB，最大静态文件约 574 KiB，未超限。本地 startup profile 活跃 CPU 约 14 ms；该值不代表 Cloudflare 线上启动耗时，发布时以服务端结果为准。当前官方 Worker 大小限制是未压缩 64 MiB；gzip 仅作参考，静态单文件上限为 25 MiB。

若未来超限，先根据 dry-run 和 startup profile 定位依赖；优先压缩 server JS、按需加载重型模块、将二进制资源移到 R2 或 Static Assets，再考虑拆分 Worker。不要为了体积删除文章、编辑器能力或现有页面布局。

## 验证记录

2026-09-14：类型检查、lint（有既有 warnings）、Node/Vercel/Workers 三种构建通过。Node 开发、Node 生产、Workers 本地预览各 20 项 HTTP 冒烟检查通过；本地 Workers 使用现有数据库，只执行公开读取和未授权写入拦截。打包 JS/CSS/JSON/HTML 未包含本机数据库 URL 或服务端密钥。

2026-09-14 已发布到 https://blog.wenhouman.workers.dev，版本 `c8ea9edc-c5ca-4cdd-8049-f53f56473310`。线上 20 项 HTTP 检查通过，浏览器确认 MiSans 字体、纸张背景和文章列表跳转正常。上传 6611.20 KiB（gzip 1463.95 KiB），Cloudflare 报告启动耗时 29 ms。Hyperdrive 查询缓存已关闭，源连接上限为 5；R2 CORS 在保留 localhost 的基础上加入线上域名。实际管理员登录、成功保存、Google OAuth 回调和完整 R2 文件上传尚未验证。

参考：[TanStack Start on Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/)、[Hyperdrive + Neon](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-database-providers/neon/)、[Workers 大小限制](https://developers.cloudflare.com/workers/platform/limits/#worker-size)。
