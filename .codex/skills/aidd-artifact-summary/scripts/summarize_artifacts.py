#!/usr/bin/env python3
"""Export deterministic AIDD artifact summaries for the dashboard."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any


PREFERRED_HEADINGS = {
    "summary",
    "요약",
    "현재 결과",
    "recommendation",
    "결과",
    "실행 결과",
}

STATUS_LABELS = {
    "done": "완료",
    "pass": "완료",
    "passed": "완료",
    "complete": "완료",
    "completed": "완료",
    "merged": "완료",
    "in progress": "진행 중",
    "running": "진행 중",
    "failed": "실패",
    "blocked": "차단",
}

ARTIFACT_LABELS = {
    "plan": "계획",
    "evidence": "증거",
    "result": "결과",
    "subagent": "Subagent 기록",
    "ledger": "단계 원장",
    "token": "토큰 기록",
    "timeline": "타임라인",
    "unknown": "기록",
}


def clean(text: str) -> str:
    text = re.sub(r"`([^`]+)`", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"[*_>#|-]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def summarize_markdown(path: Path, limit: int = 180) -> str | None:
    if not path.exists() or not path.is_file():
        return None
    lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
    chosen: list[str] = []
    capture = False

    for line in lines:
        heading = re.match(r"^#{1,4}\s+(.+?)\s*$", line)
        if heading:
            title = clean(heading.group(1)).lower()
            capture = title in PREFERRED_HEADINGS
            if chosen and not capture:
                break
            continue
        if capture and clean(line):
            chosen.append(line)
            if len(" ".join(chosen)) >= limit:
                break

    if not chosen:
        for line in lines:
            normalized = clean(line)
            if normalized and not normalized.startswith("name:") and not normalized.startswith("---"):
                chosen.append(line)
                if len(" ".join(chosen)) >= limit:
                    break

    summary = clean(" ".join(chosen))
    if not summary:
        return None
    return summary[:limit].rstrip()


def rel(path: Path, root: Path) -> str:
    return path.relative_to(root).as_posix()


def parse_markdown_table(path: Path) -> list[list[str]]:
    if not path.exists():
        return []
    rows: list[list[str]] = []
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        if not line.startswith("|"):
            continue
        cells = [cell.strip() for cell in line.strip("|").split("|")]
        if not cells or set(cells[0]) <= {"-", ":"} or cells[0] in {"단계", "Stage"}:
            continue
        rows.append(cells)
    return rows


def parse_jsonl(path: Path) -> list[dict[str, Any]]:
    events: list[dict[str, Any]] = []
    if not path.exists():
        return events
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        if not line.strip():
            continue
        try:
            events.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    return events


def issue_meta(issue_dir: Path) -> dict[str, Any]:
    raw = issue_dir / "raw-linear.md"
    text = raw.read_text(encoding="utf-8", errors="replace") if raw.exists() else ""
    def value(name: str, default: str) -> str:
        match = re.search(rf"^- {re.escape(name)}:\s*(.+)$", text, re.MULTILINE)
        if not match:
            return default
        return match.group(1).replace("`", "").strip()

    labels = [part.strip() for part in value("labels", "").split(",") if part.strip()]
    return {
        "issueId": issue_dir.name,
        "title": value("title", issue_dir.name),
        "url": value("url", ""),
        "status": display_status(value("status", "unknown")),
        "labels": labels,
        "repoPath": value("local path", "workflow/mahub-aidd-flow"),
    }


def display_status(value: str) -> str:
    normalized = clean(value).lower()
    return STATUS_LABELS.get(normalized, value)


def artifact_kind(path: Path) -> str:
    parts = set(path.parts)
    if "plan" in path.stem:
        return "plan"
    if "subagents" in parts:
        return "subagent"
    if "evidence" in parts:
        return "evidence"
    if path.name == "run-summary.md":
        return "result"
    if path.name == "stage-ledger.md":
        return "ledger"
    if path.name == "token-usage.md":
        return "token"
    if path.name == "timeline.md":
        return "timeline"
    return "unknown"


def artifact_label(kind: str) -> str:
    return ARTIFACT_LABELS.get(kind, ARTIFACT_LABELS["unknown"])


def collect_artifacts(run_dir: Path, root: Path) -> list[dict[str, Any]]:
    candidates: list[Path] = []
    if (run_dir / "subagents").exists():
        candidates.extend(sorted((run_dir / "subagents").glob("*.md")))
    if (run_dir / "evidence").exists():
        candidates.extend(sorted((run_dir / "evidence").glob("*.md")))
    candidates.extend(
        p
        for p in [run_dir / "run-summary.md", run_dir / "stage-ledger.md", run_dir / "token-usage.md", run_dir / "timeline.md"]
        if p.exists()
    )
    return [
        {
            "path": rel(path, root),
            "kind": kind,
            "label": artifact_label(kind),
            "summary": summarize_markdown(path),
        }
        for path in candidates
        for kind in [artifact_kind(path)]
    ]


def subagent_runs(events: list[dict[str, Any]], artifacts_by_path: dict[str, dict[str, Any]]) -> list[dict[str, Any]]:
    by_artifact: dict[str, dict[str, Any]] = {}
    for event in events:
        artifact = event.get("artifact")
        role = event.get("role")
        if not artifact or not role:
            continue
        row = by_artifact.setdefault(
            artifact,
            {
                "id": artifact,
                "stage": event.get("stage"),
                "role": role,
                "model": event.get("model"),
                "reasoning": event.get("reasoning"),
                "status": "unknown",
                "startedAt": None,
                "completedAt": None,
                "tokenUsage": {
                    "reportedTotalTokens": event.get("reportedTotalTokens"),
                    "availability": "reported" if event.get("reportedTotalTokens") is not None else "unavailable",
                },
                "artifact": artifacts_by_path.get(artifact),
            },
        )
        if event.get("event") == "subagent_started":
            row["startedAt"] = event.get("ts")
            row["status"] = "running"
        elif event.get("event") == "subagent_completed":
            row["completedAt"] = event.get("ts")
            row["status"] = "done"
        elif "failed" in str(event.get("event", "")):
            row["completedAt"] = event.get("ts")
            row["status"] = "failed"
    return sorted(by_artifact.values(), key=lambda item: (item.get("stage") or 999, item["role"]))


def stage_artifact_path(raw_path: str, issue_id: str, run_id: str) -> str:
    if not raw_path:
        return ""
    match = re.search(r"`([^`]+)`", raw_path)
    artifact = match.group(1) if match else raw_path.split(",", 1)[0].strip()
    if artifact.startswith(".omx/"):
        return artifact
    return f".omx/artifacts/{issue_id}/{run_id}/{artifact}"


def build_lifecycle_stages(
    *,
    issue_id: str,
    run_id: str,
    events: list[dict[str, Any]],
    ledger_rows: list[list[str]],
) -> list[dict[str, Any]]:
    by_stage: dict[int, dict[str, Any]] = {}

    for row in ledger_rows:
        if not row or not row[0].isdigit():
            continue
        stage = int(row[0])
        owner = row[2] if len(row) > 2 else ""
        roles = re.findall(r"`([^`]+)`", owner)
        by_stage[stage] = {
            "stage": stage,
            "nameKo": row[1] if len(row) > 1 else "",
            "agent": ", ".join(roles) if roles else clean(owner),
            "model": "n/a",
            "reasoning": "n/a",
            "tokenUsage": {
                "reportedTotalTokens": None,
                "availability": "unavailable",
            },
            "startedAt": None,
            "completedAt": None,
            "status": display_status(row[4] if len(row) > 4 else "unknown"),
            "artifactPath": stage_artifact_path(row[3] if len(row) > 3 else "", issue_id, run_id),
        }

    for event in events:
        event_name = str(event.get("event", ""))
        stage = event.get("stage")
        if stage is None and event_name == "linear_issue_created":
            stage = 0
        if stage is None:
            continue
        row = by_stage.setdefault(
            int(stage),
            {
                "stage": int(stage),
                "nameKo": "",
                "agent": event.get("role", "leader"),
                "model": event.get("model", "n/a"),
                "reasoning": event.get("reasoning", "n/a"),
                "tokenUsage": {
                    "reportedTotalTokens": event.get("reportedTotalTokens"),
                    "availability": "reported" if event.get("reportedTotalTokens") is not None else "unavailable",
                },
                "startedAt": None,
                "completedAt": None,
                "status": "진행 중",
                "artifactPath": stage_artifact_path(str(event.get("artifact") or ""), issue_id, run_id),
            },
        )
        if event.get("role"):
            row["agent"] = event["role"]
        if event.get("model"):
            row["model"] = event["model"]
        if event.get("reasoning"):
            row["reasoning"] = event["reasoning"]
        if event.get("artifact"):
            row["artifactPath"] = stage_artifact_path(str(event["artifact"]), issue_id, run_id)
        if event.get("reportedTotalTokens") is not None:
            row["tokenUsage"] = {
                "reportedTotalTokens": event["reportedTotalTokens"],
                "availability": "reported",
            }
        if event_name.endswith("_started") or event_name in {"linear_issue_created", "red_component_test_failed"}:
            row["startedAt"] = row["startedAt"] or event.get("ts")
        if (
            event_name == "linear_issue_created"
            or event_name.endswith("_completed")
            or event_name.endswith("_passed")
            or event_name.endswith("_merged")
        ):
            row["completedAt"] = event.get("ts")
            row["status"] = "완료"
        if "failed" in event_name and event_name != "red_component_test_failed":
            row["completedAt"] = event.get("ts")
            row["status"] = "실패"
        if event_name == "red_component_test_failed":
            row["completedAt"] = event.get("ts")
            row["status"] = "완료"

    return [by_stage[stage] for stage in sorted(by_stage)]


def export_issue(issue_dir: Path, run_id: str | None, root: Path) -> dict[str, Any]:
    runs = sorted(p for p in issue_dir.iterdir() if p.is_dir() and p.name.startswith("run-"))
    if run_id:
        runs = [issue_dir / run_id]
    latest_run = runs[-1] if runs else None
    meta = issue_meta(issue_dir)
    if latest_run is None:
        return {**meta, "currentStage": None, "stageStates": [], "runs": []}

    artifacts = collect_artifacts(latest_run, root)
    artifacts_by_short = {artifact["path"].split(f"{latest_run.name}/", 1)[-1]: artifact for artifact in artifacts}
    events = parse_jsonl(latest_run / "run.jsonl")
    ledger_rows = parse_markdown_table(latest_run / "stage-ledger.md")
    stage_states = []
    for row in ledger_rows:
        if not row or not row[0].isdigit():
            continue
        stage = int(row[0])
        stage_states.append(
            {
                "stage": stage,
                "nameKo": row[1] if len(row) > 1 else "",
                "ownerRoles": re.findall(r"`([^`]+)`", row[2] if len(row) > 2 else ""),
                "status": row[4] if len(row) > 4 else "unknown",
                "summary": clean(row[4]) if len(row) > 4 else None,
            }
        )
    completed_count = sum(1 for row in stage_states if row.get("status") in {"완료", "PASS"})
    lifecycle_stages = build_lifecycle_stages(
        issue_id=issue_dir.name,
        run_id=latest_run.name,
        events=events,
        ledger_rows=ledger_rows,
    )
    current_stage_name = lifecycle_stages[-1]["nameKo"] if lifecycle_stages else None
    return {
        **meta,
        "currentStage": max((row["stage"] for row in stage_states), default=None),
        "currentStageName": current_stage_name,
        "completedStageCount": completed_count,
        "totalStageCount": 12,
        "startedAt": events[0].get("ts") if events else None,
        "completedAt": events[-1].get("ts") if events and completed_count >= 12 else None,
        "stages": lifecycle_stages,
        "artifacts": artifacts,
        "stageStates": stage_states,
        "runs": [
            {
                "runId": latest_run.name,
                "status": "done" if completed_count >= 12 else "running",
                "startedAt": events[0].get("ts") if events else None,
                "endedAt": events[-1].get("ts") if events else None,
                "subagents": subagent_runs(events, artifacts_by_short),
                "artifacts": artifacts,
            }
        ],
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    parser.add_argument("--issue", action="append")
    parser.add_argument("--run")
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    root = Path(args.root).resolve()
    artifacts_root = root / ".omx" / "artifacts"
    issues = args.issue or sorted(p.name for p in artifacts_root.iterdir() if p.is_dir())
    snapshot = {
        "schemaVersion": 1,
        "generatedBy": "aidd-artifact-summary",
        "sourceRoot": rel(artifacts_root, root),
        "issues": [export_issue(artifacts_root / issue, args.run, root) for issue in issues],
    }

    out = Path(args.out)
    if not out.is_absolute():
        out = root / out
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(out)


if __name__ == "__main__":
    main()
