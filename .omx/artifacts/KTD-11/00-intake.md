# KTD-11 intake

## 목표

`mahub-aidd-flow`를 KTD-10의 정적 baseline에서 KTD-11의 issue lifecycle 상세 관제 화면으로 확장한다.

## 핵심 결정

- Linear label은 `dashboard`와 `mahub`로 분리한다.
- KTD-11은 `dashboard` label 이슈로 발행했다.
- 브라우저에서 `.omx/artifacts`를 직접 읽지 않고 build-time JSON snapshot을 사용한다.
- artifact markdown 요약은 deterministic rule 기반 script/skill로 생성한다.
- token 값이 도구에서 노출되지 않으면 `unavailable`로 표시한다.

## 비범위

- 실제 Linear/GitHub API 실시간 연동
- E2E 테스트 코드/시나리오/fixture/mock/helper 수정
- MUI 외 별도 UI framework 추가
