# Wen's Blog

React 19 + Void 原生 Pages，部署到 Cloudflare Workers。页面读取和写入使用同目录的 loaders/actions，HTTP API 使用 Void 文件路由；认证保留 Better Auth，数据库保留 Drizzle Relations v2 与现有 D1。

## 开发

```sh
mise install
mise exec -- bun install --frozen-lockfile
cp docs/env.example .env # 已有 .env 时跳过
mise exec -- bun run dev
```

工具版本在 `mise.toml`：Node 24.21.0、Bun 1.4.2。默认访问 http://localhost:3000。Void 只允许根目录 `.env`，变量清单在 `docs/env.example`，类型与校验在 `src/env.ts`。既有 `NEXT_PUBLIC_*` 名称通过显式公开值映射继续支持；生产构建使用公开默认值或构建 shell 的覆盖值，不读取开发 `.env` 中的公开地址。

开发默认使用 `.void` 下的**本地 D1**；首次运行 `bun run dev` 生成配置后，在另一个终端执行 `bun run db:migrate:local`。已有生产 D1 的 ID 和域名保存在 `void.config.ts`，测试不会写入生产数据库。更换开发端口时同步设置 `BETTER_AUTH_URL`：

```sh
BETTER_AUTH_URL=http://localhost:3001 bun run dev --port 3001 --strictPort
```

## 目录

`void.config.ts` 配置 `sourceDir: 'src'`，所有 Void 源码约定集中在 `src`：

```text
src/
  pages/                 # React Pages；同名 .server.ts 导出 loader/action
    layout.tsx           # 公共 providers，每次 SSR 独立 QueryClient
    (blog)/              # 博客布局，URL 不包含组名
    (studio)/            # 后台布局，登录页在组外
    studio/login.tsx
  routes/                # HTTP API，导出 GET/POST/PUT/DELETE
    api/auth/[...path].ts # Better Auth handler
    api/posts/index.ts   # /api/posts
    api/posts/[id].ts    # /api/posts/:id
    api/posts/_schema.ts # 输入 schema；下划线文件不生成端点
    api/posts/_data.ts   # API 与 Pages 共用文章查询/写入
    api/bookmark/        # 书签端点及 _metadata 辅助模块
    api/s3/              # 上传端点及 _presign 辅助模块
    api/spotify.ts
    sitemap.xml.ts
  middleware/            # 按数字前缀排序：请求 DB、后台授权、API 授权
  db/                    # D1 schema / Relations v2
  env.ts                 # Void 服务端变量 schema
  lib/                   # 认证、数据库上下文、共享工具
  components/
    ui/                  # 已使用的 coss/Base UI 组件
    features/            # blog、studio、editor、comments 等
    tiptap/              # 编辑器专用 primitives、nodes、tools
  hooks/
  styles/
```

`/`、`/blog`、`/blog/:id`、`/studio/login`、`/studio/posts` 和编辑 URL 保持不变。公开文章与评论直接由 loader 传给组件；保存、创建、删除和评论使用 Void actions，成功后重新获取页面数据。React Query 仅用于 Spotify 等独立客户端请求，不再重复加载页面数据。退出等待 Better Auth 完成并清理客户端 Query 缓存。

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

HTTP smoke 覆盖 SSR、样式、已发布文章、sitemap、404、私有页面与未授权 API。`X-VoidPages` 页面请求、actions 输入校验和鉴权回归也在 HTTP 测试内。成功登录、写入、Google OAuth 和 R2 上传需另外验证；使用独立本地库或预发布资源。系统 HTTP 代理影响 localhost 时设置 `NO_PROXY`，或为测试进程移除代理变量。

## 部署与迁移

`bun run deploy` 使用 `bun run build && wrangler deploy --config dist/ssr/wrangler.json`。该命令复用现有资源并上传构建产物，不自动应用数据库迁移。先阅读 [Cloudflare 说明](docs/cloudflare.md)，核对账户、D1、域名与迁移状态。资源标识在 `void.config.ts` 显式维护；`.void/` 和 `.void-wrangler.jsonc` 是忽略的生成文件。

Drizzle ORM / Kit 继续配对固定 `1.0.0-rc.4`，Better Auth 使用 `@better-auth/drizzle-adapter/relations-v2` 并显式传 schema。保留 `drizzle/d1` 的既有迁移内容与名称，通过项目 `db:generate` / `db:migrate*` 命令管理。Void 自带的 Drizzle 0.45/Kit 0.31 不接管应用 schema；本项目不使用 `void/db`、`void/auth`、`void db push` 或 `void db generate`。历史 PostgreSQL 文件保留于 `drizzle/migrations`。

[Void 迁移依据](docs/void-research.md) · [设计约定](docs/design.md)
