# Wen's Blog

React 19 + TanStack Start + TanStack Router + Hono，部署到 Cloudflare Workers。服务端读取与评论写入使用 `createServerFn`，管理端与媒体接口使用 Hono RPC；认证保留 Better Auth，数据库保留 Drizzle Relations v2 与现有 D1。

## 开发

```sh
mise install
mise exec -- bun install --frozen-lockfile
cp .env.example .env # 已有 .env 时跳过
mise exec -- bun run dev
```

工具版本在 `mise.toml`：Node 24.21.0、Bun 1.4.2。默认访问 http://localhost:3000。变量清单在 `.env.example`，服务端校验在 `src/lib/env.ts`，公开变量在 `src/lib/client-env.ts`。生产构建统一使用 `--mode cloudflare` 并读取 `.env.cloudflare` 中的公开默认值（可通过构建环境覆盖），不会把本地 `.env` 的开发地址打包进生产。

`bun run dev` 与 `bun run start` 直接连接线上 Cloudflare D1 `blog` 数据库（`remoteBindings: true`），不使用本地数据库，需提前登录 Cloudflare 账户（`bun x wrangler login`）。已有生产 D1 的 ID 和域名保存在 `wrangler.jsonc`，本地后台保存、删除、评论与登录会话操作会直接写入线上数据，详见 [Cloudflare 说明](docs/cloudflare.md)。更换开发端口时同步设置 `BETTER_AUTH_URL`：

```sh
BETTER_AUTH_URL=http://localhost:3001 bun run dev --port 3001 --strictPort
```

## 目录

```text
src/
  worker.ts              # Cloudflare Worker 入口，处理 canonical redirect 与请求级 D1 上下文
  router.tsx             # 创建 Router 与 SSR QueryClient 集成
  routes/                # TanStack Router 扁平路由（_blog / _studio / api.$ / sitemap.xml）
  server/                # createServerFn、Hono API 路由与鉴权/CSRF 中间件
  db/                    # D1 schema / Relations v2
  lib/                   # 认证配置与客户端、数据库上下文、Hono RPC、环境变量与工具
  components/
    ui/                  # 已使用的 coss/Base UI 组件
    features/            # blog、studio、editor、comments 等
    tiptap/              # 编辑器专用 primitives、nodes、tools
  hooks/
  styles/
```

`/` 首页直接展示个人简介与已发布文章列表，`/blog` 永久重定向（308）至 `/`，`/blog/:id`、`/studio/login`、`/studio/posts` 和编辑 URL 保持不变。路由 loader 预取数据并与 TanStack Query SSR 集成，客户端变更后刷新对应 query cache；退出时等待 Better Auth 完成并清理客户端 Query 缓存。

## 验证

```sh
mise exec -- bun run lint
mise exec -- bun run typecheck
mise exec -- bun test
mise exec -- bun run build
mise exec -- bun run start
# 对已经运行的开发/生产预览服务：
TEST_BASE_URL=http://localhost:3000 bun run test:http
```

HTTP smoke 覆盖 SSR、样式、已发布文章、sitemap、404、私有页面、未授权 API 鉴权及跨站 CSRF 校验。成功登录、写入、Google OAuth 和 R2 上传需另外验证；使用独立测试账户或预发布资源。系统 HTTP 代理影响 localhost 时设置 `NO_PROXY`，或为测试进程移除代理变量。

## 部署与迁移

`bun run deploy` 使用 `bun run build:cloudflare && bun x wrangler deploy`。该命令复用 `wrangler.jsonc` 中的现有资源并上传构建产物，不自动应用数据库迁移。先阅读 [Cloudflare 说明](docs/cloudflare.md)，核对账户、D1、域名与迁移状态。

Drizzle ORM / Kit 继续配对固定 `1.0.0-rc.4`，Better Auth 使用 `@better-auth/drizzle-adapter/relations-v2` 并显式传 schema。保留 `drizzle/d1` 的既有迁移内容与名称，通过项目 `db:generate` / `db:migrate` 命令管理。历史 PostgreSQL 文件保留于 `drizzle/migrations`。

[设计约定](docs/design.md) · [Cloudflare 说明](docs/cloudflare.md)
