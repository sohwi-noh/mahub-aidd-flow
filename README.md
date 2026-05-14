# Boundary

KTD-9 개발환경 및 SW 아키텍처 기준선 scaffold입니다. Backend는 Java 21 LTS 기반 Spring Boot + Maven, Frontend는 React + Vite + TypeScript 기준으로 구성합니다.

## 연결 저장소 경로

현재 workspace에서는 실제 output repo를 `.worktrees/` 아래에 분리해 둡니다.

| 로컬 경로 | GitHub | 역할 |
|---|---|---|
| `.worktrees/mahub-api` | `https://github.com/sohwi-noh/mahub-api` | 제품 backend |
| `.worktrees/mahub-web` | `https://github.com/sohwi-noh/mahub-web` | 제품 frontend |
| `workflow/mahub-aidd-flow` | `https://github.com/sohwi-noh/mahub-aidd-flow` | AIDD workflow 관제 frontend |

## 사전 조건

- Java 21 LTS: `/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home`
- Maven 3.9 이상
- Node.js 20.19 이상
- npm 10 이상

전역 Java 버전을 바꾸지 않고 명령 실행 시 `JAVA_HOME`만 지정합니다.

```bash
export JAVA21_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
```

## Backend 개발/검증

```bash
cd backend
JAVA_HOME="$JAVA21_HOME" mvn test
JAVA_HOME="$JAVA21_HOME" mvn spring-boot:run
```

Backend test는 로컬 Java 21 기준으로 검증합니다. 일부 sandbox는 Mockito/ByteBuddy agent self-attach를 제한할 수 있으므로, 해당 환경에서 실패하면 같은 `JAVA_HOME`으로 로컬 권한 실행 결과를 함께 확인합니다.

기본 smoke endpoint는 `GET /api/health`이며 정상 응답은 `{"status":"ok"}`입니다.

## Frontend 개발/검증

```bash
cd frontend
npm install
npm test
npm run build
npm run dev
```

## 검증 순서

1. `JAVA21_HOME`이 Java 21 LTS 경로를 가리키는지 확인합니다.
2. `backend`에서 `JAVA_HOME="$JAVA21_HOME" mvn test`를 실행합니다.
3. `frontend`에서 `npm install`, `npm test`, `npm run build`를 실행합니다.
4. build/cache/dependency 산출물이 `.gitignore`에 의해 제외되는지 확인합니다.
5. `/understand` graph 생성은 scaffold와 ignore 정책 검토 이후 verifier 단계에서 실행 대상으로 넘깁니다.

## MAHub 서버 기동 확인

MAHub admin frontend/backend의 현재 기동 상태, loc/dev 분리, 재기동 명령은 [docs/mahub-server-runbook.md](docs/mahub-server-runbook.md)에 정리합니다.

```bash
scripts/mahub-server.sh status loc all
scripts/mahub-server.sh restart loc all
```
