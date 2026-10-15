# Void 迁移记录

核查日期：2026-10-16。当前实现使用 Void / @void/react 1.1.11，保留 Better Auth 与现有 D1 数据模型。

## 官方约定与本项目实现

- `voidPlugin()` 和 `voidReact()` 注册到 Vite；后者包含 React 插件。`sourceDir: 'src'` 集中源码约定，页面位于 `src/pages`，`[id]` 表示动态段，`(blog)` / `(studio)` 是不影响 URL 的路由组。[Pages 概览](https://void.cloud/guide/pages-routing/overview)
- 同名 `.server.ts` 提供 loader、action 与页面类型；组件接收 loader props，数据库查询只在服务端执行。私有 loader/action 各自校验身份，登录页位于受保护组外。[Loaders](https://void.cloud/guide/pages-routing/loaders)、[Actions](https://void.cloud/guide/pages-routing/actions-and-forms)
- `src/routes` 导出原生 HTTP method handlers，`_data.ts`、`_schema.ts`、`_metadata.ts`、`_presign.ts` 就近复用且不生成端点。旧 `src/server`、Hono app/factory/zValidator/RPC client 已删除；仅保留 Void 使用的标准 `hono/http-exception` 错误类型。[项目结构](https://void.cloud/reference/structure)、[服务端路由](https://void.cloud/guide/server-routing)
- 数字前缀中间件依次处理请求级 Drizzle 上下文、后台与 API 认证。私有响应在 `await next()` 后设置 `private, no-store`，覆盖框架错误响应；不能只依赖布局鉴权。[Middleware](https://void.cloud/guide/server-routing)
- Better Auth 继续使用项目自己的 `@better-auth/drizzle-adapter/relations-v2` 和显式 schema，Drizzle ORM / Kit 固定 `1.0.0-rc.4`。Void 内置 ORM 为 0.45，数据库推断已关闭；不导入 `void/db`、`void/auth`，不生成另一套认证表或迁移。现有 `drizzle/d1` 与历史 PostgreSQL 迁移保持不变。[认证](https://void.cloud/guide/auth)、[数据库](https://void.cloud/guide/database)
- Void 只接受根 `.env`，变量模板移至 `docs/env.example`。八项 server secrets 在 `src/env.ts` 声明；`NEXT_PUBLIC_*` 经 Vite 显式兼容映射，生产默认值不会读取本地 localhost 配置。[环境变量](https://void.cloud/guide/env-vars)
- `void.config.ts` 显式维护已有 Worker、D1 和自定义域名。生产发布由 Wrangler 上传 Void 生成的 `dist/ssr/wrangler.json`，复用现有 OAuth 会话，不自动 provision 或应用迁移；该流程不生成 `void.lock.json`。[Cloudflare](https://void.cloud/integrations/cloudflare)、[部署说明](cloudflare.md)
- 共享 UI、features、hooks、lib 按职责组织。静态导入图检查后删除孤立组件；文章数据直接使用 loader props。原生 Pages validation 返回 HTTP 200 与 `pageData.errors`，客户端检查校验结果后才提示成功，API validator 则返回 HTTP 400。[项目结构](https://void.cloud/reference/structure)、[Actions](https://void.cloud/guide/pages-routing/actions-and-forms)

## 验证记录（2026-10-16）

- mise 全局与项目版本：Node 24.21.0、Bun 1.4.2；冻结安装通过。
- lint 通过（保留既有组件 warnings）、typecheck、11 项离线测试、Workers build、Worker types、git diff --check 通过。
- 开发与生产预览 HTTP suite 均通过，包含 2 篇测试发布文章时的 SSR、metadata、评论显示和 sitemap，以及原生 page-data、私有错误缓存头、API/页面 action 未授权保护、helpers 不生成静态端点与 CSRF 拒绝。
- 隔离本地 D1 的集成验证：Better Auth 注册/会话、REST 创建/更新/删除接口的鉴权与校验、原生文章保存/评论/命名创建 action、校验失败不写库、草稿 404 与 sitemap 排除。构建预览使用生产 HTTPS 配置对应的 Secure Cookie 名称验证同一临时会话。
- 真实浏览器验证开发登录、Studio 列表到编辑页导航、标题自动保存并经 API 读取确认持久化；生产预览验证文章导航与评论 SSR。
- 本地 Node 切换及依赖解析稳定后，页面热更新检查连续通过；生成入口在 dev/build 间会变化，各模式按顺序验证。
- 用户授权后，通过 Better Auth sign-out 退出保存的临时会话并确认失效；原浏览器测试标签已关闭，因此未复测菜单退出按钮。已清理剩余 5 篇测试文章、3 条评论、临时账户及其全部会话和认证记录，并删除临时凭据文件。本地数据库外键检查通过；清理后 HTTP suite 通过（0 篇发布文章），浏览器访问 `/studio/posts` 正确跳转首页。
- 未发布、未写远程 D1，Google OAuth 与 R2 成功上传未测。
