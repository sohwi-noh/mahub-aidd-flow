# KTD-9 run-003 TDD 사람 게이트 테스트 기준

## Subagent 실행 정보

- 사용 subagent: `test-engineer`
- 모델: `gpt-5.5`
- reasoning effort: `medium`
- 시작 단계: 테스트 명세 / Red 실패 증거 검토
- 종료 단계: 사람 승인 후 최소 구현 진입 가능

## 검토한 기준선

run-003의 구현 전 게이트는 run-002에서 확정한 테스트 명세와 Red 실패 증거를 다시 확인한 결과다.

- 테스트 명세: `.omx/artifacts/KTD-9/run-002/subagents/04-test-spec.md`
- Red 실패 증거: `.omx/artifacts/KTD-9/run-002/evidence/red.md`
- 구현 계획: `.omx/artifacts/KTD-9/implementation-plan.md`

run-002 Red 판정은 기대와 일치한다. 현재 기준선에서는 `backend/`와 `frontend/` scaffold가 없고, Java 21 LTS도 local 기준선으로 아직 고정되지 않았다. 따라서 run-003의 최소 구현은 아래 Green 기준을 모두 통과시키는 데 한정한다.

## Green 기준

이번 최소 구현이 반드시 통과해야 할 Green 기준은 다음과 같다.

| 기준 | 필수 판정 | 증거 위치 |
|---|---|---|
| Java 21 LTS 명시 검증 | backend build 설정, toolchain 설정, 문서 중 실행 기준선에 Java 21 LTS가 명시되어야 한다. 기본 `java`가 다른 버전이면 Java 21 실행 경로 또는 toolchain 고정 방식이 evidence에 남아야 한다. | `.omx/artifacts/KTD-9/run-003/evidence/green.md` |
| backend 테스트 통과 | 승인된 backend scaffold의 compile/test 계열 명령이 통과해야 한다. Spring Boot를 선택한 경우 기본 test 또는 application context smoke가 통과해야 한다. | `.omx/artifacts/KTD-9/run-003/evidence/green.md` |
| frontend 테스트 통과 | 승인된 React scaffold의 test 또는 smoke 검증 명령이 통과해야 한다. test script가 없으면 최소 smoke 기준을 명시하고 실행 결과를 남겨야 한다. | `.omx/artifacts/KTD-9/run-003/evidence/green.md` |
| frontend build 통과 | React frontend의 production build 명령이 통과해야 한다. | `.omx/artifacts/KTD-9/run-003/evidence/green.md` |
| 증거 위치 명시 | 실행 명령, 결과 요약, 실패 시 복구 방향, 최종 Green 판정을 run-003 evidence에 기록해야 한다. | `.omx/artifacts/KTD-9/run-003/evidence/green.md` |

## 구현자 전달 기준

- 사람 승인 이후 executor는 backend/frontend scaffold를 최소 범위로 만들고, 위 Green 기준을 모두 통과시킨 뒤 증거를 남긴다.
- run-002의 Red 기준과 run-003의 Green 기준 사이에서 테스트 범위를 축소하지 않는다.
- `backend`와 `frontend` 중 하나라도 테스트 또는 build 증거가 없으면 Green으로 판정하지 않는다.
- Java 21 LTS는 "나중에 맞출 예정"으로 처리하지 않고, 이번 최소 구현의 명시 검증 항목으로 완료해야 한다.

Directive: 구현 편의를 이유로 Java 21 LTS, backend 테스트, frontend 테스트, frontend build 기준을 낮추지 말고, 실패하면 기준을 바꾸지 말고 원인과 복구 방향을 evidence에 남긴다.
