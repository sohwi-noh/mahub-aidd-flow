---
name: stage-index-sync
description: Reconcile AIDD workflow artifacts against the issue-level canonical stage schema after a run finishes without stuffing per-run evidence into `stage-index.md`. Use when a workflow run, subagent sequence, PR/MR creation, evidence collection, token ledger, or stage-ledger update has completed and Codex must compare the new `run-*` artifacts against the canonical stage index, keep run details in run-local ledgers, and record a sync event.
---

# Stage Index Sync

## Purpose

Keep the canonical stage index aligned with the workflow schema while keeping run-specific evidence in run-local files. Run this at the end of every issue workflow before reporting completion.

## Workflow

1. Identify `ISSUE_ID` and `RUN_ID`.
   - Default from the latest `.omx/artifacts/<ISSUE_ID>/run-*` directory if the user does not name them.
   - Confirm `.omx/artifacts/<ISSUE_ID>/stage-index.md` exists.
2. Run the audit script:

   ```bash
   python3 .codex/skills/stage-index-sync/scripts/audit_stage_index.py --issue KTD-9 --run run-004 --root .
   ```

   Add `--write-evidence` to write `evidence/stage-index-audit.md`.

3. Compare the audit with `stage-index.md` and the run-local ledger.
   - `stage-index.md` should define stages, policies, and numbering semantics only.
   - Do not add every PR, evidence file, or subagent artifact to `stage-index.md`.
   - Every new subagent artifact should be referenced in the run-local `stage-ledger.md`, `run-summary.md`, or `run.jsonl`, or explicitly documented as a timeout/delegated/obsolete artifact.
   - Every important evidence file should be linked from the run-local stage ledger or summary.
   - `run-*` numbering must not be treated as lifecycle stage numbering.
   - If subagent file numbers exceed stage numbers, add an explanation rather than creating fake stages.
4. Patch canonical docs.
   - Update `.omx/artifacts/<ISSUE_ID>/stage-index.md` only when the canonical stage schema, stage names, stage policies, or numbering rules changed.
   - Update `run-<NNN>/stage-ledger.md` when the run ledger omits stage 0, stage status, or the numbering explanation.
   - Add `run-<NNN>/evidence/stage-index-sync.md` or update the audit evidence with what changed.
5. Update the event log.
   - Append a `stage_index_synced` event to `run-<NNN>/run.jsonl`.
   - Validate with `jq -c . run-<NNN>/run.jsonl`.
6. Final check.
   - Re-run the audit script.
   - Report remaining unreferenced artifacts only if intentional or blocked.

## Canonical Rules

- `stage-index.md` owns lifecycle semantics.
- `run-*/` directories own execution history.
- `stage-ledger.md` owns the mapping from one run to stages.
- `run-summary.md`, `run.jsonl`, and `evidence/` own PR/result details.
- `subagents/NN-*` file prefixes are run-local artifact order, not canonical stage numbers.
- Never use `stage-index.md` as a PR/evidence database. It must scale to hundreds or thousands of PRs.
- Do not renumber historical artifacts to make them look cleaner.
- Do not delete or move existing run artifacts to fix bookkeeping drift.
- Prefer adding links, notes, and sync evidence over rewriting history.

## Script Output

`scripts/audit_stage_index.py` reports:

- discovered issue/run paths
- core run files present or missing
- subagent artifacts not mentioned in run-local ledger/summary/log
- evidence artifacts not mentioned in run-local ledger/summary/log
- run stage numbers not defined by canonical `stage-index.md`
- whether `run.jsonl` contains `stage_index_synced`
- suggested next actions
