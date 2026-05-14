# KTD-9 canonical stage index 보정 기록

## 단계 정보

| 항목 | 값 |
| --- | --- |
| 단계명 | Artifact bookkeeping canonicalization |
| 사용 subagent | `writer` |
| 모델 | `gpt-5.5` |
| reasoning effort | `high` |
| 상태 | completed |

## 목적

KTD-9의 `run-001`, `run-002`, `run-003`이 lifecycle 단계 번호처럼 읽히는 혼선을 보정한다. 이번 보정은 기존 run artifact를 이동하거나 삭제하지 않고, canonical stage index와 `stages/` entrypoint 문서를 추가해 stage 번호와 run 회차를 분리한다.

## 변경 파일 목록

| 경로 | 변경 내용 |
| --- | --- |
| `.omx/artifacts/KTD-9/stage-index.md` | stage 0-11 canonical mapping과 run/stage 구분 설명 추가 |
| `.omx/artifacts/KTD-9/stages/01-requirements.md` | 요구사항 정리 canonical entrypoint 추가 |
| `.omx/artifacts/KTD-9/stages/02-architecture.md` | 아키텍처 정리 canonical entrypoint 추가 |
| `.omx/artifacts/KTD-9/stages/03-tdd-plan.md` | TDD 계획 canonical entrypoint 추가 |
| `.omx/artifacts/KTD-9/stages/04-test-spec.md` | 테스트 명세 canonical entrypoint 추가 |
| `.omx/artifacts/KTD-9/stages/05-implementation.md` | 최소 구현 canonical entrypoint 추가 |
| `.omx/artifacts/KTD-9/stages/06-refactor.md` | 리팩터링 canonical entrypoint 추가 |
| `.omx/artifacts/KTD-9/stages/07-verification.md` | 검증 canonical entrypoint 추가 |
| `.omx/artifacts/KTD-9/stages/08-review.md` | 리뷰 canonical entrypoint 추가 |
| `.omx/artifacts/KTD-9/stages/09-mr.md` | MR 환류 canonical entrypoint 추가 |
| `.omx/artifacts/KTD-9/stages/10-knowledge.md` | Wiki/Graph/Knowledge 환류 canonical entrypoint 추가 |
| `.omx/artifacts/KTD-9/run-003/subagents/13-stage-canonicalization.md` | 이번 보정의 subagent/model/reasoning, 변경 목록, 보정 원칙 기록 |

## 보정 원칙

- 기존 `run-*` artifact는 실행 회차 기록으로 보존한다.
- 기존 artifact를 이동하거나 삭제하지 않는다.
- canonical stage 문서는 기존 artifact로 링크만 만든다.
- stage 0, stage 5, stage 6은 사용자가 지정한 기존 artifact를 `stage-index.md`에서 명확히 다룬다.
- stage 1-4와 7-11은 `stages/` 아래 numbered markdown 파일을 canonical entrypoint로 둔다.
- 각 canonical stage 파일은 실제 기존 artifact 경로, 담당 subagent/model/reasoning, 목적, 상태, PR 추적 메모를 포함한다.
- 모든 Markdown은 저장소 정책에 따라 한국어로 작성한다.

## 검증 메모

작성 전 기존 artifact 경로와 주요 메타데이터를 확인했다. 이번 작업은 문서 링크/reference 보정만 수행했으며 기존 run artifact의 위치와 내용은 변경하지 않았다.
