# Foundary

Foundary는 `AIDD` workflow/harness를 중심으로 `MA Hub` 제품 산출물을 개발하고 검증하는 작업 저장소입니다. 이 README는 로컬 기동/빌드 명령의 1차 기준입니다.

모든 작업은 Linear issue로 기록합니다.
Linear 라벨로 `harness` 작업과 `aidd`/`mahub` 코드 영역 작업을 구분합니다.

1. `harness`는 Codex가 바로 PR까지 처리하며 `.codex/`, `.omx/`, `docs/`는 `harness` 라벨 작업의 주요 표면입니다. 이 영역은 공통 잡동사니가 아니라 AIDD를 운영하기 위한 agent, artifact, 지식/절차 표면입니다.
2. 코드 영역 작업은 Symphony가 주관합니다. Symphony는 각 workflow 하위에 최소 1개 이상의 subagent 동작을 보장합니다. `mahub/`는 사람이 직접 제품 개발을 계속하는 주 작업면이 아니라, AIDD 이슈 기반 개발 루프가 변경하고 검증할 대상 산출물로 취급합니다.

## Codex 이슈 접수 기준

| 기준 | Codex 처리 |
|---|---|
| 주관 라벨 없음/충돌 | 접수하지 않습니다. 먼저 작업 주관 라벨을 하나로 고정합니다. |
| `harness` 라벨 포함 | Codex가 직접 PR 및 완료 처리를 할 수 있습니다. 단, `aidd`/`mahub` 주관 라벨과 함께 있으면 충돌로 봅니다. |
| `aidd`/`mahub` 라벨 포함 | Codex가 직접 처리하지 않습니다. `Symphony Ready`로 넘기기 전에 문제, 범위, 인수 조건, 검증 기준, 산출물이 이슈 발행 템플릿 기준을 어느 정도 충족하는지 한 번 점검합니다. `improvement`, `bug`, `frontend` 같은 보조 라벨은 함께 있어도 됩니다. |

| Linear 상태/표시 | 의미 |
|---|---|
| `Todo` | Codex gate 전이거나 아직 접수 검사가 끝나지 않은 상태입니다. |
| `Symphony Ready` | Codex gate를 통과해 Symphony가 가져갈 수 있는 상태입니다. |
| `In Progress` | `harness`는 Codex가, `aidd`/`mahub`는 Symphony가 처리 중인 상태입니다. |
| `보완 요청` | Symphony intake 결과 `needs-info`로 판정되어 사람이 이슈 정보를 보강해야 하는 상태입니다. |
| `확인 필요` | Symphony가 정해진 턴 안에 끝내지 못했거나 계속 진행할지 사람이 확인해야 하는 상태입니다. |
| `Done` | 산출물과 PR 확인 후 완료된 상태입니다. |

## 이슈-Artifact-PR 정합성 원칙

기본 단위는 **Linear issue 1개 → `.omx/artifacts/<ISSUE-ID>/run-*` 실행 기록 → GitHub PR 1개**입니다.

- 브랜치, commit, PR 제목/본문, artifact 경로에는 같은 Linear issue key를 사용합니다.
- 모든 subagent는 본인의 plan, plan의 근거(evidence), result를 해당 issue의 run 아래에 남깁니다.

## Symphony 운영 기준

Symphony는 Linear 이슈를 보고 AIDD workflow를 실행하는 로컬/서버 실행기입니다. secret 파일은 커밋하지 않습니다.

| 모드 | 기준 |
|---|---|
| 개인 로컬 | 자기 Linear key + `LINEAR_ASSIGNEE=me`로 자기 assigned issue만 처리합니다. |
| 공유 개발서버 | AIDD bot/service key로 `Symphony Ready` queue 전체를 처리합니다. 서버 Symphony는 한 대만 운영합니다. |

로컬에서는 각자 `symphony.env`를 만들고 아래 값을 넣습니다.

```bash
cp symphony.env.example symphony.env
LINEAR_API_KEY=lin_api_...
LINEAR_ASSIGNEE=me
```

대시보드:

```text
http://127.0.0.1:4100/
```

AIDD backend는 이후 실행 이력, stage, agent, token, artifact, PR, 상태값을 저장하는 control-plane으로 확장합니다.

Symphony는 `Symphony Ready`에 들어온 이슈의 라벨을 통과/실패 기준으로 다시 보지 않습니다. 라벨 검사는 Codex gate의 책임입니다. Symphony는 이슈를 잡는 순간 Linear 상태를 `In Progress`로 바꿉니다. Intake 결과가 `needs-info`이면 `보완 요청`으로 넘기고, 최대 3턴 이후에도 이슈가 계속 진행 중이면 `확인 필요`로 넘겨 반복 실행을 멈춥니다.

## AIDD / MA Hub 비교 기준

