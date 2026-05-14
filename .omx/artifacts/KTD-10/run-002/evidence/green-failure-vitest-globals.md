# KTD-10 Green 재검증 실패 증거

- 실행 시각(KST): 2026-05-12 11:11
- 대상 repo: `workflow/mahub-aidd-flow`
- 원인 분류: 테스트 설정 결함

## `npm test`

- 명령: `npm test`
- exit code: `1`
- 요약: Vitest globals가 활성화되지 않아 `describe`가 런타임에서 정의되지 않았다.

```text
ReferenceError: describe is not defined
src/App.test.tsx:4:1
```

## `npm run typecheck`

- 명령: `npm run typecheck`
- exit code: `2`
- 요약: TypeScript가 `describe`, `it`, `expect` 타입을 찾지 못했다.

## `npm run build`

- 명령: `npm run build`
- exit code: `2`
- 요약: build가 `tsc -b`를 포함하므로 같은 Vitest globals 타입 오류로 실패했다.

## 다음 조치

Vitest 설정에서 `globals: true`를 켜고, TypeScript app config에 `vitest/globals` 타입을 추가한다.
