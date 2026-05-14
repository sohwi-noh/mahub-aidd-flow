# AIDD Backend

KTD-20에서 정의하는 AIDD workflow 관제용 control-plane backend 후보 경로다.

## 책임

- AIDD dashboard가 읽는 issue/stage/agent/artifact/token/PR 데이터를 API로 제공한다.
- AIDD가 MA Hub 산출물을 어떤 이슈/단계/subagent를 통해 변경했는지 추적한다.
- `.omx/artifacts/<ISSUE-ID>/run-*` snapshot과 markdown 산출물은 bootstrap/import 입력으로만 다룬다.
- `stage-index.md`는 schema 기준으로만 읽고, per-run evidence 저장소로 사용하지 않는다.
- MA Hub 제품 API와 섞이지 않는다. `mahub/backend`는 AIDD가 변경/검증할 제품 산출물 경계로 유지한다.

## 로컬 DB 기준

초기 DB는 각 개발자가 Homebrew PostgreSQL로 설치한다.

- formula: `postgresql@18`
- default admin: Homebrew cluster를 초기화한 macOS 사용자 계정
- 이 로컬의 admin 예시: `sohwi`
- DB: `foundary_aidd`
- user: `foundary_aidd`
- profile: `local`

상세 설치와 DB 생성 절차는 [../../docs/aidd-backend-local-postgresql.md](../../docs/aidd-backend-local-postgresql.md)를 따른다.

## 구현 계획

1. Java 21 Spring Boot Maven scaffold를 만든다.
2. `local` profile에서 PostgreSQL 연결을 읽는다.
3. migration 도구를 확정하고 첫 schema를 만든다.
4. DB-backed integration test를 먼저 작성한다.
5. health endpoint와 issue lifecycle read API를 최소 구현한다.

## 완료 기준

- `mvn test`가 로컬 PostgreSQL 연결 통합 테스트를 포함해 통과한다.
- `GET /api/health` 또는 동등한 health endpoint가 DB 연결 상태를 구분해 보여준다.
- AIDD frontend가 snapshot JSON 없이 backend API로 최소 issue 목록을 읽을 수 있는 다음 PR 계획이 생긴다.
