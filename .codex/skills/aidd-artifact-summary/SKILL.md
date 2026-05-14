---
name: aidd-artifact-summary
description: Generate deterministic summaries and dashboard-ready JSON from AIDD .omx artifact markdown. Use when building or refreshing the AIDD workflow dashboard, when a run needs plan/evidence/result markdown paths summarized without manual writing, or when KTD issue artifacts must be exported for UI display.
---

# AIDD Artifact Summary

## Workflow

Use this skill when dashboard data must come from `.omx/artifacts/<ISSUE-ID>/run-*` without hand-written summaries.

1. Identify the workspace root that contains `.omx/artifacts`.
2. Run `scripts/summarize_artifacts.py` for the target issue/run or for all issues.
3. Use the generated JSON as build-time dashboard input.
4. Treat token values as `unavailable` when source artifacts expose `null` or omit the value. Do not infer real token usage.

## Summary Rules

Summaries must be deterministic and source-bound:

- Prefer content under headings named `Summary`, `요약`, `현재 결과`, `Recommendation`, `결과`.
- If those headings are missing, use the first meaningful paragraph or bullet.
- Strip markdown markers and collapse whitespace.
- Keep summaries concise enough for table/detail panels.
- Return `null` when no meaningful source text exists.

## Script

Run:

```bash
python3 .codex/skills/aidd-artifact-summary/scripts/summarize_artifacts.py \
  --root . \
  --issue KTD-11 \
  --run run-001 \
  --out workflow/mahub-aidd-flow/src/generated/artifact-dashboard.json
```

The script writes JSON with issue metadata, stage rows, subagent runs, artifact paths, and summaries.

## Guardrails

- Do not modify E2E tests, E2E scenarios, E2E fixtures, mocks, or helpers.
- Do not write run-specific facts into `stage-index.md`.
- Do not summarize from memory; only summarize files that exist under the selected artifact directory.
- Do not display estimated token usage as reported token usage.
