# 03 TDD 계획

## Canonical stage

- Stage: 3
- Lifecycle 단계: TDD 계획
- Canonical 산출물: `.omx/artifacts/KTD-9/stages/03-tdd-plan.md`

## 기존 artifact

- 구현 계획: [../implementation-plan.md](../implementation-plan.md)
- 실제 산출물: [../run-001/subagents/03-planner.md](../run-001/subagents/03-planner.md)
- run 요약: [../run-001/run-summary.md](../run-001/run-summary.md)

## 담당 subagent

| 항목 | 값 |
| --- | --- |
| 담당 | `planner` |
| 모델 | `gpt-5.5` |
| reasoning | `medium` |
| 범위 | scaffold 구현 전 실행 순서, 구현 착수 검토 루프, 완료 증거, handoff 정의 |

## 목적

KTD-9 구현 전에 TDD 순서와 완료 증거를 고정한다. 기존 산출물은 저장소 상태 확인, 기술 기준선 확인, scaffold 생성 계획, 문서화 계획, 최소 검증 계획, `/understand` 실행 조건을 정의했다.

최신 canonical workflow에서는 stage 6을 사람 승인 게이트가 아니라 구현 착수 검토 루프로 다룬다. 사람은 이슈 발행, 버그 리포팅 입력, E2E 테스트 시나리오 관리를 담당하며, stage 6의 기본 구현 진행 승인자가 아니다.

## 상태

완료. 실제 scaffold 생성, dependency 설치, `/understand` 실행, Git commit/MR 생성은 이 단계 범위에서 제외했다.

## PR 추적 메모

PR/MR 체크리스트는 이 단계의 Red/Green/Refactor 계획과 stage 6 구현 착수 검토 루프를 근거로 작성한다. 구현 단계가 테스트 기준보다 앞서지 않았다는 증거로 `03-planner.md`를 링크한다.

## Stage 6 구현 착수 검토 루프

stage 6은 `test-engineer`, `architect`, `critic`, `verifier`가 구현 착수 조건을 반복 검토하는 단계다.

| 담당 | 실패 시 되돌아갈 단계 | 검토 기준 |
|---|---:|---|
| `test-engineer` | stage 4 또는 stage 5 | 테스트 명세와 Red 실패 증거가 구현 전에 충분한지 확인한다. |
| `architect` | stage 2 또는 stage 3 | 아키텍처 결정과 TDD 계획이 구현 범위에 맞는지 확인한다. |
| `critic` | stage 1 또는 stage 3 | 요구사항 해석과 계획의 누락, 과잉 구현 위험을 확인한다. |
| `verifier` | 누락 artifact 단계 | 필수 산출물, 증거, 링크가 모두 있는지 확인한다. |

산출물은 `06-implementation-gate.md`와 `evidence/gate-review.md`로 남긴다. 기존 `run-003/subagents/06-human-gate.md`는 과거 실행 artifact로 보존하되, 앞으로의 canonical workflow에서는 subagent gate를 stage 6 기준으로 사용한다.

네 subagent가 모두 PASS하면 stage 7에서 `executor`가 최소 구현을 시작한다. E2E 시나리오는 stage 0 입력 또는 버그 리포트 입력으로 들어오며, `test-engineer`가 stage 4 테스트 명세로 변환한다.
