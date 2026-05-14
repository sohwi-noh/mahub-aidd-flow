#!/usr/bin/env bash
set -euo pipefail

ACTION="${1:-status}"
PROFILE="${2:-loc}"
SERVICE="${3:-all}"

FRONTEND_DIR="${MAHUB_ADMIN_FRONTEND_DIR:-/Users/so2/workspace-so2/mahub-dev/mahub-admin}"
BACKEND_ROOT="${MAHUB_ADMIN_API_ROOT:-/Users/so2/workspace-so2/mahub-dev/mahub-api}"
FRONTEND_PORT="${MAHUB_ADMIN_FRONTEND_PORT:-5173}"
BACKEND_PORT="${MAHUB_ADMIN_BACKEND_PORT:-8085}"
JAVA17_HOME_DEFAULT="/opt/homebrew/Cellar/openjdk@17/17.0.19/libexec/openjdk.jdk/Contents/Home"

case "$PROFILE" in
  loc)
    FRONTEND_MODE="loc"
    BACKEND_PROFILE="local"
    ;;
  dev)
    FRONTEND_MODE="dev"
    BACKEND_PROFILE="dev"
    ;;
  *)
    echo "Unknown profile: $PROFILE" >&2
    echo "Usage: $0 {status|start|stop|restart} {loc|dev} {frontend|backend|all}" >&2
    exit 2
    ;;
esac

case "$SERVICE" in
  frontend|backend|all) ;;
  *)
    echo "Unknown service: $SERVICE" >&2
    echo "Usage: $0 {status|start|stop|restart} {loc|dev} {frontend|backend|all}" >&2
    exit 2
    ;;
esac

frontend_log="/private/tmp/mahub-admin-${PROFILE}.log"
backend_log="/private/tmp/mahub-admin-api-${PROFILE}.log"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 127
  fi
}

port_pids() {
  local port="$1"
  lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true
}

print_port_status() {
  local label="$1"
  local port="$2"
  local url="$3"
  local pids

  pids="$(port_pids "$port" | tr '\n' ' ' | sed 's/[[:space:]]*$//')"
  if [[ -n "$pids" ]]; then
    echo "[$label] LISTEN port=$port pid=$pids"
    lsof -nP -iTCP:"$port" -sTCP:LISTEN || true
    if curl -s -o /tmp/mahub-server-check.out -w "[$label] HTTP %{http_code} %{remote_ip}:%{remote_port}\n" "$url"; then
      :
    else
      echo "[$label] HTTP check failed: $url"
    fi
  else
    echo "[$label] DOWN port=$port"
  fi
}

status_frontend() {
  print_port_status "frontend/$PROFILE" "$FRONTEND_PORT" "http://127.0.0.1:${FRONTEND_PORT}/"
  echo "frontend dir: $FRONTEND_DIR"
  echo "frontend log: $frontend_log"
}

status_backend() {
  print_port_status "backend/$PROFILE" "$BACKEND_PORT" "http://127.0.0.1:${BACKEND_PORT}/actuator/health"
  echo "backend root: $BACKEND_ROOT"
  echo "backend log: $backend_log"
}

stop_by_port() {
  local label="$1"
  local port="$2"
  local pids

  pids="$(port_pids "$port")"
  if [[ -z "$pids" ]]; then
    echo "[$label] already stopped: port=$port"
    return
  fi

  echo "[$label] stopping pid(s): $(echo "$pids" | tr '\n' ' ')"
  # Graceful first. The caller can inspect status and escalate manually if needed.
  kill $pids
}

stop_frontend() {
  stop_by_port "frontend/$PROFILE" "$FRONTEND_PORT"
}

stop_backend() {
  stop_by_port "backend/$PROFILE" "$BACKEND_PORT"
}

start_frontend() {
  require_cmd npm
  if [[ ! -d "$FRONTEND_DIR" ]]; then
    echo "frontend dir not found: $FRONTEND_DIR" >&2
    exit 1
  fi

  if [[ -n "$(port_pids "$FRONTEND_PORT")" ]]; then
    echo "[frontend/$PROFILE] already listening on port $FRONTEND_PORT"
    return
  fi

  echo "[frontend/$PROFILE] starting: npm run $FRONTEND_MODE"
  (
    cd "$FRONTEND_DIR"
    nohup npm run "$FRONTEND_MODE" >"$frontend_log" 2>&1 &
    echo $! >"/private/tmp/mahub-admin-${PROFILE}.pid"
  )
  echo "[frontend/$PROFILE] log: $frontend_log"
}

start_backend() {
  if [[ ! -d "$BACKEND_ROOT" ]]; then
    echo "backend root not found: $BACKEND_ROOT" >&2
    exit 1
  fi

  if [[ -n "$(port_pids "$BACKEND_PORT")" ]]; then
    echo "[backend/$PROFILE] already listening on port $BACKEND_PORT"
    return
  fi

  echo "[backend/$PROFILE] starting: ./gradlew :mahub-admin-api:bootRun"
  (
    cd "$BACKEND_ROOT"
    nohup env \
      JAVA_HOME="${JAVA_HOME:-$JAVA17_HOME_DEFAULT}" \
      SPRING_PROFILES_ACTIVE="$BACKEND_PROFILE" \
      ./gradlew :mahub-admin-api:bootRun >"$backend_log" 2>&1 &
    echo $! >"/private/tmp/mahub-admin-api-${PROFILE}.pid"
  )
  echo "[backend/$PROFILE] log: $backend_log"
}

run_for_service() {
  local fn_frontend="$1"
  local fn_backend="$2"

  case "$SERVICE" in
    frontend) "$fn_frontend" ;;
    backend) "$fn_backend" ;;
    all)
      "$fn_frontend"
      "$fn_backend"
      ;;
  esac
}

case "$ACTION" in
  status)
    require_cmd lsof
    require_cmd curl
    run_for_service status_frontend status_backend
    ;;
  start)
    run_for_service start_frontend start_backend
    ;;
  stop)
    require_cmd lsof
    run_for_service stop_frontend stop_backend
    ;;
  restart)
    require_cmd lsof
    run_for_service stop_frontend stop_backend
    sleep 2
    run_for_service start_frontend start_backend
    ;;
  *)
    echo "Unknown action: $ACTION" >&2
    echo "Usage: $0 {status|start|stop|restart} {loc|dev} {frontend|backend|all}" >&2
    exit 2
    ;;
esac
