# AIDD Backend

KTD-22 기준 AIDD workflow 관제용 control-plane backend 경로다.

## 책임

- AIDD dashboard가 읽는 issue/stage/agent/artifact/token/PR 데이터를 API로 제공한다.
- Linear GraphQL API에서 project/milestone/issue 정보를 가져와 `aidd` DB에 저장한다.
- AIDD가 MA Hub 산출물을 어떤 이슈/단계/subagent를 통해 변경했는지 추적한다.
- `.omx/artifacts/<ISSUE-ID>/run-*` markdown 산출물은 Linear 이슈와 연결된 실행 증거로 다룬다.
- `stage-index.md`는 schema 기준으로만 읽고, per-run evidence 저장소로 사용하지 않는다.
- MA Hub 제품 API와 섞이지 않는다. `mahub/backend`는 AIDD가 변경/검증할 제품 산출물 경계로 유지한다.

## 로컬 DB 기준

초기 DB는 각 개발자가 Homebrew PostgreSQL로 설치한다.

- formula: `postgresql@18`
- default admin: Homebrew cluster를 초기화한 macOS 사용자 계정
- 이 로컬의 admin 예시: `sohwi`
- DB: `aidd`
- app user: `admin`
- app password: `new1234!`
- default login account: `admin` / `new1234!`
- schema update: JPA/Hibernate `ddl-auto=update`

상세 설치와 DB 생성 절차는 [../../docs/aidd-backend-local-postgresql.md](../../docs/aidd-backend-local-postgresql.md)를 따른다.

## 실행

기본 실행은 로컬 PostgreSQL `aidd`에 `admin/new1234!`로 연결한다.

```bash
mvn spring-boot:run
curl http://127.0.0.1:8080/api/health
curl http://127.0.0.1:8080/api/linear/project
curl http://127.0.0.1:8080/api/issues
```

기본값을 바꾸려면 환경변수를 사용한다.

```bash
export AIDD_DB_URL=jdbc:postgresql://127.0.0.1:5432/aidd
export AIDD_DB_USERNAME=admin
export AIDD_DB_PASSWORD='new1234!'
export LINEAR_API_KEY='<개인 Linear API key>'
mvn spring-boot:run
```

Linear 동기화:

```bash
curl -X POST http://127.0.0.1:8080/api/linear/sync
curl http://127.0.0.1:8080/api/dashboard
```

`POST /api/linear/sync`는 issue 작업을 시작하거나 Linear intake가 필요한 시점에 수동으로 호출한다. backend는 기동만으로 주기 동기화를 돌리지 않는다.

AIDD workflow가 만든 stage/agent/artifact/token/PR 정보는 issue key 기준 DB 테이블에 저장된 값을 읽고, dashboard는 `GET /api/dashboard`를 source of truth로 사용한다. frontend는 runtime에 generated JSON을 직접 읽지 않는다.

## 구현 상태

1. Java 21 Spring Boot Maven scaffold를 추가했다.
2. 기본 profile에서 PostgreSQL 연결 값을 읽는다.
3. 개발 중 schema 변경은 JPA entity와 Hibernate `ddl-auto=update`로 재기동 시 반영한다.
4. `IssueEntity`, `LinearProjectEntity`, `LinearMilestoneEntity`, `StageRunEntity`, `ArtifactEntity`, `PullRequestEntity`, `AdminAccountEntity`가 `aidd_issue`, `aidd_linear_project`, `aidd_linear_milestone`, `aidd_stage_run`, `aidd_artifact`, `aidd_pull_request`, `aidd_admin_account`를 만든다.
5. `/api/health`, `/api/linear/sync`, `/api/linear/project`, `/api/issues`, `/api/dashboard`를 제공한다.
6. 기본 local login 계정 `admin/new1234!`를 `aidd_admin_account`에 hash seed로 만든다.
7. `mvn test`가 실제 PostgreSQL DB-backed 통합 테스트를 실행한다.

## 검증

```bash
mvn test
```

기본 DB 설정:

```bash
export AIDD_DB_URL=jdbc:postgresql://127.0.0.1:5432/aidd
export AIDD_DB_USERNAME=admin
export AIDD_DB_PASSWORD='new1234!'
mvn test
```

## 완료 기준

- `mvn test`가 실제 PostgreSQL 연결 기반 smoke/context/API contract를 통과한다.
- `GET /api/health`가 DB 연결 상태를 구분해 보여준다.
- `POST /api/linear/sync`가 Linear project/milestone/issue 정보를 DB에 저장한다.
- AIDD frontend는 generated JSON 없이 backend API로 Linear issue와 AIDD workflow 산출물 목록을 읽는다.
