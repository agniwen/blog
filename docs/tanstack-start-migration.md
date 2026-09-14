# TanStack Start 迁移记录

这是迁移时的历史验证记录，当前开发与部署方式以 [README](../README.md) 为准。

## 2026-09-14 框架迁移

2026-09-14：lint 通过（18 条现有组件警告），类型检查、生产构建 通过；开发服务与 Node 生产服务均通过 HTTP 冒烟测试 的 20 项 HTTP 检查，覆盖当前 4 篇公开文章。浏览器验证了首页、列表、详情、前进/后退、刷新及登录页；未发现浏览器应用错误。客户端 40 个 JS/HTML/JSON 产物扫描未发现环境中的敏感值。

实际管理员登录后的写入、OAuth 和 R2 上传未执行。依赖仍保留既有 Better Auth / Drizzle beta 的 peer 范围警告；数据库版本未随框架迁移升级。Next.js 已从直接依赖和应用代码中移除；当前锁文件仍包含 Better Auth 的可选 Next.js peer，不参与应用构建入口。

## 2026-09-14 后续依赖更新

前一节是升级前的历史快照。随后完成兼容依赖更新，并将 Drizzle ORM / Kit 升至 `1.0.0-rc.4`，使用 Better Auth 1.7.4 的 Relations v2 官方适配器，消除了原有 Drizzle peer 警告。具体当前版本与验证范围见 README。数据库结构与迁移文件未改动。

## 2026-09-14 D1 切换

运行环境统一为 Cloudflare Workers，数据库改为 Drizzle D1 / SQLite。PostgreSQL 历史迁移保留，现行迁移在 `drizzle/d1`。当前架构、数据导入与验证记录见 [Cloudflare 部署说明](cloudflare.md)；上述构建验证仅代表切换前的历史版本。
