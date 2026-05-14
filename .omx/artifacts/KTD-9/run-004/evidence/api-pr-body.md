# KTD-9 환경구성: MA Hub API Java 21 기준선

## 요약

- Java 21 LTS + Maven + Spring Boot 3.5.14 API 기준선을 추가합니다.
- `GET /api/health` smoke endpoint와 Spring context/health 테스트를 포함합니다.
- `환경구성` 이후 backend 이슈는 mock 객체 테스트를 완료 증거로 인정하지 않고 DB-backed 통합 테스트를 gate로 둔다는 운영 규칙을 `AGENTS.md`와 `README.md`에 남겼습니다.

## 검증

- `JAVA_HOME=/opt/homebrew/Cellar/openjdk@21/21.0.11/libexec/openjdk.jdk/Contents/Home mvn test`
- 결과: Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, BUILD SUCCESS

## E2E / DB-backed 정책

- E2E 테스트 코드, 시나리오, fixture/mock/helper는 생성하거나 수정하지 않았습니다.
- 현재 PR은 `환경구성` 기준선이라 smoke/context 테스트만 포함합니다.
- `환경구성` 이후 backend 기능 PR은 실제 DB 또는 합의된 test container DB 기반 통합 테스트를 완료 gate로 추가해야 합니다.

## 추적

- Linear: KTD-9
- run: run-004
- subagent evidence: `01-pr-orchestration`, `02-api-implementation`, `04-pre-pr-verification-plan`, `06-pre-pr-review`
