# AGENTS.md

Umbrasilva visualizes a JS/TS project's dependency graph as a forest. Each package is a
tree; unused dependencies are drawn as dead, shaded trees. The user submits a public
GitHub URL. The server clones it into a temp folder, parses the lockfile, runs depcheck,
always deletes the temp folder, and returns the graph.

Stack: Next.js (App Router), TypeScript, Tailwind, tRPC, Biome, Lefthook, evlog, Docker.
D3 is used only for layout math (`d3.hierarchy` / `d3.tree`); React owns the DOM. No
database, no auth in v1.

## Package manager

pnpm (`packageManager: pnpm@12.9.1`). Always use `pnpm` — never npm, yarn, or bun.

## Commands

| Task | Command |
| --- | --- |
| Dev (all apps) | `pnpm dev` |
| Dev (web only) | `pnpm dev:web` |
| Build | `pnpm build` |
| Lint (check) | `pnpm lint` |
| Format (write) | `pnpm format` |
| Auto-fix lint + format | `pnpm check` |
| Typecheck | `pnpm check-types` |
| Test | `pnpm test` |
| Docker build | `pnpm docker:build` |
| Docker up | `pnpm docker:up` |

## Folder map

```
umbrasilva/
├── apps/web/                     Next.js App Router app (port 3001)
│   ├── src/app/                  routes, layout, page
│   ├── src/app/api/trpc/[trpc]/  tRPC HTTP handler
│   ├── src/components/           app-level components
│   ├── src/lib/evlog.ts          structured logging
│   └── Dockerfile                standalone build → node:24-slim
├── packages/api/                 tRPC routers, context, business logic
├── packages/ui/                  shared shadcn/ui primitives + globals.css
├── packages/config/              shared tsconfig base
└── .opencode/                    OpenCode agents and commands
```

## Code conventions

- TypeScript strict, ESM, tabs, double quotes. Biome owns formatting and imports —
  run `pnpm check`, do not hand-format.
- Next.js App Router. Server Components by default; add `"use client"` only when needed.
- tRPC v11 for all client/server data. Define routers in `packages/api`.
- D3 only for layout math. Never let D3 touch the DOM; React renders nodes and edges.
- UI primitives come from `@umbrasilva/ui/components/*`.
- Env via the Varlock-generated `ENV` accessor (`src/env.ts`). Never read `process.env`
  directly in app code.
- Log with evlog wide events, never `console.log`.
- No new dependencies without asking.

## Hard rules

1. **Only github.com URLs.** Validate with a strict URL parser (`new URL()` + hostname
   check), never a regex on the raw string.
2. **Clone safely.** `git clone --depth 1`, a timeout on clone and on depcheck, and
   delete the temp folder in a `finally` block no matter what.
3. **Rate-limit** the analyze endpoint per IP.
4. **Never trust depcheck.** `require(variable)` results are uncertain — label unused
   dependencies **"likely unused"**, never "unused".
5. **Docker installs git** (the runner clones repos). Next.js output is `standalone`.
6. **No persistence** (no localStorage-style storage) and **no new dependencies**
   without asking.

## Definition of done

- [ ] `pnpm check-types` passes
- [ ] `pnpm lint` is clean (`pnpm check` applies fixes)
- [ ] `pnpm test` passes
- [ ] No `console.log` (use evlog)
- [ ] Temp clone folders are cleaned up (`finally`); no stray `.tmp/`
- [ ] Rebuild Docker if `Dockerfile` or `next.config.ts` changed

## Workflow

1. Plan before editing. For anything non-trivial, use `/feature <name>`.
2. Make small, focused commits.
3. Run `/check` before calling a task done.
