# KTD-11 typecheck failure evidence

## Summary

Green 단계 중 `npm run typecheck` 1차 실행이 실패했고, 원인은 MUI `Typography`에 직접 전달한 `fontWeight` prop type mismatch였다.

## 실패

- command: `npm run typecheck`
- exit code: `2`
- 원인 분류: product code type error
- 대표 원인: `Typography` component prop으로 `fontWeight`를 직접 전달해 MUI overload resolution이 실패했다.

## 조치

`fontWeight`를 component prop이 아니라 `sx={{ fontWeight: ... }}` 안으로 이동했다.

## 재검증

- command: `npm run typecheck`
- exit code: `0`
- result: 통과
