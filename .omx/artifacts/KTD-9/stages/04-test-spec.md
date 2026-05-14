# 04 테스트 명세

## Canonical stage

- Stage: 4
- Lifecycle 단계: 테스트 명세
- Canonical 산출물: `.omx/artifacts/KTD-9/stages/04-test-spec.md`

## 기존 artifact

- 테스트 명세: [../run-002/subagents/04-test-spec.md](../run-002/subagents/04-test-spec.md)
- Red 증거: [../run-002/evidence/red.md](../run-002/evidence/red.md)
- run-003 테스트 게이트: [../run-003/subagents/05-test-engineer-gate.md](../run-003/subagents/05-test-engineer-gate.md)
- run-002 요약: [../run-002/run-summary.md](../run-002/run-summary.md)

## 담당 subagent

| 항목 | 값 |
| --- | --- |
| 담당 | `test-engineer` |
| 모델 | `gpt-5.5` |
| reasoning | `medium` |
| 범위 | scaffold 구현 전 Red/Green/Refactor 품질 게이트 정의 |

## 목적

업무 기능 테스트가 아니라 개발환경 및 SW 아키텍처 기준선 scaffold의 실행 가능한 품질 게이트를 정의한다. 기존 명세는 backend scaffold, frontend scaffold, root 명령 문서, ignore 정책, graph 준비를 검증 축으로 나눴다.

## 상태

완료. run-003의 `05-test-engineer-gate.md`에서 run-002 테스트 명세와 Red 실패 증거를 재확정했고, Java 21 LTS, backend test, frontend test/build 기준을 낮추지 않는 조건을 남겼다.

## E2E 시나리오 변환 범위

E2E 시나리오가 stage 0 입력 또는 버그 리포트 입력으로 들어오면 `test-engineer`가 테스트 명세로 변환한다. 이때 E2E 테스트 코드, E2E 시나리오 정의, E2E 전용 fixture/mock/helper는 사용자의 명시적 개입/승인 없이는 agent가 단독으로 수정할 수 없다.

Subagent artifact의 역할은 승인 부여가 아니라 다음 항목의 검토/권고/범위 정의다.

- 실패 증거
- 수정 필요성
- 대상 시나리오
- 권고 범위
- 제외 범위
- 사용자 승인 필요 여부

사용자 명시 승인 전 agent는 E2E 테스트 변경 patch를 적용하지 않고, 실패 증거와 제안만 남긴다.

사용자 승인 이후에도 수정 허용 범위는 사용자가 승인한 다음 항목으로 제한한다.

- 해당 E2E 테스트 파일
- 해당 E2E 시나리오 정의
- 그 테스트 실행에 직접 필요한 E2E 전용 fixture, mock, test helper

승인 범위 밖의 E2E 테스트 코드, E2E 시나리오 정의, E2E 전용 fixture/mock/helper를 바꾸려면 별도 사용자 승인이 필요하다.

다음 변경은 해당 E2E 보정 밖으로 나가는 변경으로 본다.

- product code 변경
- unrelated unit/integration test 변경
- unrelated fixture 변경
- config 변경

Product code 변경은 E2E 테스트 변경이 아니지만, E2E 실패를 고치기 위한 product code 변경도 별도 stage 6 gate와 일반 TDD artifact를 만든 뒤 진행한다. 그 밖의 변경도 별도 stage 6 gate와 별도 artifact가 필요하다.

## PR 추적 메모

PR/MR에는 `04-test-spec.md`와 `05-test-engineer-gate.md`를 함께 링크해, 구현 전 테스트 기준이 먼저 존재했다는 TDD 근거를 남긴다.
