# TDD Subagent Workflow

## 목적

Linear 이슈가 실제 코드 변경으로 이어질 때 subagent들이 TDD 순서를 어기지 않도록 단계와 증거 위치를 고정한다.

## 단계 수

기본 개발 이슈는 구현 착수 검토 루프와 기록 단계를 포함해 12단계로 운영한다. 실제 코드를 쓰는 단계는 stage 6의 subagent 검토가 모두 PASS된 이후이며, 그 전에는 요구사항, 아키텍처, 테스트 기준을 먼저 고정한다.

## 12단계 한글 흐름

`이슈 발행 → 요구사항 정리 → 아키텍처 정리 → TDD 계획 → 테스트 명세 → Red 실패 증거 → 구현 착수 검토 루프 → 최소 구현 → Green 통과 증거 → 리팩터링 → 검증/리뷰 → MR/Wiki/Graph 환류`

| 단계 | 담당 | 실제 agent | 목적 | 산출물 |
|---:|---|---|---|---|
| 0 | 이슈 발행 | 사람 | Linear 이슈 발행, 버그 리포팅 입력, E2E 테스트 시나리오 관리 | Linear issue, 버그 리포트 입력, E2E 시나리오 입력 |
| 1 | 요구사항 정리 | `analyst` 또는 `executor` 대리 기록 | 요구사항과 AC 정규화 | `01-requirements.md` |
| 2 | 아키텍처 정리 | `architect` 또는 `executor` 대리 기록 | 영향 범위와 구조 결정 | `02-architecture.md` |
| 3 | TDD 계획 | `planner` | 테스트 우선 실행 계획 작성 | `03-tdd-plan.md` |
| 4 | 테스트 명세 | `test-engineer` | 실패해야 할 테스트/품질 기준 작성, E2E 시나리오를 테스트 명세로 변환 | `04-test-spec.md` |
| 5 | Red 실패 증거 | `test-engineer` | 실패 또는 실행 불가 증거 수집 | `evidence/red.md` |
| 6 | 구현 착수 검토 루프 | `test-engineer`, `architect`, `critic`, `verifier` | 구현 착수 조건 반복 검토 | `06-implementation-gate.md`, `evidence/gate-review.md` |
| 7 | 최소 구현 | `executor` | 테스트를 통과시키는 최소 구현 | 코드 변경, `05-implementation.md` |
| 8 | Green 통과 증거 | `test-engineer` | 테스트 통과 증거 수집 | `evidence/green.md` |
| 9 | 리팩터링 | `code-simplifier` 또는 `executor` | 동작 보존 리팩터링 | `06-refactor.md` |
| 10 | 검증/리뷰 | `verifier`, `code-reviewer` | 완료 증거와 리스크 검토 | `07-verification.md`, `08-review.md` |
| 11 | MR/Wiki/Graph 환류 | `git-master`, `writer` | commit, MR, Wiki, graph 환류 | `09-mr.md`, `10-knowledge.md` |

## KTD-9 적용

KTD-9는 개발환경 scaffold 이슈이므로 테스트 기준은 다음처럼 정의한다.

- Backend Red 실패 증거: `backend/`가 없어서 backend build/test가 실행 불가임을 기록한다.
- Frontend Red 실패 증거: `frontend/`가 없어서 frontend build/test가 실행 불가임을 기록한다.
- Green 통과 증거: Java 21 backend scaffold와 React frontend scaffold를 만든 뒤 build/smoke가 통과한다.
- 리팩터링: root 문서, ignore 규칙, 실행 명령을 정리한다.
- Graph 환류: scaffold 이후 `/understand`를 실행할 수 있는 상태인지 검증한다.

## 사람 역할

사람은 workflow 입력과 운영 책임을 맡는다.

- stage 0에서 Linear 이슈를 발행한다.
- 버그 리포팅 입력을 제공한다.
- E2E 테스트 시나리오를 관리한다.

사람은 stage 6의 기본 구현 진행 승인자가 아니다. stage 6은 subagent들이 구현 착수 조건을 검토하는 반복 단계다.

E2E 시나리오는 stage 0 입력 또는 버그 리포트 입력으로 들어오고, `test-engineer`가 stage 4 테스트 명세로 변환한다.

## E2E 테스트 코드 보호 정책

E2E 시나리오 테스트 코드는 product behavior를 고정하는 상위 회귀 기준이므로 사용자의 명시적 개입/승인 없이는 agent가 단독으로 수정하지 않는다. 이 정책은 자동 실행 원칙보다 우선한다.

