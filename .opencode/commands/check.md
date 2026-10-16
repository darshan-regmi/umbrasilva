---
description: Run typecheck, Biome, and tests, then summarize failures.
agent: build
---

Run these from the repo root, in order, and stop at the first failure is NOT required —
run all three so every problem surfaces:

1. `pnpm check-types`
2. `pnpm lint`
3. `pnpm test`

Then summarize: which steps passed/failed, and for each failure the `file:line`, the
exact error, and a one-line suggested fix. Do not fix anything unless I ask.
