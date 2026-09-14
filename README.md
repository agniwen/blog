# Wen's Blog

React 19 + TanStack Start + TanStack Router，使用 Vite 构建并部署到 Cloudflare Workers，使用 Hono API、Better Auth 和 Drizzle/D1。

## 本地开发

使用 Node.js 22.12+（验证环境为 Node.js 24.11）和 pnpm 11.5.2，具体要求见 `package.json` 的 `engines` / `packageManager`：

```sh
pnpm install --frozen-lockfile
cp .env.example .env # 已有 .env 时跳过
pnpm dev
```

在 `.env` 配置 Better Auth、Google OAuth 和 R2；先运行 `pnpm exec wrangler login`。数据库使用 `wrangler.jsonc` 的远程 D1 `DB` 绑定，本地开发写入也会修改该库，访问 http://localhost:3000。现有 `NEXT_PUBLIC_AVATAR_URL`、`NEXT_PUBLIC_BETTER_AUTH_URL` 继续有效，仅公开变量会进入浏览器。开发或预览更换端口时，将公开认证 URL 指向对应服务，OAuth 回调地址也需要匹配。

## 扁平文件路由

所有路由与布局直接定义在 `src/routes`，由 TanStack Router 自动生成 `src/routeTree.gen.ts`，不要手工编辑生成文件。

| 文件                                    | URL / 职责                            |
| --------------------------------------- | ------------------------------------- |
| `__root.tsx`                            | HTML 文档、head、全局 UI、错误/404    |
| `_blog.tsx`                             | 博客无路径布局                        |
| `_blog.index.tsx`                       | `/`                                   |
| `_blog.blog.index.tsx`                  | `/blog`                               |
| `_blog.blog.$id.tsx`                    | `/blog/:id`                           |
| `studio.login.tsx`                      | `/studio/login`，独立于后台布局       |
| `_studio.tsx`                           | 管理员无路径布局与服务端会话检查      |
| `_studio.studio.index.tsx`              | `/studio` → `/studio/posts`           |
| `_studio.studio.posts.index.tsx`        | `/studio/posts`                       |
| `_studio.studio.posts.upsert.index.tsx` | 跳转 `/studio/posts`                  |
| `_studio.studio.posts.upsert.$id.tsx`   | `/studio/posts/upsert/:id`            |
| `api.$.ts`                              | Hono `/api/*`，含认证、上传和文章 API |
| `sitemap[.]xml.ts`                      | `/sitemap.xml`，只列已发布文章        |

页面部件放在 `src/components/features/blog`、`studio`；全局样式在 `src/styles/app.css`。`src/router.tsx` 为每个请求创建 QueryClient，并使用官方 SSR Query 集成。数据库读取和评论提交由 server function 执行，后台文章数据在函数内再次验证管理员权限。

Next.js 的缓存组件和静态参数生成已替换为请求时 SSR。Query 数据默认 30 秒内保持新鲜，写操作使相关 Query 失效；这不是 CDN ISR。后台与登录页使用 `private, no-store`。原有图片 `<img>`、字体 CSS 和正文嵌入保留。

## 验证

```sh
pnpm lint
pnpm typecheck
pnpm build
pnpm start
# 在另一个终端执行：
pnpm test
# 测试其他端口：TEST_BASE_URL=http://localhost:3102 pnpm test
```

`pnpm test` 对运行中的服务执行 HTTP 冒烟检查：公开页面 SSR、所有已发布文章、元数据、sitemap、404、后台未登录跳转、认证会话、未授权 API 写请求。不会登录或修改数据库。开发环境同样可运行这组检查。

还需在预发布环境用实际管理员账户确认：登录/退出、文章创建与编辑、自动保存、评论提交后刷新、R2 上传和 OAuth 回调。未认证的自动检查不能替代这些流程。

## 部署

Cloudflare Workers 是当前运行环境，开发和构建均使用官方 Cloudflare Vite 插件。执行 `pnpm deploy` 发布；`pnpm build` 后用 `pnpm start` 本地预览。D1、Secrets、迁移和域名设置见 [Cloudflare 部署说明](docs/cloudflare.md)。

