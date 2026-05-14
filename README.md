# Foundary

Foundary는 `AIDD` workflow/harness를 중심으로 `MA Hub` 제품 산출물을 개발하고 검증하는 작업 저장소입니다. 이 README는 로컬 기동/빌드 명령의 1차 기준입니다.

`.codex/`, `.omx/`, `docs/`는 공통 잡동사니가 아니라 AIDD를 운영하기 위한 agent, artifact, 지식/절차 표면입니다. `mahub/`는 사람이 직접 제품 개발을 계속하는 주 작업면이 아니라, AIDD 이슈 기반 개발 루프가 변경하고 검증할 대상 산출물로 취급합니다.

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
| Backend module | TODO | Maven Spring Boot |
| Backend 상태 | 아직 별도 모듈 없음 | 사용 중 |
| Backend 로컬 기동 | TODO | `cd mahub/backend`<br>`JAVA_HOME="$JAVA21_HOME" mvn spring-boot:run` |
| Backend 빌드/검증 | TODO | `cd mahub/backend`<br>`JAVA_HOME="$JAVA21_HOME" mvn test` |
| Backend 확인 | TODO | `GET /api/health`<br>정상 응답: `{"status":"ok"}` |
| Backend local DB | Homebrew `postgresql@18`<br>admin: macOS 사용자 `$(whoami)`<br>이 로컬은 `sohwi`<br>app DB/user: `foundary_aidd` | 추후 dev profile 기준 정리 |
| 주요 데이터/산출물 | `.omx/artifacts/<ISSUE-ID>/run-*`, `.codex/`, `docs/` | AIDD가 만든 제품 frontend/backend 코드 |
| 관련 remote checkout | 루트 저장소 기준 | `.worktrees/mahub-api`<br>`.worktrees/mahub-web` |
| 개발환경/배포 상태 | GitHub Actions 배포 TODO | GitHub Actions 배포 TODO |

현재 `AIDD backend`는 아직 별도 모듈이 없으므로 `AIDD 띄워줘` 요청은 현재 존재하는 `aidd/frontend`를 기동하고 backend는 TODO 상태로 보고합니다. KTD-20부터 로컬 DB 기준은 각 개발자가 Homebrew `postgresql@18`을 설치해 `foundary_aidd` DB를 사용하는 방식으로 시작하며, 상세 절차는 [docs/aidd-backend-local-postgresql.md](docs/aidd-backend-local-postgresql.md)에 기록합니다.

`MA Hub`를 직접 개발해야 한다고 해석하지 않습니다. MA Hub 변경은 AIDD workflow의 output으로 만들고, 이 저장소의 AIDD backend/dashboard는 그 과정을 추적하고 검증하는 control-plane입니다.

## 개발환경/배포 TODO 비교

| 항목 | AIDD | MA Hub |
|---|---|---|
| GitHub Actions | `.github/workflows/`에 `aidd/frontend` build workflow 추가 | `.github/workflows/`에 `mahub/frontend` build workflow 추가 |
| 배포 대상 | AIDD dashboard/backend 배포 대상과 preview URL 확정 | AIDD가 검증할 MA Hub frontend/backend dev 대상 확정 |
| 환경변수 | AIDD dashboard runtime 환경변수와 `aidd/backend` local DB 환경변수 정리 | `mahub/backend` dev profile, secret, DB 연결 기준 정리 |
| 검증 | 배포 후 smoke check 기준 추가 | 배포 후 health check와 rollback 기준 문서화 |
| Backend TODO | `aidd/backend` Java 21 Spring Boot 모듈 생성, Homebrew PostgreSQL 연결 | 현재 `mahub/backend` 기준 유지 |

## 공통 기준

### 저장소 구조

현재 `foundary` 루트 저장소가 canonical workspace입니다. `aidd/`와 `mahub/`는 루트 저장소에 일반 폴더로 포함되어 있으며, 이전에 분리되어 있던 내부 `.git` 메타데이터는 로컬 백업 경로인 `.local/git-backups/` 아래에 보관합니다.

| 구분 | 경로 | 역할 |
|---|---|---|
| AIDD | `aidd/frontend` | AIDD frontend |
| AIDD | `aidd/backend` | TODO: AIDD backend 후보 경로 |
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

제품 저장소 remote 확인이나 별도 동기화가 필요할 때는 `.worktrees/` 아래에 별도 checkout을 둡니다. `.worktrees/`는 로컬 작업 디렉터리이며 루트 저장소에는 커밋하지 않습니다.

| 구분 | 로컬 경로 | GitHub | 역할 |
|---|---|---|---|
| MA Hub | `.worktrees/mahub-api` | `https://github.com/sohwi-noh/mahub-api` | MA Hub backend remote checkout |
| MA Hub | `.worktrees/mahub-web` | `https://github.com/sohwi-noh/mahub-web` | MA Hub frontend remote checkout |

### AIDD 운영 사전 조건

AIDD 자체를 기동/개발하는 조건과, AIDD가 MA Hub 산출물을 검증할 때 필요한 대상별 조건을 분리합니다. Foundary 전체를 매번 같은 순서로 검증하는 것이 아니라 현재 Linear 이슈가 건드린 AIDD surface와 산출 대상만 검증합니다.

#### AIDD 기본 조건

- Node.js 20.19 이상
- npm 10 이상
- Homebrew PostgreSQL `postgresql@18`: AIDD backend local DB 작업 시 사용
- Java 21 LTS 및 Maven 3.9 이상: AIDD backend scaffold/검증 시 사용

#### MA Hub 산출물 검증 조건

- `mahub/frontend` 검증 시 Node.js/npm을 사용합니다.
- `mahub/backend` 검증 시 Java 21/Maven을 사용합니다.
- `환경구성` 마일스톤 이후 backend 검증은 mock-only 테스트가 아니라 DB-backed 통합 테스트 증거를 포함해야 합니다.

전역 Java 버전을 바꾸지 않고 Java 21이 필요한 명령 실행 시 `JAVA_HOME`만 지정합니다.

```bash
export JAVA21_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
```

### 검증 순서 원칙

검증은 “전체 프로젝트 일괄 순서”가 아니라 “현재 이슈의 영향 범위” 기준으로 선택합니다.

1. AIDD harness/docs만 바뀐 경우: `git diff --check`와 문서 경로/링크 정합성을 확인합니다.
2. AIDD frontend가 바뀐 경우: `aidd/frontend`에서 `npm test`, `npm run build`를 실행합니다.
3. AIDD backend가 바뀐 경우: `aidd/backend`에서 `JAVA_HOME="$JAVA21_HOME" mvn test`를 실행하고, DB 기능은 로컬 `foundary_aidd` PostgreSQL 증거를 남깁니다.
4. MA Hub frontend 산출물이 바뀐 경우: `mahub/frontend`에서 `npm test`, `npm run build`를 실행합니다.
5. MA Hub backend 산출물이 바뀐 경우: `mahub/backend`에서 `JAVA_HOME="$JAVA21_HOME" mvn test`를 실행합니다. `환경구성` 마일스톤 이후에는 DB-backed 통합 테스트 증거가 필요합니다.
6. `/understand` graph 생성은 verifier/review 단계에서 graph refresh가 필요한 경우에만 실행합니다.

### MA Hub 서버 기동 Runbook

MA Hub admin frontend/backend의 현재 기동 상태, loc/dev 분리, 재기동 명령은 [docs/mahub-server-runbook.md](docs/mahub-server-runbook.md)에 정리합니다.

```bash
scripts/mahub-server.sh status loc all
scripts/mahub-server.sh restart loc all
```
