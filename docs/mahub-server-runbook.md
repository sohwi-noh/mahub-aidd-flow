# MAHub 서버 기동 Runbook

이 문서는 MAHub admin frontend/backend 서버를 매번 빠르게 확인하고, 필요할 때 같은 기준으로 재기동하기 위한 운영 메모다.

## 빠른 명령

```bash
# loc 전체 상태 확인
scripts/mahub-server.sh status loc all

# loc frontend/backend 개별 상태 확인
scripts/mahub-server.sh status loc frontend
scripts/mahub-server.sh status loc backend

# dev mode 상태 확인
scripts/mahub-server.sh status dev all

# 재기동
scripts/mahub-server.sh restart loc all
scripts/mahub-server.sh restart dev frontend
scripts/mahub-server.sh restart dev backend
```

`restart`는 대상 포트의 LISTEN 프로세스에 먼저 `TERM`을 보내고 2초 뒤 다시 기동한다. 즉시 강제 종료가 필요하면 상태 출력의 PID를 확인한 뒤 별도 판단으로 처리한다.

## loc/dev 기준

| 구분 | Frontend | Backend |
|---|---|---|
| loc | `npm run loc` | `SPRING_PROFILES_ACTIVE=local ./gradlew :mahub-admin-api:bootRun` |
| dev | `npm run dev` | `SPRING_PROFILES_ACTIVE=dev ./gradlew :mahub-admin-api:bootRun` |

기본 경로와 포트는 현재 로컬 개발 환경 기준이다.

| 항목 | 기본값 |
|---|---|
| Frontend 경로 | `/Users/so2/workspace-so2/mahub-dev/mahub-admin` |
| Backend root | `/Users/so2/workspace-so2/mahub-dev/mahub-api` |
| Frontend port | `5173` |
| Backend port | `8085` |
| Frontend log | `/private/tmp/mahub-admin-<loc|dev>.log` |
| Backend log | `/private/tmp/mahub-admin-api-<loc|dev>.log` |

경로/포트가 달라지면 환경변수로 덮어쓴다.

```bash
MAHUB_ADMIN_FRONTEND_DIR=/path/to/mahub-admin \
MAHUB_ADMIN_API_ROOT=/path/to/mahub-api \
MAHUB_ADMIN_FRONTEND_PORT=5173 \
MAHUB_ADMIN_BACKEND_PORT=8085 \
scripts/mahub-server.sh status loc all
```

## 현재 관측값

2026-05-13 기준으로 확인한 기동 상태는 다음과 같다.

| 서비스 | PID | 포트 | 경로 | HTTP |
|---|---:|---:|---|---|
| `mahub-admin` Vite | `32257` | `5173` | `/Users/so2/workspace-so2/mahub-dev/mahub-admin` | `GET /` = `200` |
| `MahubAdminApplication` | `32542` | `8085`, `35729` | `/Users/so2/workspace-so2/mahub-dev/mahub-api/mahub-admin-api` | `GET /` = `200`, `GET /actuator/health` = `{"result":"FAIL",...}` |

Backend 프로세스는 DB `20.41.112.76:14383`로 열린 연결이 관측됐다. `/actuator/health`는 HTTP 200으로 응답하지만 payload의 `result`가 `FAIL`이므로, 상태 확인 시 HTTP code와 payload를 함께 본다.

## 수동 확인 명령

```bash
jps -l
lsof -nP -iTCP:5173 -sTCP:LISTEN
lsof -nP -iTCP:8085 -sTCP:LISTEN
curl -s http://127.0.0.1:5173/
curl -s http://127.0.0.1:8085/actuator/health
tail -n 80 /private/tmp/mahub-admin-loc.log
tail -n 120 /private/tmp/mahub-admin-api-loc.log
```

macOS 권한 정책 때문에 `jcmd <pid> ...` attach는 `Operation not permitted`로 실패할 수 있다. 이 경우 `lsof`, `jps`, 로그, HTTP 응답 기준으로 확인한다.
