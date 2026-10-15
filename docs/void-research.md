# Void 集成调研

核查日期：2026-10-15。本文区分官方指南与当前项目的兼容性判断，不包含远程部署或数据迁移的执行结果。

## 已选择的原生 Pages 重构

用户已选择完整迁入原生 Void Pages、loaders 和 actions。官方 React 配置为 `plugins: [voidPlugin(), voidReact()]`，后者来自 `@void/react/plugin`，已包含 React Vite 插件；不再注册 TanStack Start、独立 React 或 Cloudflare 插件。页面位于 `pages/`，动态段用 `[id]`，路径组用 `(blog)`，layout 接收 `children`。[Pages 概览](https://void.cloud/guide/pages-routing/overview)

迁移保留现有 URL、API 契约、UI 组件、排版与交互；TanStack 路由与 server functions 迁入 Pages，旧文件不应和 Void 的 `routes/` 扫描目录重叠。共享布局使用 `pages/layout.tsx` 或组内 `layout.tsx`；登录页应放在受保护组外，仍返回 `/studio/login`。菜单导航使用 `@void/react` 的 `Link href`，编程导航为 `useRouter().visit()`，重新获取当前页为 `refresh()`。[Pages 概览](https://void.cloud/guide/pages-routing/overview)

`page.server.ts` 导出 `loader = defineHandler(async c => ({ ... }))` 与 `type Props = InferProps<typeof loader>`，React 页面仅通过 type import 引用 Props，接收 loader 返回对象。服务端查询不得放进页面组件。页面 metadata 使用 `head = defineHead<Props>((c, props) => ({title, meta}))`；缺失文章抛出 Hono `HTTPException(404)`。[Loaders](https://void.cloud/guide/pages-routing/loaders)、[Handler API](https://void.cloud/reference/api/handlers)

action 导出为 `defineHandler.withValidator({body: schema})(async (c, {body}) => { ... })`，支持 Standard Schema，包括现有 Zod；每次私有 action 内独立授权。返回 void 会重新执行 loader，返回 `c.redirect()` 导航。客户端 `Form/useForm('/route', initialValues)` 管理校验、提交错误与 pending。复杂编辑器可保留现有表单逻辑，用 awaitable `action('/studio/:id?update', {params: {id}, data, method: 'POST'})`；结果为 `{ok:true,pageData}` 或 `{ok:false,error}`，认证/服务器错误会抛出。多操作页面导出 `actions: {update, delete}`，不能同时导出单数 action。每个 action 各自授权。[Actions 与 Forms](https://void.cloud/guide/pages-routing/actions-and-forms)

全局中间件 `middleware/01.context.ts` 导出 `defineMiddleware(async(c,next)=>{ ...; await next(); })`。共享用户数据可 `c.set('shared', {...})`，通过 `CloudContextVariables.shared` 扩展类型后由 `useShared()` 读取。root 中间件可在 `requestDatabase.run(createDatabase(c.env.DB), next)` 中保留项目 rc.4 请求上下文，并在同一链处理 canonical redirect 和私有 `Cache-Control`。这是对已存在 ALS 生命周期的迁移设计，需实际 dev/build 验证。[Layouts 与共享数据](https://void.cloud/guide/pages-routing/layouts)

Void handler 基于 Hono，可直接使用 Hono middleware/Response helpers。API catch-all handler 可委托给现有 Hono app 的 `fetch`，保留 `/api/auth/*`、R2 与业务 API；需通过真实 HTTP 验证路径、method、request/env/context 透传。[Hono 集成](https://void.cloud/integrations/hono)

原生 Void auth 默认会自行管理连接与认证表。官方支持 root `auth.ts` 的 `defineAuth(({defaults})=>({...defaults, ...custom}))`，但不是深合并；导入 `void/auth`、`void/client` 的 auth、config.auth 或 root auth.ts 都会启用它。本项目已有 rc.4 Relations v2 schema/adapter，因此原生页面迁移保留自管 Better Auth，并通过 Void API route 调用它的 handler，避免无意启用另一套 ORM/auth table 管理。若以后迁入 managed auth，应单独证明自定义 database adapter、schema、Google 配置及会话兼容，不可使用自动生成表替换现有表。[认证指南](https://void.cloud/guide/auth)

## 已发布版本与数据库兼容性

`bun info void --json` 在核查时返回 `void@1.1.11`：Node 要求为 `>=24.21.0`，Vite peer 为 `^8.0.0`；其内部依赖为 `drizzle-orm ^0.45.4`、`drizzle-kit ^0.31.11`、`better-auth ^1.7.7`。元数据包含指南所使用的 `void`、`void/config`、`void/env`、`void/db` 和 `void/schema-d1` 导出。这说明 npm 包与当前指南属于同一产品，但不能假定其内置 Drizzle 版本等同于项目版本。[npm 发布包元数据](https://registry.npmjs.org/void/1.1.11)

本项目将 ORM 和 Kit 固定为 `1.0.0-rc.4`，`src/db/relations.ts` 使用 Relations v2；`src/lib/db.ts` 以 `drizzle(binding, { relations })` 建立连接。直接切换到 Void 内置 ORM 会跨越关系 API 与迁移快照格式边界。应保留项目自己的 rc.4 ORM、Kit 和 Better Auth Relations v2 adapter，先验证构建插件是否能独立使用；不能通过包版本覆盖将 Void 强行运行在未经支持的 rc.4 上。

官方数据库指南默认读取 `db/schema.ts` 和 `db/migrations`，并使用 Drizzle 快照检查 schema 漂移；缺少匹配 metadata 会导致重复生成建表迁移。现有项目则使用 `src/db/schema.ts`、`drizzle/d1/<timestamp>/migration.sql` 和 rc.4 快照，因此不能复制 Void 的生成命令来替换既有迁移历史。[数据库指南](https://void.cloud/guide/database)

## 配置与已有资源

官方推荐把 Worker 配置写入 `void.config.ts`：兼容日期和 flags 可置于 `worker`，bindings、资源 ID、域名路由、assets 和其它 Cloudflare 字段置于 `cloudflare`。`void.lock.json` 记录资源与迁移历史，应提交；生成的 `.void-wrangler.jsonc` 不应提交。`sourceDir: 'src'` 会一起改变 schema、migrations、env 等约定路径，不只是修改资源扫描目录，不能为匹配现有 schema 路径而盲目启用。[配置参考](https://void.cloud/reference/config)

现有 `wrangler.jsonc` 的 `DB` 指向已有 D1，且配置远程开发。应完整保留其资源 ID、自定义 migration directory/pattern、assets 策略、compatibility、域名和公开 vars；不得让推断自动创建一个新的生产 DB 取代它。官方直接 Cloudflare 集成明确支持已有 Worker 以及自定义 D1 migration 目录、表和 pattern，但首次 linking/deploy 会迁移配置并可能预建资源，失败构建也可能遗留新资源。[Cloudflare 集成](https://void.cloud/integrations/cloudflare)

`src/worker.ts` 还承担 canonical redirect、请求级 Drizzle AsyncLocalStorage、开发桥接。插件替换必须证明自定义入口仍被采用，否则 `db()` 会在请求中找不到 context。框架直接部署的 redirects/headers 应继续由框架或 Worker 执行，不能仅把这些规则转写到 Void 原生路由配置。[Cloudflare 集成](https://void.cloud/integrations/cloudflare)

## 环境变量

Void 以 `env.ts` 声明变量，使用根 `.env` 提供本地值；生产 server 值通过 secrets 管理。其 public 语义固定为 `VITE_*`，即使 Vite 自定义 `envPrefix` 也不会改变这点；生产 build 不读取 `.env` 中的 public 值，应通过 build shell 或非敏感 schema default 提供。其它 dotenv 文件（包括 `.env.example` 与 `.env.production`）不是 Void 的值来源。[环境变量指南](https://void.cloud/guide/env-vars)

项目现有 `NEXT_PUBLIC_AVATAR_URL` / `NEXT_PUBLIC_BETTER_AUTH_URL` 与 `.env.cloudflare` 属于已支持的兼容契约。不可直接把这些名称放进 Void env schema，否则会按 server 变量处理。应保留 `src/lib/client-env.ts` 与明确的 Vite public prefix/build mode，或通过显式映射增量支持 `VITE_*`，同时保留旧名称。实际运行确认 Void 插件拒绝根 `.env.example` 和 `.env.cloudflare`，因此模板已移到 `docs/env.example`，公开生产默认值在 Vite 配置中显式映射，现有 `.env` 保留。

## 部署与验收边界

`void deploy` 会构建、provision 资源、应用 migrations、上传 Worker 并检查 readiness；它并非单纯替代 `vite build`。官方建议 CLI 与 adapter 版本一致，提交 config/lock；CI 在 typecheck 之前可运行 `void prepare` 生成类型。回滚代码不会回滚数据库 migrations。[部署指南](https://void.cloud/guide/deployment)

第一阶段应只在本地证明：自定义入口、rc.4 relations、Better Auth 私有边界、已有 migration 配置、public env 兼容与 canonical redirect 都保持有效。对 dev 和生产 preview 分别执行 HTTP smoke；成功登录、写入、OAuth、R2 上传必须另行验证。当前远程 D1 与共享数据不能作为自动迁移、seed 或写入测试目标。若 Void 的 prepare/build 强制要求使用其 0.45 ORM 快照，则这是现有版本的实际集成 blocker，应报告具体错误，而非更改 schema 或数据库来绕过。

## 本次落地结构

使用 `sourceDir: 'src'` 集中原生源码约定。`src/pages` 的同名 `.server.ts` 是官方 loader/action 约定，不是旧框架残留。`src/routes/api/posts/index.ts` / `[id].ts` 导出 HTTP method handlers，`_schema.ts` / `_data.ts` 以及书签 `_metadata.ts`、上传 `_presign.ts` 就近复用；下划线文件不生成端点。旧 `src/server`、Hono app/factory/zValidator/RPC client 已移除。Void 本身基于 Hono，`hono/http-exception` 仅用于标准 HTTP 错误，不再创建应用路由链。[官方项目结构](https://void.cloud/reference/structure)、[服务端路由约定](https://void.cloud/guide/server-routing)。

共享 UI、features、hooks、lib 按应用职责组织；官方说明共享代码目录不具有特殊扫描约定。孤立组件和依赖经静态导入图核对后删除，页面数据由 loader 直接传递，不再重复使用客户端 Query 读取文章。[共享代码说明](https://void.cloud/reference/structure#src)。

Void 1.1.11 的 Pages validation 在非 island 页面返回带 `errors` 的新页面 payload（HTTP 200），与直接 API validator 的 HTTP 400 区别明确。保存与评论客户端检查 `pageData.errors` 后才显示成功。通过本地集成测试确认无效输入没有改写数据库。

## 验证记录（2026-10-16）

- mise 全局与项目版本：Node 24.21.0、Bun 1.4.2；冻结安装通过。
- lint 通过（保留既有组件 warnings）、typecheck、11 项离线测试、Workers build、Worker types、git diff --check 通过。
- 开发与生产预览 HTTP suite 均通过，包含 2 篇测试发布文章时的 SSR、metadata、评论显示和 sitemap，以及原生 page-data、私有错误缓存头、API/页面 action 未授权保护、helpers 不生成静态端点与 CSRF 拒绝。
- 隔离本地 D1 的集成验证：Better Auth 注册/会话、REST 创建/更新/删除接口的鉴权与校验、原生文章保存/评论/命名创建 action、校验失败不写库、草稿 404 与 sitemap 排除。构建预览使用生产 HTTPS 配置对应的 Secure Cookie 名称验证同一临时会话。
- 真实浏览器验证开发登录、Studio 列表到编辑页导航、标题自动保存并经 API 读取确认持久化；生产预览验证文章导航与评论 SSR。
- 本地 Node 切换及依赖解析稳定后，页面热更新检查连续通过；生成入口在 dev/build 间会变化，各模式按顺序验证。
- 用户授权后，通过 Better Auth sign-out 退出保存的临时会话并确认失效；原浏览器测试标签已关闭，因此未复测菜单退出按钮。已清理剩余 5 篇测试文章、3 条评论、临时账户及其全部会话和认证记录，并删除临时凭据文件。本地数据库外键检查通过；清理后 HTTP suite 通过（0 篇发布文章），浏览器访问 `/studio/posts` 正确跳转首页。
- 未发布、未写远程 D1，Google OAuth 与 R2 成功上传未测。
