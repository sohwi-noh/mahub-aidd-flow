# KTD-11 Stage 11 Wiki/Graph 환류

## Knowledge summary

- AIDD dashboard KTD-11 구현은 완료됐고 GitHub PR #2가 merge됐다.
- PR #2 merge 결과는 `.omx/artifacts/KTD-11/run-001/evidence/pr-merge.md`에 기록했다.
- local run artifact는 `.omx/artifacts/KTD-11/run-001/` 아래에 유지한다.
- dashboard snapshot은 `.codex/skills/aidd-artifact-summary`로 생성한 `workflow/mahub-aidd-flow/src/generated/artifact-dashboard.json`을 사용한다.

## Wiki/Graph 기록 위치

- run 요약: `.omx/artifacts/KTD-11/run-001/run-summary.md`
- stage 원장: `.omx/artifacts/KTD-11/run-001/stage-ledger.md`
- PR/MR merge 증거: `.omx/artifacts/KTD-11/run-001/evidence/pr-merge.md`
- Wiki/Graph 환류 증거: `.omx/artifacts/KTD-11/run-001/evidence/wiki-graph.md`
- dashboard snapshot: `workflow/mahub-aidd-flow/src/generated/artifact-dashboard.json`

## Graph 보류 사유

이번 작업에서는 understand-anything graph 환류를 별도 실행하지 않았다.

- PR merge 직후에는 `aidd-artifact-summary` 기반 dashboard snapshot과 run-local artifact 정합성 기록을 먼저 고정했다.
- graph 대상이 `workflow/mahub-aidd-flow` 코드 그래프인지, `.omx/artifacts/KTD-11` workflow artifact aggregate graph인지 분리 결정이 필요하다.
- 따라서 이번 stage 11은 graph 생성 대신 보류 사유와 다음 작업을 evidence로 남기는 범위로 마감한다.

## 다음 환류 작업

- `workflow/mahub-aidd-flow` 대상으로 understand-anything code graph 생성 가능 여부를 확인한다.
- KTD-11 run artifact를 별도 knowledge/workflow graph로 만들지 결정한다.
- graph를 생성하면 경로와 생성 명령을 다음 run evidence에 기록한다.
- graph를 계속 보류하면 보류 사유를 `evidence/wiki-graph.md`에 갱신한다.
