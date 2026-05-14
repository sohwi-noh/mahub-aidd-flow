# Understand-Anything Install Notes

Understand-Anything is already installed globally for this Codex environment.

## Installed Locally

- Repo: `/Users/so2/.understand-anything/repo`
- Plugin: `/Users/so2/.understand-anything/repo/understand-anything-plugin`
- Codex skills:
  - `/Users/so2/.codex/skills/understand`
  - `/Users/so2/.codex/skills/understand-dashboard`
  - `/Users/so2/.codex/skills/understand-chat`
  - `/Users/so2/.codex/skills/understand-diff`
  - `/Users/so2/.codex/skills/understand-domain`
  - `/Users/so2/.codex/skills/understand-explain`
  - `/Users/so2/.codex/skills/understand-knowledge`
  - `/Users/so2/.codex/skills/understand-onboard`

The Codex skill paths are symlinks into the installed plugin repo.

## Runtime

- Node: `/Users/so2/.nvm/versions/node/v20.20.2/bin/node`
- pnpm: `/Users/so2/.nvm/versions/node/v20.20.2/bin/pnpm`
- pnpm version: `10.33.4`

The core package is already built:

```text
/Users/so2/.understand-anything/repo/understand-anything-plugin/packages/core/dist/index.js
```

## Current Dashboard

The user-provided dashboard URL is local and tokenized:

```text
http://127.0.0.1:5173/?token=<local-token>
```

Do not commit the real token. When Symphony or another workflow needs the dashboard URL, pass it through environment:

```bash
export UNDERSTAND_ANYTHING_URL='http://127.0.0.1:5173/?token=...'
```

## Typical Commands

Analyze a repo from Codex:

```text
/understand /path/to/repo
```

Launch the graph dashboard:

```text
/understand-dashboard /path/to/repo
```

The dashboard requires `.understand-anything/knowledge-graph.json` in the target repo. If that file is missing, run `/understand` first.

## Notes For This Planning Repo

This `/Users/so2/workspace-so2/foundary` repo is currently a planning/config repo. It does not yet contain its own `.understand-anything/knowledge-graph.json`, and `.understand-anything/` is gitignored.

For the AI Foundry flow, treat Understand-Anything as the graph context provider:

1. Human creates a Linear issue.
2. Human or agent captures related graph files/symbols/domain notes.
3. The issue artifact stores the graph URL or snapshot reference.
4. Insight views group issues by domain, file, symbol, missing evidence, and recurring cause.
