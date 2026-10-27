# Void 迁移记录

首次迁移核查日期：2026-10-16。当时使用 Void / @void/react 1.1.11，保留 Better Auth 与现有 D1 数据模型。后续版本核查见文末。

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

## 1.1.11 → 1.3.0 更新核查（2026-10-27）

- npm 的 `latest` 均为 `void@1.3.0`、`@void/react@1.3.0`；React adapter 的 `void` peer 为精确 `1.3.0`，两者需同步升级。Void 要求 Node `>=24.21.0`、Vite `^8.0.0`，adapter 支持 React / React DOM `^19.0.0`，本项目现有工具链满足要求。[Void 发布元数据](https://registry.npmjs.org/void/1.3.0)、[React adapter 发布元数据](https://registry.npmjs.org/@void%2Freact/1.3.0)
- **1.1.12（10 月 19 日）**：修复服务端 typed fetch 忽略请求选项及把错误响应视为成功的问题，修正 validated loader 的 `InferProps`，并修复静态 React 页的查询参数保留。数据库恢复点属于 Void 管理迁移的功能，不改变本项目使用指定版本 Kit / Wrangler 的迁移流程。[1.1.12 release](https://github.com/voidzero-dev/void/releases/tag/v1.1.12)
- **1.2.0 / 1.2.1（10 月 22 日）**：修复 deferred props、具名 action 与重定向、开发页面扫描报错、handler 类型推导和 D1 迁移目录匹配；随后修复 `preserveState` 不更新地址栏和 `router.refresh()` 增加历史记录或丢失 hash。以上与本项目导航、编辑保存有关。[1.2.0 release](https://github.com/voidzero-dev/void/releases/tag/v1.2.0)、[1.2.1 release](https://github.com/voidzero-dev/void/releases/tag/v1.2.1)
- **1.3.0（10 月 27 日）**：新增 JSX route / server companion、`useForm().setError()`、`resetOnSuccess`；修复导航竞争、重定向重复抓取、同页 action 增加历史记录、private helper 影响客户端 bundle 检测及已登录用户静态资源缓存策略。博客现有 `.server.ts`、action 与独立 Better Auth 可继续使用，无需为新功能改写页面或启用托管认证。自托管 Void platform 才需要先升级 platform 至 1.3.0，本项目直接发布到自有 Cloudflare Worker。[1.3.0 release](https://github.com/voidzero-dev/void/releases/tag/v1.3.0)
- 保留 `vite.config.ts` 对 `src/routes`、`src/middleware` 的额外 Worker 依赖扫描。对照两版发布包的 `dist/plugin.mjs`，1.3.0 虽分离了 React 客户端与服务端预捆绑依赖，`void_worker.optimizeDeps.entries` 仍只扫描 Pages；不能据 release 的预捆绑改进认定服务端路由扫描已覆盖。[1.3.0 adapter 源码](https://github.com/voidzero-dev/void/blob/v1.3.0/packages/react/src/plugin-pages.ts)、[1.1.11 adapter 源码](https://github.com/voidzero-dev/void/blob/v1.1.11/packages/react/src/plugin-pages.ts)
- 发布包中的 D1 部署校验要求显式 `migrations_dir`，自定义 `migrations_pattern` 以该目录为前缀；现有 `drizzle/d1` 与 `drizzle/d1/*/migration.sql` 满足此规则。继续保留本项目的 migration history 和 ORM / Kit `1.0.0-rc.4`；Void 1.3.0 自带的 ORM `^0.45.4` / Kit `^0.31.11` 仍与本项目不同。[1.3.0 发布包](https://registry.npmjs.org/void/-/void-1.3.0.tgz)、[发布元数据](https://registry.npmjs.org/void/1.3.0)
- 当前 action 文档把预期校验失败定义为 `{ ok: false, error }`，认证和服务端异常会抛出；现有调用先检查 `result.ok`，并兼容 `pageData.errors`，升级应复测这条失败路径及保存时编辑器状态保留。[Actions & Forms](https://void.cloud/guide/pages-routing/actions-and-forms)

### 本次升级与验证

- `void`、`@void/react` 同步精确锁定 `1.3.0`，更新 `bun.lock` 并通过冻结安装。项目直接使用的 Better Auth / adapter 仍为 `1.7.4`，Drizzle ORM / Kit 仍为 `1.0.0-rc.4`；框架升级无需改写现有应用 API 或数据库 schema。另增加显式的 `dev:remote` 开关，远程 D1 验证见 [Cloudflare 说明](cloudflare.md)。
- Node 24.21.0 / Bun 1.4.2 下，lint（现有组件 warnings）、typecheck、11 项离线测试和 Cloudflare Workers build 通过。编辑器客户端 chunk 仍有大于 500 kB 的构建提示。
- 按顺序验证开发服务、生产构建预览、开发服务。两种服务均通过 `TEST_BASE_URL=http://localhost:3000 bun run test:http`；有本机代理时设置 `NO_PROXY=localhost,127.0.0.1`。隔离本地 D1 临时创建 1 篇发布文章后再次运行整套 HTTP suite，覆盖文章 SSR、metadata、page-data、sitemap、404、私有跳转、API/action 鉴权与 CSRF。
- 两种服务均验证 Better Auth 注册、登录、Relations v2 会话与管理员权限、原生保存 action、校验失败不写库、具名创建 action 的 303 重定向、编辑页 SSR、草稿隔离、关联评论读取及退出后会话失效。每轮删除该轮临时文章、评论、用户和关联认证数据，确认八张业务表行数恢复且外键检查通过。
- 当前本地 `.env` 只有旧的公开认证 URL，缺少服务端 `BETTER_AUTH_URL`。开发认证验证通过命令环境临时设置 `BETTER_AUTH_URL=http://localhost:3000`；未改动 `.env`。生产预览使用生产认证来源和 Secure Cookie 名称，始终只访问本地 D1，不等同于线上 OAuth 验证。
- 本次未完成真实浏览器验证（浏览器连接不可用，原生 Chrome 操作也未能稳定完成），未重测 Google OAuth 或 R2 上传成功路径；未部署或写入远程 D1。
