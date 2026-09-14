# Repository Guidelines

## Framework and routes

This project uses React, TanStack Start, TanStack Router, Vite, and Cloudflare Workers. Keep routes and layouts flat in `src/routes`: dots express nesting, `$id` is a dynamic parameter, and `_blog` / `_studio` are pathless layouts. `/studio/login` stays outside the authenticated layout. The Vite plugin generates `src/routeTree.gen.ts`; run development or build to regenerate it and keep the generated file out of formatting/linting.

Shared UI belongs in `src/components/ui`; blog and studio components belong in `src/components/features/blog` and `studio`. Global CSS lives in `src/styles/app.css`, static files in `public`, and Hono API handlers in `src/server/routes`, exposed by `src/routes/api.$.ts`.

## Server and data boundaries

Route loaders also execute in the browser. Put database access, credentials, and privileged SDK calls behind `createServerFn` or server route handlers. Validate untrusted server-function inputs with `.validator(...)` and enforce authorization inside each private read or mutation; a layout guard alone does not protect an endpoint.

Create a separate QueryClient for each router/request in `src/router.tsx` and use the SSR Query integration. Keep public and admin query keys separate. After mutations, invalidate the queries that own the data. Await sign-out before navigation and clear private client caches. Private HTML and redirects must return `Cache-Control: private, no-store`.

Use route `head` for metadata and return actual 404s for missing posts. Keep sitemap entries limited to published posts. Preserve existing public URLs during refactors.

## Commands and validation

Use pnpm. Check `package.json` for current scripts. Run `pnpm lint`, `pnpm typecheck`, and `pnpm build` for application changes. Lint applies safe fixes, so inspect its diff. `pnpm test` runs HTTP smoke checks against an already running service; use `TEST_BASE_URL` for a port other than 3000. Run it against both development and production services for routing, SSR, auth-boundary, or dependency changes.

For UI changes, verify the relevant flow in a real browser and include screenshots or clips when opening a PR. Report authenticated flows separately: the HTTP smoke suite does not log in or exercise successful writes, OAuth, or R2 uploads. Add focused feature tests when appropriate and record environment limitations accurately.

## Style

TypeScript is strict. Use explicit types at module boundaries, PascalCase component names, `useCamelCase` hooks, camelCase helpers, and the `~/` alias. Route filenames follow TanStack Router conventions; existing component filenames use kebab-case. Follow Oxlint/Oxfmt for two-space indentation, single quotes, import ordering, and Tailwind sorting. Use the coss registry components in `src/components/ui` and semantic color tokens. Add available components with `pnpm dlx shadcn@latest add @coss/<name>`; preserve the customized theme instead of installing `@coss/style`. See `docs/design.md` for component mappings and intentional local styling.

Visual conventions are documented in `docs/design.md`. Reference Yohaku for colors, radii, borders and soft shadows through existing semantic tokens in `src/styles/app.css`. Preserve the existing layout, content order, typography sizes and spacing unless explicitly asked to change them. Do not add document-wide font/background resets to editor stylesheets.

## Environment, migrations, and dependencies

Use `.env.example` as the variable inventory. Server variables belong in `src/lib/env.ts`; public variables belong in `src/lib/client-env.ts`. The existing `NEXT_PUBLIC_*` names remain supported by Vite for compatibility. Keep authentication URLs, local ports, and OAuth callback origins consistent. Preserve `.env` and never include secrets in commits or logs.

The schema is `src/db/schema.ts`, relations are `src/db/relations.ts`, and migrations are generated under `drizzle/d1` (the PostgreSQL files in `drizzle/migrations` are historical). Generate artifacts with `pnpm db:generate` when the schema changes. Confirm the target database before `db:migrate` or any data write. The current `DB` binding uses remote D1 even during development; use a separate binding or `remote: false` for isolated work. Dependency updates alone do not authorize changing shared data. Drizzle ORM and Kit are pinned together at `1.0.0-rc.4`. Keep `defineRelations` / Relations v2 and the official `@better-auth/drizzle-adapter/relations-v2` adapter aligned. Pass the table schema explicitly to Better Auth; pass relations, not the removed schema option, to the Drizzle connection. Validate adapter reads and relational queries when updating either package.

Update compatible dependencies and the lockfile together. Treat major upgrades and prerelease database upgrades as API migrations. Check peer warnings and document any retained versions rather than suppressing incompatibilities. For deployment changes, validate the Workers build and local preview. Read `docs/cloudflare.md` when changing Worker bindings, D1 bindings and migrations, deployment origins, secrets, or deployment commands. Worker requests must use the request-scoped Drizzle database and `getAuth()`; `scripts/auth.config.ts` is the Node-only schema CLI entry.

## Commits and PRs

Use focused conventional commits such as `feat(router): ...` or `chore(deps): ...`, with subjects under roughly 70 characters. Preserve unrelated work. PR descriptions should explain the resulting behavior, relevant issue references, validation, and any schema or environment changes.

## Historical Next.js setup

The block below is retained because the repository's original instructions require it. It applies to historical Next.js work; active application changes use the TanStack Start conventions above.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
