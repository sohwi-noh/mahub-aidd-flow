# KTD-10 canonical stage index

## 목적

이 문서는 KTD-10 이슈 기반 AIDD workflow의 canonical stage schema다.

`stage-index.md`는 PR, MR, evidence, subagent 실행 로그를 누적하는 DB가 아니다. 이 파일은 stage 번호, 한글 단계명, 담당 역할, 필수 기록 규칙만 가진다.

## 데이터 소유권

| 파일/디렉터리 | 책임 |
|---|---|
| `stage-index.md` | canonical stage 번호, 단계명, 정책, 완료 조건 |
| `run-*/stage-ledger.md` | 특정 실행 회차가 어떤 stage를 수행했는지 매핑 |
| `run-*/run-summary.md` | 특정 실행 회차의 요약, PR/MR 링크, evidence index |
| `run-*/run.jsonl` | 특정 실행 회차의 시간순 이벤트, subagent/model/token 기록 |
| `run-*/subagents/` | 특정 실행 회차의 subagent별 계획/결과/증거 |
| `run-*/evidence/` | 특정 실행 회차의 명령 결과, 실패 기록, 검증 증거 |

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

## KTD-10 적용 메모

KTD-10은 `mahub-aidd-flow` 저장소의 AIDD workflow 관제 frontend baseline 구축 이슈다.

- 제품 backend는 `mahub-api`가 담당한다.
- 제품 frontend는 `mahub-web`이 담당한다.
- AIDD workflow 관제 화면은 `mahub-aidd-flow`가 담당한다.
- 실제 PR/evidence/token/subagent 기록은 이 파일이 아니라 `run-*` 아래에 둔다.