数据库变更用 `pnpm db:generate` 生成 `drizzle/d1` 下的 SQLite 迁移，`pnpm db:migrate` 应用到远程 D1，`pnpm db:migrate:local` 只初始化本地 SQLite。原 PostgreSQL 数据库保留，应用不再读取它；`pg` 仅是一次性导入工具的开发依赖。

参考：[官方 Next.js 迁移指南](https://tanstack.com/start/latest/docs/framework/react/migrate-from-next-js)、[部署指南](https://tanstack.com/start/latest/docs/framework/react/guide/hosting)。

## 依赖维护

本轮采用当前兼容版本范围内的更新，并同步 React、React DOM 和对应类型包。pnpm 的版本选择还会遵循本机/工作区的发布时间限制，因此“兼容更新”不等于升级所有 npm 最新标签。

| 依赖                           | 当前版本范围 |
| ------------------------------ | ------------ |
| `react`                        | `19.3.0`     |
| `react-dom`                    | `19.3.0`     |
| `@types/react`                 | `19.2.14`    |
| `@types/react-dom`             | `19.2.3`     |
| `better-auth`                  | `^1.7.4`     |
| `@tiptap/react`                | `^3.31.3`    |
| `@aws-sdk/client-s3`           | `^3.1131.0`  |
| `@base-ui/react`               | `^1.8.0`     |
| `hono`                         | `^4.13.7`    |
| `pg`                           | `^8.23.0`    |
| `shadcn`                       | `^4.21.0`    |
| `oxlint`                       | `^1.82.0`    |
| `drizzle-orm` / `drizzle-kit`  | `1.0.0-rc.4` |
| `@better-auth/drizzle-adapter` | `1.7.4`      |

`@iconify/react` 属于运行时依赖，shadcn CLI 属于开发依赖。Drizzle ORM / Kit 已配对固定到 `1.0.0-rc.4`（当前 `rc` 标签，仍是预发布版本），Better Auth 使用官方 `@better-auth/drizzle-adapter/relations-v2` 适配器并显式传入 schema；连接配置只传 `relations`。D1 使用 SQLite schema，历史 PostgreSQL 迁移保留在原目录。Table、Motion、Jotai、Day Picker、Resizable Panels、TypeScript 等跨大版本升级，以及 0.x 包的跨兼容范围升级，本轮未进行。

应用已不使用 Next.js；锁文件仍可能包含 Better Auth 的可选 Next.js peer。用 `pnpm why next` 区分可选依赖与应用入口，不要为消除提示添加 Next.js 配置或隐藏真实 peer 不兼容。

更新后先执行 `pnpm install --frozen-lockfile`、lint、typecheck 和 build，再针对运行中的开发/生产服务执行 HTTP 冒烟测试。涉及编辑器、认证和上传时，另用测试账户验证成功写入流程；构建通过不能替代这些检查。

迁移过程与验证范围见 [迁移记录](docs/tanstack-start-migration.md)。

2026-09-14 依赖更新验证：兼容依赖升级及 Drizzle RC 适配后，lint、类型检查、构建、开发/生产各 20 项 HTTP 检查通过；peer 检查无问题。额外在 PostgreSQL 强制只读模式下验证 Better Auth 的四类模型读取，以及文章标签、评论用户关联读取。未执行 `db:push` / `db:migrate`，schema、relations 和已有 migration 文件保持不变。实际登录、成功写入和上传仍需测试账户验证。

Drizzle Relations v2 适配依据：[Better Auth 官方文档](https://better-auth.com/docs/adapters/drizzle#drizzle-relations-v2)、[Drizzle 升级说明](https://orm.drizzle.team/docs/relations-v1-v2)。

## 页面设计

保留现有页面布局，仅参考 Yohaku 调整色号、圆角、边框与轻阴影。设计约定见 [docs/design.md](docs/design.md)。

后台目前仅保留文章管理；`/studio` 跳转到 `/studio/posts`，Projects 页面已移除。列表使用统一内容间距和自适应卡片网格，编辑页沿用同一外框并在正文／属性面板内部滚动。
