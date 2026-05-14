# KTD-10 test-first Red 증거

- 실행 시각(KST): 2026-05-12 11:09
- 대상 repo: `workflow/mahub-aidd-flow`
- 명령: `npm test`
- exit code: `1`
- 원인 분류: 제품 결함, 의도된 test-first Red

## 실패 요약

`src/App.test.tsx`가 먼저 작성되었고, 아직 `src/App.tsx` 제품 구현이 없어 import가 실패했다.

```text
FAIL  src/App.test.tsx [ src/App.test.tsx ]
Error: Failed to resolve import "./App" from "src/App.test.tsx". Does the file exist?
File: /Users/so2/workspace-so2/foundary/workflow/mahub-aidd-flow/src/App.test.tsx:2:20
```

## 다음 조치

stage 7 최소 구현에서 `App.tsx`, dashboard fixture, style, entrypoint를 추가해 테스트를 통과시킨다.
