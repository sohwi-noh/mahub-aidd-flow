# Subagent Workflow 관측 설계

## 목적

Linear 이슈 하나가 분석, 계획, 구현, 검증, MR로 흘러가는 동안 어떤 subagent가 언제 시작했고 언제 끝났는지, 어떤 계획과 증거와 결과를 남겼는지 한눈에 확인할 수 있게 만든다.

## 저장 위치

이슈별 실행 기록은 `.omx/artifacts/<ISSUE-ID>/run-<NNN>/` 아래에 저장한다.

```text
.omx/artifacts/KTD-9/run-001/
├── run.jsonl
├── run-summary.md
├── timeline.md
├── token-usage.md
├── evidence/
└── subagents/
    ├── 01-analyst.md
    ├── 02-architect.md
    ├── 03-planner.md
    ├── 04-executor.md
    ├── 05-test-engineer.md
    ├── 06-verifier.md
    ├── 07-code-reviewer.md
    └── 08-git-master.md
```

## 실행 이벤트 스키마

`run.jsonl`은 한 줄에 하나의 이벤트를 기록한다.

```json
{
  "runId": "KTD-9-run-001",
  "issueId": "KTD-9",
  "event": "subagent.completed",
  "agent": "analyst",
  "displayName": "Intake Analyst",
  "model": "gpt-5.5",
  "reasoningEffort": "medium",
  "startedAt": "2026-05-11T13:16:39Z",
  "endedAt": "2026-05-11T13:20:00Z",
  "status": "completed",
  "planPath": ".omx/artifacts/KTD-9/run-001/subagents/01-analyst.md",
  "resultPath": ".omx/artifacts/KTD-9/run-001/subagents/01-analyst.md",
  "evidencePaths": [
    ".omx/artifacts/KTD-9/00-intake.md",
    ".omx/artifacts/KTD-9/raw-linear.md"
  ],
  "tokenUsage": {
    "reportedInputTokens": null,
    "reportedOutputTokens": null,
    "reportedTotalTokens": null,
    "estimatedVisibleTokens": 0,
    "source": "estimated",
    "note": "현재 Codex App native subagent API는 per-agent 정확 토큰 사용량을 노출하지 않는다."
  }
}
```

## 토큰 사용량 정책

- `reported*Tokens`: Codex/OMX가 정확값을 제공하면 기록한다.
- `estimatedVisibleTokens`: 정확값이 없을 때 산출물 텍스트 기준으로 대략 추정한다.
- `source`: `reported`, `estimated`, `unavailable` 중 하나를 쓴다.
- 현재 이 프로젝트에서는 per-subagent 정확 토큰이 노출되지 않으므로, 초기 run은 `estimated`로 표시한다.

## 화면에서 보는 방법

- 사람용 요약: `run-summary.md`
- 단계별 흐름: `timeline.md`
- 토큰 표: `token-usage.md`
- 원문 산출물: `subagents/*.md`

## Dashboard 구현 저장소

관제 화면은 제품 frontend인 `mahub-web`에 섞지 않고 별도 frontend repo인 `mahub-aidd-flow`에서 구현한다.

| 로컬 경로 | GitHub | 역할 |
|---|---|---|
| `workflow/mahub-aidd-flow` | `https://github.com/sohwi-noh/mahub-aidd-flow` | 이슈 stage, subagent, evidence, token, PR/MR 환류 상태를 보여주는 AIDD workflow dashboard |

이 dashboard는 `stage-index.md`를 stage schema로 읽고, 실제 진행률과 증거는 각 `.omx/artifacts/<ISSUE-ID>/run-*` 디렉터리에서 aggregate한다.

## Subagent 기본 매핑

| 순서 | 표시 이름 | 실제 agent | 모델 | Reasoning | 산출물 |
|---:|---|---|---|---|---|
| 1 | Intake Analyst | `analyst` | `gpt-5.5` | medium | `01-analyst.md` |
| 2 | Architecture Mapper | `architect` | `gpt-5.5` | high | `02-architect.md` |
| 3 | Implementation Planner | `planner` | `gpt-5.5` | medium | `03-planner.md` |
| 4 | Executor | `executor` | `gpt-5.5` | medium | `04-executor.md` |
| 5 | Test Engineer | `test-engineer` | `gpt-5.5` | medium | `05-test-engineer.md` |
| 6 | Verifier | `verifier` | `gpt-5.5` | high | `06-verifier.md` |
| 7 | Code Reviewer | `code-reviewer` | `gpt-5.5` | high | `07-code-reviewer.md` |
| 8 | Git Master | `git-master` | `gpt-5.5` | high | `08-git-master.md` |
