# KTD-9 canonical stage index

## 목적

이 문서는 KTD-9 이슈 기반 AIDD workflow의 canonical stage schema다.

`stage-index.md`는 PR, MR, evidence, subagent 실행 로그를 누적하는 DB가 아니다. 앞으로 PR이 10개든 1000개든 이 파일은 stage 번호, 한글 단계명, 담당 역할, 필수 기록 규칙만 가진다.

## 데이터 소유권

| 파일/디렉터리 | 책임 |
|---|---|
| `stage-index.md` | canonical stage 번호, 단계명, 정책, 완료 조건 |
| `run-*/stage-ledger.md` | 특정 실행 회차가 어떤 stage를 수행했는지 매핑 |
| `run-*/run-summary.md` | 특정 실행 회차의 요약, PR/MR 링크, evidence index |
| `run-*/run.jsonl` | 특정 실행 회차의 시간순 이벤트, subagent/model/token 기록 |
| `run-*/subagents/` | 특정 실행 회차의 subagent별 계획/결과/증거 |
| `run-*/evidence/` | 특정 실행 회차의 명령 결과, 실패 기록, 검증 증거 |
| `stages/` | 장기적으로 재사용할 stage별 가이드 또는 policy entrypoint |

## 읽는 법

- `run-*`은 실행 회차이고, `stage`는 lifecycle 번호다.
- `subagents/NN-*` 파일 번호는 run-local 산출물 순번이며 canonical stage 번호가 아니다.
- stage가 실제로 늘어날 때만 이 파일의 stage mapping을 수정한다.
- 새 PR, 새 MR, 새 evidence, 새 subagent artifact는 이 파일에 추가하지 않는다.
- 대시보드는 이 파일을 schema로 읽고, 실제 진행률/증거/토큰은 각 `run-*` 디렉터리에서 읽는다.

## Canonical stage mapping

| Stage | 한글 단계명 | 담당 | 필수 run-local 기록 | 완료 조건 |
|---:|---|---|---|---|
| 0 | 이슈 발행 | 사람, `analyst` | Linear 원문, 사람 입력 E2E 시나리오, 버그 리포트 입력, intake 기록 | 요구사항 출처가 추적 가능하다. |
| 1 | 요구사항 정리 | `analyst` | 요구사항/AC 정규화, 모호성, 제외 범위 | 구현 가능한 요구사항과 AC가 합의 가능한 형태다. |
| 2 | 아키텍처 정리 | `architect` | 영향 범위, repo 경계, 기술 결정, 위험 | 구현 경계와 주요 선택지가 기록됐다. |
| 3 | TDD 계획 | `planner` | Red/Green/Refactor 순서, 검증 명령, rollback 기준 | 테스트 우선 실행 순서가 정해졌다. |
| 4 | 테스트 명세 | `test-engineer` | 실패해야 할 테스트, E2E 보호 범위, 품질 기준 | 구현 전 기대 실패와 pass 조건이 명확하다. |
| 5 | Red 실패 증거 | `test-engineer` | 실패 명령, exit code, 실패 요약, 원인 분류 | 기대 실패 또는 실행 불가 사유가 evidence로 남았다. |
| 6 | 구현 착수 검토 루프 | `test-engineer`, `architect`, `critic`, `verifier` | 구현 착수 전 subagent별 PASS/FAIL, 되돌아갈 stage | 구현 착수 리스크가 검토됐고 실패 시 보정 stage가 명확하다. |
| 7 | 최소 구현 | `executor` | 최소 구현 계획, 변경 파일, 범위 밖 작업 | 테스트 통과에 필요한 최소 product code가 변경됐다. |
| 8 | Green 통과 증거 | `test-engineer`, `verifier`, 필요 시 `build-fixer` | 통과 명령, exit code, 실패 후 재시도 기록 | Red에서 정의한 검증이 통과했다. |
| 9 | 리팩터링 | `code-simplifier` | 동작 보존 리팩터링 범위, 재검증 | 테스트 통과 상태를 유지하며 구조가 정리됐다. |
| 10 | 검증/리뷰 | `verifier`, `code-reviewer` | 완료 증거, 리뷰 결과, 잔여 리스크 | 검증 PASS와 리뷰 결과가 PR/MR 전에 추적 가능하다. |
| 11 | MR/Wiki/Graph 환류 | `git-master`, `writer` | PR/MR 링크, Wiki 환류, graph 생성 또는 보류 사유 | 결과물이 외부 repo와 지식 그래프에 환류됐다. |

## 사람 역할 경계

사람은 stage 0에서 Linear 이슈를 발행하고, 버그 리포트를 입력하며, E2E 테스트 시나리오를 관리한다.

사람은 stage 6의 기본 구현 승인자가 아니다. stage 6은 `test-engineer`, `architect`, `critic`, `verifier`가 각자 담당 범위를 검토하는 구현 착수 검토 루프다.

E2E 테스트 코드, E2E 시나리오 정의, E2E 전용 fixture/mock/helper는 사용자의 명시적 개입/승인 없이는 agent가 단독으로 수정하지 않는다. 승인된 경우에도 수정 범위는 승인된 E2E 테스트 파일/시나리오와 직접 필요한 E2E 전용 fixture/mock/helper로 제한한다.

## Stage 6 반복 규칙

| 실패 subagent | 되돌아갈 단계 | 보정 기준 |
|---|---:|---|
| `test-engineer` | stage 4 또는 stage 5 | 테스트 명세 또는 Red 실패 증거를 보강한다. |
| `architect` | stage 2 또는 stage 3 | 아키텍처 결정 또는 TDD 계획을 보강한다. |
| `critic` | stage 1 또는 stage 3 | 요구사항 해석 또는 TDD 계획의 허점을 보강한다. |
| `verifier` | 누락 artifact 단계 | 빠진 산출물, 증거, 링크가 있는 원 단계로 돌아가 보강한다. |

네 subagent가 모두 PASS하면 stage 7에서 `executor`가 최소 구현을 시작한다.

## 테스트 증거 정책

테스트 실행 중 오류는 반드시 run-local evidence에 남긴다.

필수 항목:

- 실행 명령
- exit code
- 실패/오류 요약
- 원인 분류: product bug, test gap, environment, dependency, unknown
- 다음 조치

Linear `환경구성` 마일스톤 이후 backend mock 객체 테스트는 완료 증거로 인정하지 않는다. backend 검증은 실제 DB 또는 합의된 test container DB 기반 통합 테스트를 사용한다.

## 확장 규칙

- 새 stage가 필요할 때만 이 파일에 row를 추가한다.
- 특정 PR의 링크와 증거는 해당 `run-*/run-summary.md`와 `run-*/evidence/`에 둔다.
- 특정 subagent의 시작/종료, model, reasoning, token 추정치는 `run-*/run.jsonl`과 `run-*/token-usage.md`에 둔다.
- `stage-index-sync`는 이 파일에 run detail을 추가하는 작업이 아니라, run-local 기록이 이 schema와 맞는지 감사하는 작업이다.
