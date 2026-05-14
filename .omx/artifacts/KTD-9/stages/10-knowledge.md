# 10 Knowledge

## Canonical stage

- Stage: 11
- Lifecycle 단계: MR/Wiki/Graph 환류 중 Wiki/Graph/Knowledge
- Canonical 산출물: `.omx/artifacts/KTD-9/stages/10-knowledge.md`

## 기존 artifact

- graph 환류 기록: [../run-003/evidence/graph.md](../run-003/evidence/graph.md)
- PR/Wiki/Graph 환류 기록: [../run-003/subagents/11-mr-wiki-graph.md](../run-003/subagents/11-mr-wiki-graph.md)
- PR 대상 저장소 보정: [../run-003/subagents/11-pr-target-update.md](../run-003/subagents/11-pr-target-update.md)
- 전체 감사 원장: [../run-003/stage-ledger.md](../run-003/stage-ledger.md)

## 담당 subagent

| 항목 | 값 |
| --- | --- |
| 담당 | `writer`, 후속 보정 `git-master` |
| 모델 | `gpt-5.5` |
| reasoning | `high` |
| 상태 | completed |

## 목적

KTD-9의 PR/Wiki/Graph 환류 상태와 다음 knowledge graph 실행 기준을 정리한다. 기존 기록은 run-003에서 `/understand` graph를 실행하지 않았고, scaffold 기준 고정 후 run-004에서 대상 저장소별 graph를 생성하는 전략을 남겼다.

## 상태

완료. graph 생성은 누락이 아니라 의도적 보류로 기록되어 있다.

## PR 추적 메모

run-004에서 `mahub-api` backend graph와 `mahub-web` frontend graph를 각각 생성한다. 두 저장소를 함께 감사해야 하면 `boundary` aggregate graph를 별도 생성하되 실제 코드 PR graph와 구분한다.
