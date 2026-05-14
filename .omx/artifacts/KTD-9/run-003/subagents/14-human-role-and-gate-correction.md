# KTD-9 사람 역할과 stage 6 gate 보정 기록

## 단계 정보

| 항목 | 값 |
| --- | --- |
| 단계명 | 사람 역할과 구현 착수 gate 보정 |
| 사용 subagent | `writer` |
| 모델 | `gpt-5.5` |
| reasoning effort | `high` |
| 상태 | completed |

## 목적

KTD-9 canonical workflow에서 사람 역할과 stage 6의 책임을 분리한다. 사람은 이슈 발행, 버그 리포팅 입력, E2E 테스트 시나리오 관리를 담당하며, stage 6의 기본 구현 진행 승인자가 아니다.

stage 6은 앞으로 `test-engineer`, `architect`, `critic`, `verifier`가 구현 착수 조건을 반복 검토하는 subagent gate로 운영한다.

## 변경 파일 목록

| 경로 | 변경 내용 |
| --- | --- |
| `.omx/artifacts/KTD-9/stage-index.md` | 사람 역할 경계, stage 6 이름, 담당 subagent, canonical 산출물, 반복 규칙 보정 |
| `.omx/artifacts/KTD-9/stages/03-tdd-plan.md` | TDD 계획의 stage 6 설명을 사람 승인 게이트에서 구현 착수 검토 루프로 보정 |
| `docs/tdd-subagent-workflow.md` | 전체 TDD subagent workflow의 stage 6, 사람 역할, E2E 시나리오 입력 흐름 보정 |
| `.omx/artifacts/KTD-9/run-003/subagents/14-human-role-and-gate-correction.md` | 이번 보정의 subagent/model/reasoning과 변경 근거 기록 |

## Canonical 보정 내용

- 사람 담당은 stage 0 이슈 발행, 버그 리포팅 입력, E2E 테스트 시나리오 관리로 제한해 기록했다.
- stage 6 이름을 `구현 착수 검토 루프`로 보정했다.
- stage 6 담당 subagent를 `test-engineer`, `architect`, `critic`, `verifier`로 기록했다.
- stage 6 canonical 산출물을 `06-implementation-gate.md`, `evidence/gate-review.md`로 기록했다.
- 기존 `run-003/subagents/06-human-gate.md`는 과거 artifact로 남기되, 앞으로의 canonical workflow는 subagent gate라고 명시했다.
- E2E 시나리오는 stage 0 입력 또는 버그 리포트 입력으로 들어오고, `test-engineer`가 stage 4 테스트 명세로 변환한다고 기록했다.

## 반복 규칙

| 실패 subagent | 되돌아갈 단계 |
|---|---:|
| `test-engineer` | stage 4 또는 stage 5 |
| `architect` | stage 2 또는 stage 3 |
| `critic` | stage 1 또는 stage 3 |
| `verifier` | 누락 artifact 단계 |

네 subagent가 모두 PASS하면 stage 7에서 `executor`가 최소 구현을 시작한다.

## 검증 메모

지정된 읽기 범위에서 기존 `사람 승인`, `human-gate`, `E2E` 표현을 확인한 뒤 쓰기 범위 안의 문서만 보정했다. 이번 작업은 Markdown 문서 보정이며 코드 예제나 실행 명령을 추가하지 않았다.
