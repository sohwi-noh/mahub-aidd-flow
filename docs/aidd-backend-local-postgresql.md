# AIDD backend 로컬 PostgreSQL 기준

## 목적

KTD-20부터 AIDD dashboard의 generated JSON 갱신 부담을 줄이기 위해 `aidd/backend` control-plane backend를 준비했고, KTD-22에서 DB/JPA 기반 backend 전환 기준으로 확정했다. 이 문서는 로컬 DB 기준을 정한다.

이 DB는 MA Hub 제품 DB가 아니다. AIDD가 이슈, subagent, evidence, token, PR, graph/wiki 환류를 추적하기 위한 control-plane DB다.

## 결정

- 설치 방식: 각 개발자가 Homebrew로 PostgreSQL을 설치한다.
- 기준 formula: `postgresql@18`
- cluster owner 계정: Homebrew PostgreSQL cluster를 초기화한 macOS 사용자 계정
- 이 로컬 머신의 admin 계정 예시: `sohwi`
- 로컬 DB 이름: `aidd`
- MA Hub 로컬 DB 이름: `mahub`
- 로컬 애플리케이션 사용자: `admin`
- 로컬 애플리케이션 비밀번호: `new1234!`
- AIDD local 기본 로그인 계정: `admin` / `new1234!`
- schema 반영 방식: 개발 중에는 JPA/Hibernate `ddl-auto=update`
- backend 경로: `aidd/backend`
- DB 성격: AIDD control-plane 전용. MA Hub 제품 데이터 저장소로 사용하지 않는다.
- 이 문서의 비밀번호 값은 로컬 개발 예시이며, 운영/공유 secret으로 사용하지 않는다.

## 기본 admin 계정

Homebrew PostgreSQL은 팀 공용 `postgres` 비밀번호를 자동으로 정해주지 않는다. 기본적으로 `initdb`를 실행한 macOS 사용자 계정이 로컬 cluster owner/admin 역할을 한다.

이 머신에서 확인한 macOS 사용자 계정은 `sohwi`다.

```bash
whoami
```

따라서 cluster owner 점검은 아래처럼 시작할 수 있다.

```bash
psql postgres
psql postgres -c "select current_user;"
```

개발자가 다른 macOS 계정을 사용하면 cluster owner 계정명도 달라질 수 있다. 애플리케이션 접속은 공통 로컬 role인 `admin`을 사용한다.

## 설치

각 개발자는 자기 로컬 PostgreSQL에도 동일하게 `aidd`와 `mahub` DB를 분리해서 만든다. AIDD control-plane 데이터와 MA Hub 제품 데이터는 같은 DB에 섞지 않는다.

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
psql postgres -c "CREATE ROLE admin LOGIN CREATEDB PASSWORD 'new1234!';"
createdb --owner admin aidd
createdb --owner admin mahub
```

이미 같은 role이나 DB가 있으면 먼저 존재 여부를 확인한다. role이 이미 있으면 비밀번호를 갱신한다.

```bash
psql postgres -c "\\du admin"
psql postgres -c "ALTER ROLE admin WITH LOGIN CREATEDB PASSWORD 'new1234!';"
psql postgres -c "\\l aidd"
```

## backend 환경변수 초안

`aidd/backend`가 생성되면 로컬 실행은 아래 값을 기준으로 시작한다.

```bash
export AIDD_DB_URL=jdbc:postgresql://127.0.0.1:5432/aidd
export AIDD_DB_USERNAME=admin
export AIDD_DB_PASSWORD='new1234!'
```

환경변수 예시는 추후 `aidd/backend/.env.example` 또는 `aidd/backend/README.md`로 승격한다. 실제 개인 비밀번호는 `.env.local` 같은 git 제외 파일에만 둔다.

## 개발 schema 기준

backend는 generated JSON을 영구 원천으로 삼지 않는다. Linear issue 정보는 intake 시점에 backend가 가져와 DB에 저장하고, 이후 AIDD workflow가 남긴 stage/agent/artifact/token/PR 실행 정보는 같은 issue key에 붙여 저장한다. dashboard는 DB에서 조립한 `GET /api/dashboard` 응답을 읽는다.

개발 초기에는 JPA entity를 schema 기준으로 두고 `spring.jpa.hibernate.ddl-auto=update`로 재기동 시 변경을 반영한다. 운영/공유 환경으로 올릴 때 Flyway 또는 Liquibase migration으로 전환한다.

현재 backend 테이블:

| 테이블 | 목적 |
|---|---|
| `aidd_issue` | Linear issue, project, milestone, label, status |
| `aidd_linear_project` | Linear project 기준 정보와 active milestone |
| `aidd_linear_milestone` | Linear project milestone 목록, 진행률, target date |
| `aidd_stage_run` | issue별 stage 진행, agent, model, timing, token |
| `aidd_artifact` | 판단 근거/계획/결과 markdown path와 요약 |
| `aidd_pull_request` | issue와 GitHub PR 연결 |
| `aidd_admin_account` | AIDD local login 계정 seed |

local 기본 로그인 계정은 `admin/new1234!`다. backend는 재기동 시 JPA seed로 이 계정을 `aidd_admin_account`에 넣고, 비밀번호는 local-dev hash로 저장한다. 운영/공유 환경에서는 별도 password encoder와 secret 주입 방식으로 전환한다.

Linear 정보는 backend가 Linear GraphQL API에서 가져와 DB에 저장한다. 개인 API key는 커밋하지 않고 `LINEAR_API_KEY` 환경변수로만 주입한다. 기본 project id는 MA Hub project(`3343822b-769f-4f7e-83b8-c14c55af5572`)이며 필요하면 `LINEAR_PROJECT_ID`로 override한다. 이 호출은 backend 기동 시 자동 주기 실행하지 않고, issue intake나 작업 시작 시점에 명시적으로 호출한다.

```bash
export LINEAR_API_KEY='<개인 Linear API key>'
curl -X POST http://127.0.0.1:8080/api/linear/sync
curl http://127.0.0.1:8080/api/linear/project
curl http://127.0.0.1:8080/api/issues
curl http://127.0.0.1:8080/api/dashboard
```

## TDD 기준

환경구성 마일스톤 이후 backend 완료 증거는 mock-only 테스트로 인정하지 않는다. KTD-20 이후 backend PR은 최소 아래 검증을 남긴다.

1. DB connection smoke test
2. JPA schema update 검증
3. health endpoint 검증
4. repository 또는 query adapter가 실제 PostgreSQL에 읽기/쓰기 하는 통합 테스트
5. Linear sync는 GraphQL client를 mock 처리하되, 저장/조회는 실제 PostgreSQL에 쓰는 통합 테스트

## 로컬 점검 명령

```bash
pg_isready -h 127.0.0.1 -p 5432 -d aidd
psql "postgresql://admin:new1234%21@127.0.0.1:5432/aidd" -c "select current_database(), current_user;"
```
