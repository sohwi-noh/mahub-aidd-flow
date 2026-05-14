# AIDD backend 로컬 PostgreSQL 기준

## 목적

KTD-20부터 AIDD dashboard의 snapshot 갱신 부담을 줄이기 위해 `aidd/backend` control-plane backend를 준비한다. 이 문서는 첫 로컬 DB 기준을 정한다.

이 DB는 MA Hub 제품 DB가 아니다. AIDD가 이슈, subagent, evidence, token, PR, graph/wiki 환류를 추적하기 위한 control-plane DB다.

## 결정

- 설치 방식: 각 개발자가 Homebrew로 PostgreSQL을 설치한다.
- 기준 formula: `postgresql@18`
- 기본 admin 계정: Homebrew PostgreSQL cluster를 초기화한 macOS 사용자 계정
- 이 로컬 머신의 admin 계정 예시: `sohwi`
- 로컬 DB 이름: `foundary_aidd`
- 로컬 DB 사용자: `foundary_aidd`
- 로컬 profile 이름: `local`
- backend 후보 경로: `aidd/backend`
- DB 성격: AIDD control-plane 전용. MA Hub 제품 데이터 저장소로 사용하지 않는다.
- 이 문서의 비밀번호 값은 로컬 개발 예시이며, 운영/공유 secret으로 사용하지 않는다.

## 기본 admin 계정

Homebrew PostgreSQL은 팀 공용 `postgres` 비밀번호를 자동으로 정해주지 않는다. 기본적으로 `initdb`를 실행한 macOS 사용자 계정이 로컬 cluster owner/admin 역할을 한다.

이 머신에서 확인한 macOS 사용자 계정은 `sohwi`다.

```bash
whoami
```

따라서 이 로컬에서는 admin 점검을 아래처럼 시작할 수 있다.

```bash
psql postgres
psql postgres -c "select current_user;"
```

개발자가 다른 macOS 계정을 사용하면 admin 계정명도 달라질 수 있다. 문서와 코드에서는 공용 admin 계정에 의존하지 않고, 애플리케이션 접속은 별도 role인 `foundary_aidd`만 사용한다.

## 설치

```bash
brew install postgresql@18
brew services start postgresql@18
```

`postgresql@18`은 keg-only formula일 수 있으므로 CLI는 절대 경로를 기준으로 기록한다.

```bash
export PG18_HOME=/opt/homebrew/opt/postgresql@18
export PATH="$PG18_HOME/bin:$PATH"
```

## DB 생성

```bash
createuser --createdb foundary_aidd
psql postgres -c "ALTER USER foundary_aidd WITH PASSWORD 'foundary_aidd_local';"
createdb --owner foundary_aidd foundary_aidd
```

이미 같은 role이나 DB가 있으면 먼저 존재 여부를 확인한다.

```bash
psql postgres -c "\\du foundary_aidd"
psql postgres -c "\\l foundary_aidd"
```

## backend 환경변수 초안

`aidd/backend`가 생성되면 로컬 실행은 아래 값을 기준으로 시작한다.

```bash
export AIDD_DB_URL=jdbc:postgresql://127.0.0.1:5432/foundary_aidd
export AIDD_DB_USERNAME=foundary_aidd
export AIDD_DB_PASSWORD=foundary_aidd_local
```

환경변수 예시는 추후 `aidd/backend/.env.example` 또는 `aidd/backend/README.md`로 승격한다. 실제 개인 비밀번호는 `.env.local` 같은 git 제외 파일에만 둔다.

## 첫 schema 계획

초기 backend는 snapshot JSON을 영구 원천으로 삼지 않는다. snapshot은 bootstrap/import 자료이고, DB에는 조회와 증분 갱신이 필요한 관제 데이터를 정규화한다.

첫 테이블 후보:

| 테이블 | 목적 |
|---|---|
| `aidd_issue` | Linear issue, project, milestone, label, status |
| `aidd_stage_run` | issue별 stage 진행, agent, model, timing, token |
| `aidd_artifact` | 판단 근거/계획/결과 markdown path와 요약 |
| `aidd_pull_request` | issue와 GitHub PR 연결 |

첫 migration은 `aidd/backend/src/main/resources/db/migration` 아래에 둔다. migration 도구는 backend scaffold 시점에 Flyway와 Liquibase 중 하나로 확정한다.

## TDD 기준

환경구성 마일스톤 이후 backend 완료 증거는 mock-only 테스트로 인정하지 않는다. KTD-20 이후 backend PR은 최소 아래 검증을 남긴다.

1. DB connection smoke test
2. migration apply 검증
3. health endpoint 검증
4. repository 또는 query adapter가 실제 PostgreSQL에 읽기/쓰기 하는 통합 테스트

## 로컬 점검 명령

```bash
pg_isready -h 127.0.0.1 -p 5432 -d foundary_aidd
psql "postgresql://foundary_aidd:foundary_aidd_local@127.0.0.1:5432/foundary_aidd" -c "select current_database(), current_user;"
```

## 미정

- migration 도구: Flyway 또는 Liquibase
- backend port: Spring Boot 기본 `8080` 사용 여부
- frontend API base URL 환경변수 이름
- snapshot import batch를 backend 내부 command로 둘지 별도 script로 둘지
