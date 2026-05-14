# Symphony Install Notes

Symphony is the OpenAI reference workflow orchestrator for polling Linear and launching Codex App Server workers. The current reference implementation is Elixir/OTP based.

## Installed Locally

- Reference repo: `.local/openai-symphony`
- Implementation: `.local/openai-symphony/elixir`
- Runtime manager: `mise`
- Runtime versions from `mise.toml`:
  - Erlang `28`
  - Elixir `1.19.5-otp-28`
- Built executable: `.local/openai-symphony/elixir/bin/symphony`

## Commands Used

```bash
brew install mise
git clone https://github.com/openai/symphony.git .local/openai-symphony
cd .local/openai-symphony/elixir
mise trust
mise install
mise exec -- mix setup
mise exec -- mix build
```

## Project Configuration

이 저장소의 1차 기준은 루트 [README.md](../README.md)입니다. 모든 작업은 Linear issue로 기록하고, Linear 라벨로 `harness` 작업과 `aidd`/`mahub` 코드 영역 작업을 구분합니다.

| 기준 | 처리 |
|---|---|
| Linear 라벨 없음/혼합 | 접수하지 않고, 먼저 작업 라벨을 하나로 고정합니다. |
| `harness` 라벨 | Codex가 직접 PR 및 완료 처리를 할 수 있습니다. Symphony 처리 대상이 아닙니다. |
| `aidd`/`mahub` 라벨 | Codex가 intake를 점검한 뒤 `Symphony Ready`로 넘기고, 이후 Symphony가 주관합니다. |

This repo has a conservative starter workflow:

```bash
/Users/so2/workspace-so2/foundary/WORKFLOW.md
```

It is configured for Linear project:

- Project: `MA Hub`
- Project URL: `https://linear.app/ktds-ai-eng/project/ma-hub-2f076b86e186`
- `tracker.project_slug`: `ma-hub-2f076b86e186`

The workflow intentionally listens only to the `Symphony Ready` Linear state so it will not pick up every `Todo` issue by accident. Symphony는 각 workflow 하위에 최소 1개 이상의 subagent 동작을 보장합니다.

## Before Running

Create or export:

```bash
export LINEAR_API_KEY=...
export UNDERSTAND_ANYTHING_URL='http://127.0.0.1:5173/?token=...'
```

The Linear token must be a personal API key from Linear settings. Do not commit it.

## Run

From the Symphony Elixir directory:

```bash
cd /Users/so2/workspace-so2/foundary/.local/openai-symphony/elixir
mise exec -- ./bin/symphony /Users/so2/workspace-so2/foundary/WORKFLOW.md --port 4100
```

Dashboard:

```text
http://127.0.0.1:4100/
```

## Current Intent

현재 starter workflow의 첫 pass는 issue-local artifact를 만들고, 이후 구현 단계가 이어질 수 있도록 intake와 evidence를 정규화합니다.

- `raw-linear.md`
- `00-intake.md`
- `bug-report.md`
- `graph-context.md`
- `evidence.md`
- `result.md`
- `insight-summary.md`

구현 단계는 `aidd`/`mahub` 라벨 이슈가 Codex gate를 통과해 `Symphony Ready`가 된 뒤 Symphony가 주관합니다.
