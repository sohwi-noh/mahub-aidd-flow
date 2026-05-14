# KTD-11 canonical stage index

## 목적

KTD-11 이슈 기반 AIDD dashboard workflow의 canonical stage schema다.

`stage-index.md`는 실행 로그를 누적하는 DB가 아니다. 실제 PR/evidence/token/subagent 기록은 `run-*` 아래에 둔다.

## Canonical stage mapping

| Stage | 한글 단계명 | 담당 | 필수 run-local 기록 | 완료 조건 |
|---:|---|---|---|---|
| 0 | 이슈 발행 | 사람, `analyst` | Linear 원문, dashboard/mahub 라벨, intake 기록 | 요구사항 출처가 추적 가능하다. |
| 1 | 요구사항 정리 | `analyst` | 요구사항/AC/비범위/리스크 | 구현 가능한 요구사항과 AC가 정규화됐다. |
| 2 | 아키텍처 정리 | `architect` | 데이터 모델, 파일 경계, UI 구조, 위험 | 구현 경계와 주요 선택지가 기록됐다. |
| 3 | TDD 계획 | `planner` | Red/Green/Refactor 순서, 검증 명령 | 테스트 우선 실행 순서가 정해졌다. |
| 4 | 테스트 명세 | `test-engineer` | 실패해야 할 component test, fixture/data 기준 | 구현 전 기대 실패와 pass 조건이 명확하다. |
| 5 | Red 실패 증거 | `test-engineer` | 실패 명령, exit code, 실패 요약, 원인 분류 | 기대 실패가 evidence로 남았다. |
| 6 | 구현 착수 검토 루프 | `critic`, `verifier` | 구현 착수 전 PASS/FAIL, 보정 stage | 구현 착수 리스크가 검토됐다. |
| 7 | 최소 구현 | `executor` | 변경 파일, 범위 밖 작업, 구현 요약 | 테스트 통과에 필요한 최소 product code가 변경됐다. |
| 8 | Green 통과 증거 | `test-engineer`, `verifier` | 통과 명령, exit code, 재시도 기록 | Red에서 정의한 검증이 통과했다. |
| 9 | 리팩터링 | `code-simplifier` | 동작 보존 리팩터링 범위, 재검증 | 테스트 통과 상태를 유지하며 구조가 정리됐다. |
| 10 | 검증/리뷰 | `verifier`, `code-reviewer` | 완료 증거, 리뷰 결과, 잔여 리스크 | 검증 PASS와 리뷰 결과가 PR 전에 추적 가능하다. |
| 11 | MR/Wiki/Graph 환류 | `git-master`, `writer` | PR/MR 링크, Wiki 환류, graph 생성 또는 보류 사유 | 결과물이 외부 repo와 지식 그래프에 환류됐다. |

## KTD-11 적용 메모

- `dashboard` 라벨은 AIDD workflow 관제 화면 이슈에 사용한다.
- `mahub` 라벨은 제품 api/web output 이슈에 사용한다.
- UI는 MUI를 단일 디자인 프레임워크로 사용한다.
- E2E 테스트 코드/시나리오/fixture/mock/helper는 사용자 명시 승인 없이 수정하지 않는다.
