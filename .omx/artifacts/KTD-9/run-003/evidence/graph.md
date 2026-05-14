# KTD-9 run-003 understand-anything graph 환류

## 상태

이번 run-003에서는 understand-anything graph 생성을 실행하지 않았다.

Backend와 frontend scaffold가 생겼으므로 다음 단계에서 `/understand` 실행이 가능하다. 다만 run-003은 PR 전 최종 scaffold 기준을 고정하고 감사 원장, PR 초안, graph 환류 계획을 닫는 데 한정했다.

현재 `boundary` 저장소는 기준선과 감사 artifact를 보관하는 저장소다. 실제 코드 PR은 backend를 `https://github.com/sohwi-noh/mahub-api`, frontend를 `https://github.com/sohwi-noh/mahub-web`에 분리 생성한다. 따라서 graph 환류도 단일 저장소 전제 대신 두 대상 저장소 분리 전략을 따른다.

## 실행하지 않은 이유

graph 생성을 이번 run-003에서 바로 실행하지 않은 이유는 추적 경계를 선명하게 유지하기 위해서다.

- run-003의 목적은 TDD gate 이후 최소 scaffold 구현, Green/최종 검증, 리뷰, PR/Wiki/Graph 환류 문서화다.
- graph snapshot은 scaffold 기준이 최종 고정된 뒤 생성해야 이후 변경과 비교하기 쉽다.
- PR 전 최종 scaffold 기준 고정까지 완료한 뒤 run-004에서 `/understand`를 실행하면 graph 생성 자체의 입력 기준, 실행 로그, 결과 artifact를 별도 run으로 추적할 수 있다.
- 이번 문서는 graph 미실행을 누락이 아니라 의도적 보류로 기록한다.

## 다음 단계

run-004에서 다음 순서로 진행한다.

1. run-003 PR 초안과 stage ledger를 기준으로 `mahub-api`, `mahub-web`의 scaffold 포함 범위를 각각 확인한다.
2. `mahub-api`에서 `/understand`를 실행해 backend graph를 생성하고 Java 21/Maven/Spring Boot 증거와 연결한다.
3. `mahub-web`에서 `/understand`를 실행해 frontend graph를 생성하고 React/Vite/Vitest 증거와 연결한다.
4. 두 대상 저장소를 한 화면에서 추적해야 하면 `boundary`에서 aggregate graph를 별도 생성하되, 실제 코드 PR graph와 감사용 aggregate graph를 구분한다.
5. graph 생성 결과와 실행 로그를 `.omx/artifacts/KTD-9/run-004/` 아래에 남긴다.
6. 생성된 graph를 각 PR 본문 또는 Wiki 운영 기록에 링크한다.

## 환류 메모

- 관련 Linear: `KTD-9`
- 현재 graph 상태: 실행 보류
- 다음 실행 가능 조건: `mahub-api`에 backend scaffold와 README/문서 명령 이전, `mahub-web`에 frontend scaffold와 README/문서 명령 이전
- 후속 권장 run: `KTD-9 run-004`
- 이번 run-003 결과 artifact: `.omx/artifacts/KTD-9/run-003/subagents/11-mr-wiki-graph.md`
- 이번 PR 대상 저장소 보정 artifact: `.omx/artifacts/KTD-9/run-003/subagents/11-pr-target-update.md`
