# KTD-9 환경구성: MA Hub Web React/Vite 기준선

## 요약

- React 19 + Vite 8 + TypeScript + Vitest 프론트엔드 기준선을 추가합니다.
- 최소 앱 화면과 Vitest/Testing Library 렌더링 테스트를 포함합니다.
- E2E 시나리오는 사람 관리 영역으로 두고, 사용자 명시 개입 없이 E2E 테스트 코드를 생성/수정하지 않는 규칙을 `AGENTS.md`와 `README.md`에 남겼습니다.

## 검증

- `npm install --no-audit --no-fund`
- `npm install --save-dev @types/node@^20.19.0 --no-audit --no-fund`
- `npm test`
- `npm run build`

결과:

- Vitest: 1 file / 1 test passed
- Build: `tsc -b && vite build` passed

## E2E / DB-backed 정책

- E2E 테스트 코드, 시나리오, fixture/mock/helper는 생성하거나 수정하지 않았습니다.
- 현재 PR은 `환경구성` 기준선이라 렌더링 테스트와 build 검증만 포함합니다.
- Web 변경이 `환경구성` 이후 backend 계약에 의존하면 실제 API 또는 합의된 통합 환경 기준으로 검증합니다.

## 추적

- Linear: KTD-9
- run: run-004
- subagent evidence: `01-pr-orchestration`, `03-web-implementation`, `04-pre-pr-verification-plan`, `05-web-build-fix`, `06-pre-pr-review`
