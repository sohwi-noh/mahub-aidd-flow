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

This repo has a conservative starter workflow:

```bash
/Users/so2/workspace-so2/foundary/WORKFLOW.md
```

It is configured for Linear project:

- Project: `MA Hub`
- Project URL: `https://linear.app/ktds-ai-eng/project/ma-hub-2f076b86e186`
- `tracker.project_slug`: `ma-hub-2f076b86e186`

The workflow intentionally listens only to the `Symphony Ready` Linear state so it will not pick up every `Todo` issue by accident.

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

This is not yet a code-writing automation loop. The first workflow only creates issue-local artifacts:

- `raw-linear.md`
- `00-intake.md`
- `bug-report.md`
- `graph-context.md`
- `evidence.md`
- `result.md`
- `insight-summary.md`

Later, after issue intake and evidence patterns stabilize, this can be expanded into Shympony/Symphony-driven handoffs and OMX TDD lanes.
