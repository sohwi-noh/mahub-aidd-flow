# KTD-13 test failure evidence

## 발생 시각

- 2026-05-12 14:04 KST

## 명령

- `npm test`

## 결과

- exit code: 1
- 실패 테스트:
  - `renders multiple issue swimlanes`
  - `filters issues by label chip`

## 원인 분류

- 제품 결함이 아니라 snapshot 갱신에 따른 테스트 기대값 불일치.
- KTD-10에 실제 Linear `dashboard` label이 반영되면서 label filter 결과가 `1 / 3 issues`에서 `2 / 3 issues`로 바뀌었다.
- KTD-11 실제 제목은 board row와 detail panel 양쪽에 렌더링되어 `getByText` 단일 매칭이 중복 매칭으로 실패했다.

## 조치

- KTD-11 제목 검증을 `getAllByText` 기반으로 수정했다.
- dashboard label filter 기대값을 `2 / 3 issues`로 수정했다.
- KTD-10이 dashboard label 필터 결과에 포함되는 것을 검증하도록 바꿨다.
