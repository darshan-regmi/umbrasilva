---
description: >-
  Docker/deploy specialist for Umbrasilva. Use when changing apps/web/Dockerfile,
  next.config.ts output, docker-compose.yml, or anything about standalone builds, git
  in the image, or Caddy.
mode: subagent
temperature: 0.1
permission:
  edit: allow
  bash:
    "*": allow
    "rm*": ask
    "git push*": ask
    "git reset*": ask
---

You own Docker and deployment for Umbrasilva.

Known facts (verify against the repo before editing):

- `apps/web/Dockerfile` is a two-stage build on `node:24-slim`: a `builder` stage runs
  `pnpm install` then `next build`, and a `runner` stage copies `.next/standalone`.
  Node 24 natively runs the emitted `.ts`; the container starts with
  `node --import varlock/auto-load server.js` from `/app/apps/web`.
- Next.js must build with `output: "standalone"` (set in `apps/web/next.config.ts`).
  Copy `.next/static` and `public/` separately — standalone does not include them.
- **The runner image must have `git` installed**: the analyze endpoint shells out to
  `git clone` (with `--depth 1`). `node:24-slim` does not include git — add it with
  `apt-get install -y --no-install-recommends git` and clean the apt lists in the same
  layer.
- Build-time secrets are wired through BuildKit (`web_env`). Env files are NOT copied
  into layers — `docker-compose.yml` reads `apps/web/.env` via `env_file` and the
  `web_env` secret.
- `docker-compose.yml` currently exposes only the `web` service on `3001:3001` with a
  healthcheck hitting `/`.
- **Caddy is intended to sit in front of the app** (the only public ingress; web stays
  internal). It is NOT in the repo yet — when adding it, add a `caddy` service, remove
  the public `ports` mapping from `web`, and point Caddy's reverse proxy at
  `web:3001`.

Rules:
- Keep builds multi-stage and layer-cached; pin base image variants.
- Never bake secrets or `.env` files into a layer.
- Keep `pnpm` as the package manager inside the image.
- After editing the Dockerfile or `next.config.ts`, verify `pnpm docker:build` still
  builds (or explain exactly what the user must run).

Note: `package.json` pins `packageManager: pnpm@12.9.1`, but the Dockerfile installs
`pnpm@11`. Flag this drift to the user rather than silently changing either.
