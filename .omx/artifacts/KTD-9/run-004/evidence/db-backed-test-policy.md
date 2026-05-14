# DB-backed 테스트 정책 반영

- 작성 시각(KST): 2026-05-12 00:43:30 KST
- 사용자 지시: 실제 Linear 단계에서 `환경구성` 마일스톤 이후 mock 객체 테스트를 금지하고, 반드시 DB를 통해 실제 테스트가 이뤄져야 한다.

## 반영 내용

- boundary 최상단 `AGENTS.md`에 `Linear 마일스톤별 테스트 정책`을 추가했다.
- `mahub-api` PR 대상 repo에 `AGENTS.md`를 추가해 backend 운영 계약으로 남겼다.
- `mahub-web` PR 대상 repo에 `AGENTS.md`를 추가해 frontend 변경이 backend 계약에 의존할 때 실제 API 또는 합의된 통합 환경 기준으로 검증하도록 남겼다.

## 적용 기준

- 현재 KTD-9 run-004는 `환경구성` 기준선이므로 build, smoke, health check, context load, 렌더링 테스트를 허용한다.
- `환경구성` 이후 backend 구현 이슈에서는 mock 객체 기반 테스트를 완료 증거로 인정하지 않는다.
- `환경구성` 이후 backend 완료 gate는 실제 DB 연결을 포함한 DB-backed 통합 테스트다.
- 외부 시스템 전체를 붙일 수 없는 경우에도 DB schema, transaction, repository/service 경계를 실제 DB 또는 합의된 test container DB로 검증해야 한다.

## 남은 결정

- 실제 DB 종류와 테스트 DB 전략은 다음 backend 기능 이슈에서 확정한다.
- 후보: local PostgreSQL/MySQL, Docker/Testcontainers, 조직 표준 개발 DB.
- 이 결정 전까지 backend 기능 구현 PR은 DB-backed 테스트 전략 artifact를 먼저 남겨야 한다.
