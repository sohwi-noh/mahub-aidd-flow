#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ACTION="${1:-status}"
MODE="${2:-local}"
ENV_FILE="${3:-}"
SESSION="${SYMPHONY_TMUX_SESSION:-symphony-$MODE}"
LOG_DIR="$ROOT_DIR/.local/logs"
LOG_FILE="$LOG_DIR/symphony-$MODE.log"

case "$MODE" in
  local)
    ENV_FILE="${ENV_FILE:-$ROOT_DIR/symphony.env}"
    ;;
  shared)
    ENV_FILE="${ENV_FILE:-$ROOT_DIR/symphony.shared.env}"
    ;;
  *)
    echo "usage: scripts/symphony-tmux.sh [start|status|stop|attach|logs] [local|shared] [env-file]" >&2
    exit 64
    ;;
esac

require_tmux() {
  if ! command -v tmux >/dev/null 2>&1; then
    echo "tmux is required for persistent Symphony local runs" >&2
    exit 69
  fi
}

is_running() {
  tmux has-session -t "$SESSION" 2>/dev/null
}

case "$ACTION" in
  start)
    require_tmux
    if [[ ! -f "$ENV_FILE" ]]; then
      echo "missing env file: $ENV_FILE" >&2
      echo "copy symphony.env.example or symphony.shared.env.example first" >&2
      exit 66
    fi

    if is_running; then
      echo "Symphony is already running in tmux session: $SESSION"
      exit 0
    fi

    mkdir -p "$LOG_DIR"
    printf -v run_cmd './scripts/symphony.sh %q %q >> %q 2>&1' "$MODE" "$ENV_FILE" "$LOG_FILE"
    tmux new-session -d -s "$SESSION" -c "$ROOT_DIR" "$run_cmd"
    sleep 1

    if is_running; then
      echo "Symphony started in tmux session: $SESSION"
      echo "Dashboard: http://127.0.0.1:${SYMPHONY_PORT:-4100}/"
      echo "Logs: $LOG_FILE"
    else
      echo "Symphony exited during startup. Check logs: $LOG_FILE" >&2
      exit 1
    fi
    ;;
  status)
    require_tmux
    if is_running; then
      echo "Symphony is running in tmux session: $SESSION"
    else
      echo "Symphony is not running in tmux session: $SESSION"
      exit 1
    fi
    ;;
  stop)
    require_tmux
    if is_running; then
      tmux send-keys -t "$SESSION" C-c
      sleep 1
      if is_running; then
        tmux kill-session -t "$SESSION"
      fi
      echo "Symphony stopped: $SESSION"
    else
      echo "Symphony is not running in tmux session: $SESSION"
    fi
    ;;
  attach)
    require_tmux
    exec tmux attach-session -t "$SESSION"
    ;;
  logs)
    if [[ -f "$LOG_FILE" ]]; then
      tail -n 80 "$LOG_FILE"
    else
      echo "no log file yet: $LOG_FILE"
      exit 1
    fi
    ;;
  *)
    echo "usage: scripts/symphony-tmux.sh [start|status|stop|attach|logs] [local|shared] [env-file]" >&2
    exit 64
    ;;
esac
