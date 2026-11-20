# Repository Guidelines

## Framework and routes

This project uses React, TanStack Start, TanStack Router, Vite, and Cloudflare Workers. Keep routes and layouts flat in `src/routes`: dots express nesting, `$id` is a dynamic parameter, and `_blog` / `_studio` are pathless layouts. `/studio/login` stays outside the authenticated layout. The Vite plugin generates `src/routeTree.gen.ts`; run development or build to regenerate it and keep the generated file out of formatting/linting.

Shared UI belongs in `src/components/ui`; feature components belong in `src/components/features`. Editor primitives stay in `src/components/tiptap`, hooks in `src/hooks`, shared utilities in `src/lib`, styles in `src/styles`, and static files in `public`. Hono API handlers live in `src/server/routes`, exposed by `src/routes/api.$.ts`. Verify references before removing components or dependencies.

## Server, auth and data

Route loaders also execute in the browser. Put database access, credentials, and privileged SDK calls behind `createServerFn` or Hono server route handlers. Validate untrusted server-function inputs with `.validator(...)` and enforce authorization inside each private read or mutation; a layout guard alone does not protect an endpoint. Public loaders expose only published posts. Missing posts return actual 404s; sitemap excludes drafts.

Keep Better Auth with the existing schema, admin plugin, Google provider, and Relations v2 adapter. `src/lib/auth-options.ts` is the runtime-independent configuration factory; `getAuth()` creates an instance with the request's database. API `authMiddleware` enforces same-origin CSRF checks and admin authorization (`user?.role === 'admin'`) before validation. Private HTML, API responses and redirects use `Cache-Control: private, no-store`.

`src/worker.ts` creates a Drizzle database per request and propagates it through `AsyncLocalStorage` (`requestDatabase`). Never share a database instance between requests. Create a separate QueryClient for each router/request in `src/router.tsx` and use the SSR Query integration. Keep public and admin query keys separate. After mutations, invalidate the queries that own the data. Await sign-out, clear private Query caches, then navigate. Preserve editor state during autosave.

Use route `head` for metadata and preserve existing public URLs during refactors.

## Commands and checks

Use `mise.toml`: Node 24.21.0 and Bun 1.4.2. Install with `mise install` and `mise exec -- bun install --frozen-lockfile`; commit `bun.lock`. Run `bun run lint`, `bun run typecheck`, `bun test`, and `bun run build` for application changes. Lint applies safe fixes: inspect the diff. Keep `src/routeTree.gen.ts`, `.tanstack/**`, `.wrangler/**`, and generated Worker types out of lint/formatting.

For routing, SSR, auth-boundary or dependency changes, run `TEST_BASE_URL=http://localhost:3000 bun run test:http` against already-running development and production preview services. UI changes require real-browser checks and screenshots when opening a PR. Record authenticated success flows, OAuth and uploads separately from unauthenticated HTTP smoke.

## Style and UI

TypeScript is strict. Use explicit types at module boundaries, PascalCase components, `useCamelCase` hooks, camelCase helpers and `~/` imports. Follow Oxlint/Oxfmt for single quotes, two-space indentation, import ordering and Tailwind sorting. Route filenames follow TanStack Router conventions; keep existing component filenames in kebab-case.

Use existing coss components and semantic color tokens. Add available components with `bunx shadcn@latest add @coss/<name>`; preserve the customized theme instead of installing `@coss/style`. Read `docs/design.md` for component mappings and intentional styling. Preserve the layout, content order, typography sizes and spacing unless asked to change them. Editor stylesheets must not add document-wide resets.

## Environment and deployment

Use `.env.example` as the variable inventory. Server variables belong in `src/lib/env.ts`; public `NEXT_PUBLIC_*` compatibility stays in `src/lib/client-env.ts` and `.env.cloudflare` (never in the server secret schema). Keep local ports, Better Auth URLs and OAuth origins consistent. Preserve `.env` and keep secrets out of logs/commits.

Read `docs/cloudflare.md` before changing bindings, deployment origins, secrets, migration paths or deployment commands. Configuration is `wrangler.jsonc`. Both `bun run dev` and preview always connect to the remote D1 `blog` binding (`remoteBindings: true` in `vite.config.ts`, `"remote": true` in `wrangler.jsonc`); do not use a local D1 database. Existing production resource IDs remain explicit. Mutations in dev write to live data—confirm target before any `db:migrate` or data write. Resource or dependency changes do not authorize production writes.

Schema is `src/db/schema.ts`, relations are `src/db/relations.ts`, migrations are `drizzle/d1`. Preserve names/content and use `db:generate` / `db:migrate`; PostgreSQL files in `drizzle/migrations` are historical. Keep ORM and Kit pinned together at `1.0.0-rc.4`. Keep `defineRelations` / Relations v2 and the official `@better-auth/drizzle-adapter/relations-v2` adapter aligned. Pass schema explicitly to Better Auth; pass relations to Drizzle. Validate adapter reads and relational queries for package changes. The Node-only schema CLI entry is `scripts/auth.config.ts` (keeps `remoteBindings: false` strictly for offline schema generation).

## Commits and PRs

Use focused conventional commits with subjects under roughly 70 characters. Preserve unrelated changes. PRs explain resulting behavior, validation, issue references and any environment/schema changes.

## Historical Next.js setup

The block below is retained because the repository's original instructions require it. It applies to historical Next.js work; active application changes use the TanStack Start conventions above.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
