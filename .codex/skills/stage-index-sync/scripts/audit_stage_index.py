#!/usr/bin/env python3
"""Audit AIDD run artifacts against canonical stages and run-local ledgers."""

from __future__ import annotations

import argparse
import json
import re
from datetime import datetime
from pathlib import Path


CORE_FILES = ["run-summary.md", "stage-ledger.md", "run.jsonl", "timeline.md", "token-usage.md"]


def rel(path: Path, base: Path) -> str:
    return path.relative_to(base).as_posix()


def latest_issue(root: Path) -> str:
    artifacts = root / ".omx" / "artifacts"
    issues = sorted(p.name for p in artifacts.iterdir() if p.is_dir())
    if not issues:
        raise SystemExit("No issue artifact directories found under .omx/artifacts")
    return issues[-1]


def latest_run(issue_dir: Path) -> str:
    runs = sorted(p.name for p in issue_dir.iterdir() if p.is_dir() and p.name.startswith("run-"))
    if not runs:
        raise SystemExit(f"No run-* directories found under {issue_dir}")
    return runs[-1]


def mentioned(text: str, run_id: str, artifact: Path, issue_dir: Path) -> bool:
    relative_to_issue = rel(artifact, issue_dir)
    return relative_to_issue in text or f"{run_id}/{artifact.name}" in text or artifact.name in text


def stage_numbers(markdown: str) -> set[int]:
    numbers: set[int] = set()
    for line in markdown.splitlines():
        match = re.match(r"\|\s*(\d+)\s*\|", line)
        if match:
            numbers.add(int(match.group(1)))
    return numbers


def jsonl_has_event(path: Path, event_name: str) -> bool:
    if not path.exists():
        return False
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        try:
            event = json.loads(line)
        except json.JSONDecodeError:
            continue
        if event.get("event") == event_name:
            return True
    return False


def render_report(root: Path, issue: str, run: str) -> tuple[str, dict[str, object]]:
    issue_dir = root / ".omx" / "artifacts" / issue
    run_dir = issue_dir / run
    stage_index = issue_dir / "stage-index.md"
    if not stage_index.exists():
        raise SystemExit(f"Missing stage-index.md: {stage_index}")
    if not run_dir.exists():
        raise SystemExit(f"Missing run directory: {run_dir}")

    stage_text = stage_index.read_text(encoding="utf-8")
    ledger_path = run_dir / "stage-ledger.md"
    summary_path = run_dir / "run-summary.md"
    jsonl_path = run_dir / "run.jsonl"
    run_local_text = ""
    for path in [ledger_path, summary_path, jsonl_path]:
        if path.exists():
            run_local_text += "\n" + path.read_text(encoding="utf-8", errors="replace")

    subagents = sorted((run_dir / "subagents").glob("*")) if (run_dir / "subagents").exists() else []
    evidence = sorted((run_dir / "evidence").glob("*")) if (run_dir / "evidence").exists() else []
    core_presence = {name: (run_dir / name).exists() for name in CORE_FILES}

    unmentioned_subagents = [rel(p, issue_dir) for p in subagents if p.is_file() and not mentioned(run_local_text, run, p, issue_dir)]
    unmentioned_evidence = [rel(p, issue_dir) for p in evidence if p.is_file() and not mentioned(run_local_text, run, p, issue_dir)]
    canonical_stages = stage_numbers(stage_text)
    run_stages = stage_numbers(ledger_path.read_text(encoding="utf-8")) if ledger_path.exists() else set()
    undefined_run_stages = sorted(run_stages - canonical_stages)
    synced = jsonl_has_event(run_dir / "run.jsonl", "stage_index_synced")

    data = {
        "issue": issue,
        "run": run,
        "stageIndex": rel(stage_index, root),
        "runDir": rel(run_dir, root),
        "corePresence": core_presence,
        "unmentionedSubagentsInRunLocalDocs": unmentioned_subagents,
        "unmentionedEvidenceInRunLocalDocs": unmentioned_evidence,
        "canonicalStages": sorted(canonical_stages),
        "runStages": sorted(run_stages),
        "undefinedRunStages": undefined_run_stages,
        "hasStageIndexSyncedEvent": synced,
    }

    lines = [
        f"# stage-index audit: {issue} {run}",
        "",
        f"- generated_at: {datetime.now().astimezone().isoformat(timespec='seconds')}",
        f"- stage_index: `{data['stageIndex']}`",
        f"- run_dir: `{data['runDir']}`",
        "",
        "## Core files",
    ]
    for name, exists in core_presence.items():
        lines.append(f"- `{name}`: {'present' if exists else 'missing'}")

    lines += [
        "",
        "## Stage schema check",
        f"- canonical stages: {sorted(canonical_stages)}",
        f"- run stages: {sorted(run_stages)}",
        f"- run stages missing from canonical stage-index: {undefined_run_stages or 'none'}",
        "",
        "## Run-local unmentioned subagent artifacts",
    ]
    lines += [f"- `{item}`" for item in unmentioned_subagents] or ["- none"]

    lines += ["", "## Run-local unmentioned evidence artifacts"]
    lines += [f"- `{item}`" for item in unmentioned_evidence] or ["- none"]

    lines += [
        "",
        "## run.jsonl",
        f"- `stage_index_synced` event: {'present' if synced else 'missing'}",
        "",
        "## Suggested action",
    ]
    if unmentioned_subagents or unmentioned_evidence or undefined_run_stages or not synced or not all(core_presence.values()):
        lines.append("- Patch run-local `stage-ledger.md`, `run-summary.md`, sync evidence, and `run.jsonl`. Patch `stage-index.md` only for real schema/policy changes.")
    else:
        lines.append("- No required sync action found.")

    return "\n".join(lines) + "\n", data


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".", help="workspace root")
    parser.add_argument("--issue", help="issue id, e.g. KTD-9")
    parser.add_argument("--run", help="run id, e.g. run-004")
    parser.add_argument("--write-evidence", action="store_true")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    issue = args.issue or latest_issue(root)
    issue_dir = root / ".omx" / "artifacts" / issue
    run = args.run or latest_run(issue_dir)

    report, _ = render_report(root, issue, run)
    if args.write_evidence:
        evidence_dir = issue_dir / run / "evidence"
        evidence_dir.mkdir(parents=True, exist_ok=True)
        out = evidence_dir / "stage-index-audit.md"
        out.write_text(report, encoding="utf-8")
        print(out)
    else:
        print(report, end="")


if __name__ == "__main__":
    main()
