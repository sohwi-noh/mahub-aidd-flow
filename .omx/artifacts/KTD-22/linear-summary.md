# KTD-22 Linear 요약

## 이슈

- ID: `KTD-22`
- 제목: AIDD DB schema 기반 backend 구성으로 snapshot 의존 제거
- URL: https://linear.app/ktds-ai-eng/issue/KTD-22/aidd-db-schema-기반-backend-구성으로-snapshot-의존-제거
- 프로젝트: MA Hub
- 팀: Ktds
- 마일스톤: 환경 구성하기
- 상태: In Progress
- 우선순위: High
- 라벨: dashboard, Feature
- 생성: 2026-05-14T04:41:18.823Z
- 시작: 2026-05-14T04:47:56.474Z

## 배경

AIDD dashboard가 `.omx/artifacts`에서 생성한 snapshot JSON을 직접 읽는 구조라서 workflow가 커질수록 재생성/동기화 비용이 커진다. KTD-20에서 시작한 로컬 PostgreSQL + Spring Boot backend 기준을 이어받아 AIDD control-plane 데이터를 DB/JPA 기준으로 구성하고 frontend는 backend API를 읽도록 전환한다.

## 목표

- Homebrew `postgresql@18` 로컬 기준에서 AIDD DB 이름은 `aidd`, MA Hub 제품 DB 이름은 `mahub`로 분리한다.
- AIDD backend는 `aidd` DB에 연결하고, 개발 중 schema 변경은 JPA entity와 Hibernate `ddl-auto=update`로 재기동 시 반영한다.
- 기본 로컬 앱 계정은 `admin` / `new1234!`를 사용한다.
- AIDD workflow의 핵심 관제 데이터를 `aidd_issue`, `aidd_stage_run`, `aidd_artifact`, `aidd_pull_request` 같은 backend-owned table로 옮겨갈 수 있는 schema 기준을 만든다.
- AIDD frontend는 `src/generated/artifact-dashboard.json`, `src/generated/linear-project.json` 같은 build-time snapshot 의존을 제거하고 backend API에서 issue/status 데이터를 읽는다.
- README와 backend 문서에는 각 개발자가 자기 로컬 DB에도 동일하게 `aidd` / `mahub` database 분리 구조를 만드는 절차를 남긴다.

## 완료 기준

- `aidd/backend`가 `jdbc:postgresql://127.0.0.1:5432/aidd`에 `admin` 계정으로 연결된다.
- `GET /api/health`가 DB 이름 `aidd`, user `admin`을 반환한다.
- `GET /api/issues`가 JPA repository를 통해 PostgreSQL-backed 데이터를 반환한다.
- frontend generated snapshot JSON import가 제거된다.
- README와 `docs/aidd-backend-local-postgresql.md`에 로컬 PostgreSQL 설치, `aidd`/`mahub` DB 생성, JPA `ddl-auto=update` 개발 원칙이 기록된다.
- backend test/build와 frontend test/build 증거를 남긴다.

## 참고

- AIDD DB: `jdbc:postgresql://127.0.0.1:5432/aidd`
- MA Hub DB: `jdbc:postgresql://127.0.0.1:5432/mahub`
- local app user: `admin` / `new1234!`
