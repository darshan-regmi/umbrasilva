---
description: Plan a feature, list files to touch, wait for approval, then implement.
agent: build
---

Feature: $ARGUMENTS

Work in phases and do not skip ahead.

**Phase 1 — plan only. Do not edit any files yet.**

1. Restate the feature and the acceptance criteria in 2-3 lines.
2. List every file you will create or change, with a one-line reason each.
3. List any new dependencies (each needs my approval per AGENTS.md) and any hard-rule
   implications (URL validation, clone safety, rate limiting, "likely unused").
4. Note how you will verify it (typecheck, Biome, tests).

**Then stop and wait for my explicit approval.**

**Phase 2 — only after I approve:** implement in small steps, following the existing
patterns in the touched files, and run `/check` when finished. If the plan was wrong,
say so and re-plan instead of improvising.