| 항목 | AIDD | MA Hub |
|---|---|---|
| 역할 | Workflow 관제/control-plane 영역 | AIDD가 개발/검증하는 제품 산출물 영역 |
| 루트 경로 | `aidd/` | `mahub/` |
| 개발 방식 | Linear issue → subagent workflow → PR/MR → graph/wiki 환류 | AIDD workflow가 필요 시 변경/검증 |
| 전체 기동 요청 | `AIDD 띄워줘`, `AIDD 실행해줘` | `MA Hub 검증용으로 띄워줘` |
| 전체 기동 범위 | `aidd/` 하위 frontend + backend 전체 | AIDD가 검증 중인 `mahub/` frontend/backend |
| Frontend 경로 | `aidd/frontend` | `mahub/frontend` |
| Frontend package name | `mahub-aidd-flow` | `boundary-frontend` |
| Frontend 로컬 기동 | `cd aidd/frontend`<br>`npm run dev -- --port 5174` | `cd mahub/frontend`<br>`npm run dev` |
| Frontend URL | `http://127.0.0.1:5174/` | Vite 기본값 `http://127.0.0.1:5173/` |
| Frontend 빌드/검증 | `cd aidd/frontend`<br>`npm install`<br>`npm test`<br>`npm run build` | `cd mahub/frontend`<br>`npm install`<br>`npm test`<br>`npm run build` |
| Backend 경로 | `aidd/backend` | `mahub/backend` |
| Backend module | Maven Spring Boot | Maven Spring Boot |
| Backend 상태 | Java 21 + Spring Boot + JPA 기준선 사용 중 | 사용 중 |
| Backend 로컬 기동 | `cd aidd/backend`<br>`JAVA_HOME="$JAVA21_HOME" mvn spring-boot:run` | `cd mahub/backend`<br>`JAVA_HOME="$JAVA21_HOME" mvn spring-boot:run` |
| Backend 빌드/검증 | `cd aidd/backend`<br>`JAVA_HOME="$JAVA21_HOME" mvn test` | `cd mahub/backend`<br>`JAVA_HOME="$JAVA21_HOME" mvn test` |
| Backend 확인 | `GET /api/health`<br>DB `UP`, database `aidd`, user `admin` | `GET /api/health`<br>정상 응답: `{"status":"ok"}` |
| Backend local DB | Homebrew `postgresql@18`<br>DB: `aidd`<br>app user: `admin` / `new1234!` | Homebrew `postgresql@18`<br>DB: `mahub`<br>app user: `admin` / `new1234!` |
| Local default login | `admin` / `new1234!` | 제품 backend 기준에 따름 |
| 주요 데이터/산출물 | `.omx/artifacts/<ISSUE-ID>/run-*`, `.codex/`, `docs/` | AIDD가 만든 제품 frontend/backend 코드 |
| 하위 README | [aidd/frontend/README.md](aidd/frontend/README.md)<br>[aidd/backend/README.md](aidd/backend/README.md) | [mahub/frontend/README.md](mahub/frontend/README.md)<br>[mahub/backend/README.md](mahub/backend/README.md) |

## 로컬 DB 설치 및 분리 기준

`AIDD backend`는 `aidd/backend`의 Java 21 Spring Boot 모듈을 기준으로 기동합니다. 로컬 DB는 Homebrew `postgresql@18`에서 AIDD와 MA Hub를 데이터베이스 이름으로 분리해 사용하고, 개발 중 schema 변경은 JPA entity와 Hibernate `ddl-auto=update`로 재기동 시 반영합니다. AIDD 상세 절차는 [docs/aidd-backend-local-postgresql.md](docs/aidd-backend-local-postgresql.md)에 기록합니다.

`MA Hub`를 직접 개발해야 한다고 해석하지 않습니다. MA Hub 변경은 AIDD workflow의 output으로 만들고, 이 저장소의 AIDD backend/dashboard는 그 과정을 추적하고 검증하는 control-plane입니다.

각 개발자는 자기 로컬 PostgreSQL에도 아래와 같은 DB 분리 구조를 만든다. AIDD와 MA Hub는 schema 이름이 아니라 **database 이름**으로 분리한다.

| 구분 | DB 이름 | JDBC URL | 계정 | 용도 |
|---|---|---|---|---|
| AIDD | `aidd` | `jdbc:postgresql://127.0.0.1:5432/aidd` | `admin` / `new1234!` | AIDD workflow 관제/control-plane 데이터 |
| MA Hub | `mahub` | `jdbc:postgresql://127.0.0.1:5432/mahub` | `admin` / `new1234!` | MA Hub 제품 backend 로컬 개발/검증 데이터 |

Homebrew PostgreSQL 18을 설치하고 서비스로 기동합니다.

```bash
brew install postgresql@18
brew services start postgresql@18
```

로컬 개발 공통 앱 계정과 AIDD/MA Hub DB를 만듭니다. 이미 DB가 있으면 해당 `createdb` 명령은 생략합니다.

