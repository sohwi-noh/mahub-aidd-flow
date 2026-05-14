# KTD-10 AIDD workflow 관제 프론트 baseline

## 요약

- `workflow/mahub-aidd-flow`에 React + Vite + TypeScript baseline을 추가했습니다.
- AIDD workflow 관제 첫 화면을 정적 sample data 기반으로 구현했습니다.
- issue stage 진행률, subagent/model/reasoning, artifact/evidence path, token 미노출 상태를 표시합니다.

## 검증

- `npm test` 통과
- `npm run typecheck` 통과
- `npm run build` 통과

## 정책

- 실제 Linear/GitHub/OMX API 연동은 아직 추가하지 않았습니다.
- `stage-index.md`는 schema-only로 유지하고, 실행 데이터는 run-local artifact에서 aggregate하는 전제를 유지했습니다.
- E2E 테스트 코드, E2E 시나리오, E2E 전용 fixture/mock/helper는 생성하거나 수정하지 않았습니다.
- `mahub-api`, `mahub-web` 제품 repo는 변경하지 않았습니다.

## 남은 작업

- 실제 `.omx/artifacts` export/import adapter 추가
- 여러 issue/run 선택과 필터링
- CI 구성
- 사용자 승인 후 E2E 시나리오 정의
