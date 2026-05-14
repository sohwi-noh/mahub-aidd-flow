# MAHub Web

MAHub Web는 React, Vite, TypeScript, Vitest 기반의 프론트엔드 기준선입니다.

## 요구 환경

- Node.js 20.19 이상
- npm

## 명령어

```bash
npm install
npm test
npm run build
npm run dev
```

## E2E 보호 정책

이 저장소에서는 사용자 승인 없이 E2E 테스트 코드, 시나리오, fixture, mock, helper를 수정하거나 새로 만들지 않습니다. 현재 기준선에는 E2E 파일을 포함하지 않습니다.

## 환경구성 이후 테스트 정책

Linear의 `환경구성` 마일스톤 이후 backend 구현 이슈에서는 mock 객체 기반 테스트를 완료 증거로 인정하지 않습니다. Web 변경이 backend 계약에 의존하면 실제 API 또는 합의된 통합 환경 기준으로 검증합니다.