```bash
export PG18_HOME=/opt/homebrew/opt/postgresql@18

$PG18_HOME/bin/psql postgres -c "CREATE ROLE admin LOGIN CREATEDB PASSWORD 'new1234!';"
$PG18_HOME/bin/createdb --owner admin aidd
$PG18_HOME/bin/createdb --owner admin mahub
$PG18_HOME/bin/psql "postgresql://admin:new1234%21@127.0.0.1:5432/aidd" -c "select current_database(), current_user;"
$PG18_HOME/bin/psql "postgresql://admin:new1234%21@127.0.0.1:5432/mahub" -c "select current_database(), current_user;"
```

이미 `admin` role이 있으면 비밀번호만 갱신합니다.

```bash
$PG18_HOME/bin/psql postgres -c "ALTER ROLE admin WITH LOGIN CREATEDB PASSWORD 'new1234!';"
```

AIDD backend는 기본값으로 `aidd`에 연결합니다. 개발 중 schema는 JPA entity를 기준으로 Hibernate `ddl-auto=update`가 반영합니다. AIDD local default login은 `admin/new1234!`이며, backend 재기동 시 `aidd_admin_account`에 반영됩니다. MA Hub backend도 로컬 개발에서는 같은 원칙으로 `mahub`를 사용하되, AIDD control-plane 데이터와 제품 데이터를 섞지 않습니다.

Linear issue 정보는 backend가 intake 시점에 가져와 `aidd` DB에 저장합니다. 개인 Linear API key는 커밋하지 않고 `LINEAR_API_KEY` 환경변수로만 주입합니다. 화면은 Linear를 직접 읽지 않고 DB에 저장된 issue/project/milestone과 AIDD workflow 산출물(stage, artifact, PR, token, agent 실행 정보)을 `GET /api/dashboard`로 조회합니다.

```bash
cd aidd/backend
export JAVA21_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
export LINEAR_API_KEY='<개인 Linear API key>'
JAVA_HOME="$JAVA21_HOME" mvn spring-boot:run
curl -X POST http://127.0.0.1:8080/api/linear/sync
curl http://127.0.0.1:8080/api/dashboard
```

## 공통 기준

### 저장소 구조

현재 활성 원격 저장소는 `foundary` 루트의 `mahub-aidd-flow` 하나입니다. 다만 로컬 작업 단위는 아래 4개 하위 프로젝트로 유지합니다.

| 로컬 작업 단위 | README | 설명 |
|---|---|---|
| `aidd/frontend` | [aidd/frontend/README.md](aidd/frontend/README.md) | AIDD workflow 관제 frontend |
| `aidd/backend` | [aidd/backend/README.md](aidd/backend/README.md) | AIDD control-plane backend |
| `mahub/frontend` | [mahub/frontend/README.md](mahub/frontend/README.md) | MA Hub 제품 frontend 산출물 |
| `mahub/backend` | [mahub/backend/README.md](mahub/backend/README.md) | MA Hub 제품 backend 산출물 |

과거에는 위 4개 하위 프로젝트가 각각 로컬 `.git` 맥락을 가졌고, 현재 그 메타데이터는 `.local/git-backups/` 아래에 백업되어 있습니다. 이 백업은 로컬 보존용이며 루트 저장소 커밋 대상이 아닙니다.

| 구분 | 경로 | 역할 |
|---|---|---|
| AIDD | `aidd/frontend` | AIDD frontend |
| AIDD | `aidd/backend` | AIDD control-plane backend |
| AIDD | `.omx/artifacts/` | AIDD workflow 실행 산출물 |
| AIDD | `.codex/` | AIDD agent, prompt, skill 정의 |
| AIDD | `docs/` | AIDD 운영/개발 절차와 결정 문서 |
| MA Hub | `mahub/frontend` | MA Hub frontend |
| MA Hub | `mahub/backend` | MA Hub backend |

### 원격 저장소

`foundary` 루트 저장소는 아래 원격을 사용합니다.

| 로컬 경로 | GitHub | 역할 |
|---|---|---|
| `.` | `https://github.com/sohwi-noh/mahub-aidd-flow` | Foundary canonical workspace |

Codex App이 만드는 `/Users/so2/.codex/worktrees/...` 경로는 임시 실행 표면입니다. 프로젝트의 source of truth나 기본 작업 경로로 사용하지 않습니다.

### MA Hub 서버 기동 Runbook

현재 `foundary/mahub` frontend/backend의 기동 상태 확인, profile별 재기동 명령, 외부 checkout 확인 시 환경변수 override 기준은 [docs/mahub-server-runbook.md](docs/mahub-server-runbook.md)에 정리합니다.

```bash
scripts/mahub-server.sh status loc all
scripts/mahub-server.sh restart loc all
```
