# Repository Guidelines

## Framework and directories

Use Void native React Pages on Cloudflare Workers. `void.config.ts` sets `sourceDir: 'src'`. Pages live in `src/pages`; `[id]` is dynamic and `(blog)` / `(studio)` are pathless groups. The matching `.server.ts` exports loaders/actions and may type-export `Props` with `InferProps`. `/studio/login` stays outside the authenticated group. Preserve public URLs.

HTTP endpoints live in `src/routes`, exporting named HTTP methods with `defineHandler`. Use `withValidator` for untrusted body/query/params. Co-locate endpoint-specific schemas and helpers in underscore-prefixed files; Void ignores these during route scanning. `src/routes/api/posts/_data.ts` is shared by Pages and API. Global middleware in `src/middleware` runs in numeric order. Use the native typed fetch from `void/client` for API consumers; mutations set `retry: 0`.

Shared UI belongs in `src/components/ui`; feature components belong in `src/components/features`. Editor primitives stay in `src/components/tiptap`, hooks in `src/hooks`, shared utilities in `src/lib`, styles in `src/styles`, and static files in `public`. Verify references before removing components or dependencies.

## Server, auth and data

Loaders/actions and route handlers run on the server. Keep database access and secrets there; components may import their types with `import type`. Public loaders expose only published posts. Missing posts return actual 404s; sitemap excludes drafts.

Keep Better Auth with the existing schema, admin plugin, Google provider, and Relations v2 adapter. `src/lib/auth-options.ts` is the runtime-independent configuration factory; `getAuth()` creates an instance with the request's database. Each private loader/action checks authorization; API middleware rejects unauthorized requests before validation. Private HTML, page data and redirects use `Cache-Control: private, no-store`. Await sign-out, clear private Query caches, then navigate. Void managed auth is intentionally disabled: avoid importing `void/auth`, using its client auth, or adding `src/auth.ts` / config.auth.

The first middleware creates a Drizzle database for the request and propagates it through AsyncLocalStorage. Never share a database instance between requests. Root layout creates a fresh QueryClient per SSR render; page data comes from Void props, while isolated client widgets may use Query. Successful actions refresh page props. Preserve editor state during autosave.

## Commands and checks

Use `mise.toml`: Node 24.21.0 and Bun 1.4.2. Install with `mise install` and `mise exec -- bun install --frozen-lockfile`; commit bun.lock. Run `bun run lint`, `bun run typecheck`, `bun test`, and `bun run build` for application changes. Lint applies fixes: inspect the diff. Typecheck runs `void prepare` first. Keep `.void/**`, `.void-wrangler.jsonc` and generated Worker types out of lint/formatting.

For routing, SSR, auth-boundary or dependencies, run `TEST_BASE_URL=http://localhost:3000 bun run test:http` against already-running development and production preview services. UI changes require real-browser checks and screenshots when opening a PR. Record authenticated success flows, OAuth and uploads separately from unauthenticated HTTP smoke.

## Style and UI

TypeScript is strict. Use PascalCase components, useCamelCase hooks, camelCase helpers and `~/` imports. Follow Oxlint/Oxfmt for single quotes, two-space indentation, import ordering and Tailwind sorting. Keep existing component filenames in kebab-case.

Use existing coss components and semantic color tokens. Add available components with `bunx shadcn@latest add @coss/<name>`; preserve the customized theme instead of installing `@coss/style`. Read `docs/design.md` for component mappings and intentional styling. Preserve the layout, content order, typography sizes and spacing unless asked to change them. Editor stylesheets must not add document-wide resets.

## Environment and deployment

The inventory is `docs/env.example`; the typed server schema is `src/env.ts` with `void/env`. Void rejects root dotenv files other than `.env`, so keep the template under docs. Preserve `.env` and keep secrets out of logs/commits. Public `NEXT_PUBLIC_*` compatibility stays in `src/lib/client-env.ts` and the explicit Vite build mapping; these names must not enter the server secret schema. Keep local ports, Better Auth URLs and OAuth origins consistent.

Read `docs/cloudflare.md` before changing bindings, deployment origins, secrets, migration paths or deployment commands. Configuration is `void.config.ts`; `.void-wrangler.jsonc` is generated. Dev uses local D1 in `.void`; existing production resource IDs remain explicit. Confirm target before any migration/data write. Resource or dependency changes do not authorize production writes.

Schema is `src/db/schema.ts`, relations are `src/db/relations.ts`, migrations are `drizzle/d1`. Preserve names/content and use project `db:generate` / `db:migrate*` scripts; PostgreSQL files in `drizzle/migrations` are historical. Keep ORM and Kit pinned together at `1.0.0-rc.4`. Void's bundled ORM/Kit use an incompatible migration format; avoid `void/db`, `void db push`, `void db generate` and automatic schema adoption. Keep defineRelations / Relations v2 and the official `@better-auth/drizzle-adapter/relations-v2` adapter aligned. Pass schema explicitly to Better Auth; pass relations to Drizzle. Validate adapter reads and relational queries for package changes.

`void deploy --platform cloudflare` can provision resources/apply migrations. Validate the Workers build and local preview before deployment; commit void.lock.json when generated. The Node-only schema CLI entry is `scripts/auth.config.ts`.

## Commits and PRs

Use focused conventional commits with subjects under roughly 70 characters. Preserve unrelated changes. PRs explain resulting behavior, validation, issue references and any environment/schema changes.

## Historical Next.js setup

The block below is retained because the repository's original instructions require it. It applies to historical Next.js work; active application changes use the Void native conventions above.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
