# MA Hub API

Java 21 LTS, Maven, Spring Boot 3.5.14 기반의 MA Hub API 기준선입니다.

## 요구 환경

- Java 21
- Maven 3.9 이상 권장

## 테스트

```bash
mvn test
```

## 실행

```bash
mvn spring-boot:run
```

기본 health check endpoint는 `GET /api/health` 입니다.

## E2E 보호 정책

이 저장소에서는 사용자 승인 없이 E2E 테스트 코드, 시나리오, fixture, mock, helper를 수정하거나 새로 만들지 않습니다.

## 환경구성 이후 테스트 정책

Linear의 `환경구성` 마일스톤 이후 backend 구현 이슈에서는 mock 객체 기반 테스트를 완료 증거로 인정하지 않습니다. 이후 기능 PR은 실제 DB 연결을 포함한 DB-backed 통합 테스트를 기본 gate로 둡니다.
