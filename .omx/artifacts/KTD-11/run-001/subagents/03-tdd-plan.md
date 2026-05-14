# KTD-11 TDD 계획

## Summary

Red, Green, Refactor 순서와 검증 명령을 고정했다. 요약 생성 기준은 markdown 제목과 본문 앞부분을 deterministic하게 추출한다.

## Red

1. 상세 패널 동작을 검증하는 실패 테스트를 먼저 추가한다.
2. 사용자가 issue 항목을 클릭했을 때 상세 패널이 펼쳐지는지 검증한다.
3. 상세 패널 안에 `agent`, `model`, `token`, `timing`, `status`, `artifact summary` 정보가 렌더링되는지 검증한다.
4. `npm test`가 제품 구현 부재로 실패하는 것을 확인한다.

## Green

1. MUI dashboard 구조를 추가한다.
2. issue 항목 클릭/확장 이벤트를 연결한다.
3. 선택된 issue의 상세 패널에 agent/model/token/timing/status/artifact summary를 노출한다.
4. 접근 가능한 role/name 기반 query로 테스트가 통과하도록 구성한다.

검증 명령:

```bash
npm test
npm run typecheck
npm run build
```

## Refactor

- 중복 formatting은 `src/domain/dashboard.ts`로 분리한다.
- 새 abstraction은 반복 제거나 명확한 책임 분리가 필요할 때만 추가한다.
- E2E 관련 파일은 계속 변경하지 않는다.

## Rollback 기준

- 기존 issue 목록 또는 lifecycle 표시가 깨진다.
- 최종 `npm test`, `npm run typecheck`, `npm run build` 중 하나가 실패한다.
- E2E 파일 변경이 필요해진다.
