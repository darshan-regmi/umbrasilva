---
description: Run the reviewer subagent on the current git diff.
agent: reviewer
subtask: true
---

Review the current uncommitted changes. Get them with `git diff` and `git diff --staged`.

Focus on the hard rules: github.com-only URL validation, command injection in `git
clone`, temp folder cleanup, per-IP rate limiting, and the "likely unused" labelling.
Then check types and edge cases.

Report findings as a short list — each with `file:line`, severity, the risk, and a
suggested fix. Say explicitly if you find nothing.
