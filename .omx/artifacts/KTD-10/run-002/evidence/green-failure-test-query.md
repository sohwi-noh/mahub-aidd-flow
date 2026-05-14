# KTD-10 Green 재검증 실패 증거 - 테스트 쿼리 범위

- 실행 시각(KST): 2026-05-12 11:12
- 대상 repo: `workflow/mahub-aidd-flow`
- 원인 분류: 테스트 결함

## 결과

- `npm test`: exit code `1`
- `npm run typecheck`: exit code `0`
- `npm run build`: exit code `0`

## 실패 요약

화면은 기대 데이터를 렌더링했지만 테스트가 중복 텍스트를 단일 요소로 조회했다.

- `KTD-10`은 issue list와 detail header에 모두 존재한다.
- `medium`은 planner와 test-engineer row에 모두 존재한다.

## 다음 조치

테스트 쿼리를 더 구체적인 role/row 범위로 좁힌다. 제품 동작 변경은 필요하지 않다.

## 추가 재실행 결과

- 실행 시각(KST): 2026-05-12 11:12
- `npm test`: exit code `1`
- `npm run typecheck`: exit code `0`
- `npm run build`: exit code `0`

추가 실패 원인도 동일하게 테스트 query 범위 문제다. `run-002/evidence/red.md`가 planner와 test-engineer row에 각각 표시되어 단일 요소 조회가 실패했다.
