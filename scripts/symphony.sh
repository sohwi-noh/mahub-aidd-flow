#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODE="${1:-local}"
ENV_FILE="${2:-}"
SYMPHONY_DIR="$ROOT_DIR/.local/openai-symphony/elixir"
WORKFLOW_FILE="$ROOT_DIR/WORKFLOW.md"
GUARDRAIL_FLAG="--i-understand-that-this-will-be-running-without-the-usual-guardrails"

case "$MODE" in
  local)
    ENV_FILE="${ENV_FILE:-$ROOT_DIR/symphony.env}"
    ;;
  shared)
    ENV_FILE="${ENV_FILE:-$ROOT_DIR/symphony.shared.env}"
    ;;
  *)
    echo "usage: scripts/symphony.sh [local|shared] [env-file]" >&2
    exit 64
    ;;
esac

if [[ ! -f "$ENV_FILE" ]]; then
  echo "missing env file: $ENV_FILE" >&2
  echo "copy symphony.env.example or symphony.shared.env.example first" >&2
  exit 66
fi

set -a
# shellcheck source=/dev/null
source "$ENV_FILE"
set +a

if [[ -z "${LINEAR_API_KEY:-}" ]]; then
  echo "LINEAR_API_KEY is required" >&2
  exit 78
fi

if [[ "$MODE" == "local" && -z "${LINEAR_ASSIGNEE:-}" ]]; then
  echo "LINEAR_ASSIGNEE is required in local mode. Use LINEAR_ASSIGNEE=me." >&2
  exit 78
fi

if [[ "$MODE" == "shared" && -z "${LINEAR_ASSIGNEE:-}" ]]; then
  unset LINEAR_ASSIGNEE
fi

export SYMPHONY_WORKSPACE_ROOT="${SYMPHONY_WORKSPACE_ROOT:-$ROOT_DIR/.local/symphony-workspaces}"
SYMPHONY_PORT="${SYMPHONY_PORT:-4100}"

cd "$SYMPHONY_DIR"
exec mise exec -- ./bin/symphony "$WORKFLOW_FILE" --port "$SYMPHONY_PORT" "$GUARDRAIL_FLAG"