- 보호 범위는 E2E 테스트 코드, E2E 시나리오 정의, E2E 전용 fixture/mock/helper를 모두 포함한다.
- `test-engineer` 또는 동등한 subagent artifact는 승인 근거가 아니다. 수정 필요성 검토, 권고, 대상 범위와 제외 범위 정의만 담당한다.
- 사용자 명시 승인 전 agent는 E2E 테스트 변경 patch를 적용하지 않고, 실패 증거와 제안만 artifact에 남긴다.
- 사용자가 명시 승인한 경우에도 수정 범위는 사용자가 승인한 E2E 테스트 파일/시나리오와 그 테스트 실행에 직접 필요한 E2E 전용 fixture/mock/helper로 제한한다.
- 승인 범위 밖의 E2E 테스트 코드, E2E 시나리오 정의, E2E 전용 fixture/mock/helper를 바꾸려면 별도 사용자 승인이 필요하다.
- product code 변경은 E2E 테스트 변경이 아니지만, E2E 실패를 고치기 위한 product code 변경도 같은 E2E 보정 안에 섞지 않고 stage 6 gate와 일반 TDD artifact를 따른다.
- unrelated unit/integration test, unrelated fixture, config 변경이 필요하면 별도 stage 6 gate와 별도 artifact를 만든다.
- E2E 보정 artifact에는 변경하지 않은 상태의 실패 증거, 권고 patch 범위, 제외 범위, 사용자 승인 필요 여부를 포함한다.
- 사람은 stage 0에서 E2E 시나리오를 관리하고, E2E 테스트 코드/시나리오/전용 fixture 변경의 명시 승인 주체다.

## 테스트 실행 오류 기록 정책

테스트 실행 중 오류, 실패, 환경성 실패는 누락 없이 `.omx/artifacts/<ISSUE-ID>/run-<NNN>/evidence/` 아래에 기록한다.

기록 항목은 다음을 포함한다.

- 실행 명령
- exit code
- 실패 또는 오류 요약
- 원인 분류: 제품 결함, 테스트 결함, 환경 제약, 의존성/도구 문제, 미분류
- 다음 조치

stage 5 Red 실패 증거, stage 8 Green 통과 증거, stage 10 검증/리뷰는 모두 이 기록 정책을 따른다. 재실행으로 통과했더라도 최초 실패 evidence, 재실행 명령, 재검증 통과 evidence를 함께 남긴다.

## Stage 6 구현 착수 검토 루프

stage 6의 canonical 산출물은 `06-implementation-gate.md`와 `evidence/gate-review.md`다. 기존 KTD-9 run-003의 `human-gate` 문서는 과거 artifact로 보존하며, 앞으로의 canonical workflow에서는 subagent gate를 사용한다.

| 실패 subagent | 되돌아갈 단계 | 보정 기준 |
|---|---:|---|
| `test-engineer` | stage 4 또는 stage 5 | 테스트 명세 또는 Red 실패 증거를 보강한다. |
| `architect` | stage 2 또는 stage 3 | 아키텍처 결정 또는 TDD 계획을 보강한다. |
| `critic` | stage 1 또는 stage 3 | 요구사항 해석 또는 TDD 계획의 허점을 보강한다. |
| `verifier` | 누락 artifact 단계 | 빠진 산출물, 증거, 링크가 있는 원 단계로 돌아가 보강한다. |

네 subagent가 모두 PASS하면 stage 7에서 `executor`가 최소 구현을 시작한다.

## 증거 위치

```text
.omx/artifacts/<ISSUE-ID>/run-<NNN>/
├── run.jsonl
├── run-summary.md
├── token-usage.md
├── subagents/
└── evidence/
    ├── red.md
    ├── green.md
    ├── refactor.md
    └── verify.md
```

## PR/Merge 운영 정책

기본 정책은 PR 생성 후 검증이 통과하고 merge block이 없으면 같은 workflow 안에서 즉시 merge한다.

- PR 생성 전 `npm test`, typecheck, build 등 해당 repo의 Green 증거를 확보한다.
- PR 생성 후 merge 상태를 확인하고, merge가 가능하면 즉시 merge한다.
- merge 후 로컬 `main`을 `origin/main` 기준으로 동기화하고 post-merge 검증을 다시 남긴다.
- PR URL, merge commit, Linear 완료 상태, Wiki/Graph 환류 또는 보류 사유를 run-local evidence에 기록한다.

## 구현 금지 조건

- 테스트 기준이 문서화되지 않았으면 `executor`는 구현을 시작하지 않는다.
- 실패 또는 실행 불가 증거가 없으면 Green 통과를 위한 구현으로 넘어가지 않는다.
- stage 6 구현 착수 검토 루프에서 하나라도 FAIL이면 `executor`는 구현을 시작하지 않는다.
- 검증 명령이 실제로 실행되지 않았으면 MR-ready로 표시하지 않는다.
- `/understand`는 scaffold 전에는 실행하지 않는다.
