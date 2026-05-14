---
tracker:
  kind: linear
  project_slug: "ma-hub-2f076b86e186"
  api_key: $LINEAR_API_KEY
  assignee: $LINEAR_ASSIGNEE
  active_states:
    - Symphony Ready
  terminal_states:
    - Closed
    - Cancelled
    - Canceled
    - Duplicate
    - Done
polling:
  interval_ms: 15000
workspace:
  root: /Users/so2/workspace-so2/foundary/.local/symphony-workspaces
hooks:
  after_create: |
    cp /Users/so2/workspace-so2/foundary/ai-foundry-architecture.md ./ai-foundry-architecture.md
    mkdir -p .omx/artifacts
agent:
  max_concurrent_agents: 1
  max_turns: 1
codex:
  command: codex --config shell_environment_policy.inherit=all --config 'model="gpt-5.5"' --config model_reasoning_effort=medium app-server
  approval_policy: never
  thread_sandbox: workspace-write
  turn_sandbox_policy:
    type: workspaceWrite
---

You are working on Linear issue `{{ issue.identifier }}` in the MA Hub project.

This workflow is intentionally conservative. It is not an autonomous code-writing loop yet.
The goal is to normalize human-created Linear issues and bug reports into reusable evidence,
graph context, wiki memory, and insight artifacts.

Issue context:

- Identifier: `{{ issue.identifier }}`
- Title: `{{ issue.title }}`
- Current status: `{{ issue.state }}`
- Labels: `{{ issue.labels }}`
- URL: `{{ issue.url }}`

Description:

{% if issue.description %}
{{ issue.description }}
{% else %}
No description provided.
{% endif %}

Operating rules:

1. Do not implement product code.
2. Do not open or update pull requests.
3. Do not run destructive commands.
4. Treat Linear as the human intake source.
5. Treat understand-anything as the code graph context source.
6. Keep evidence, inference, unknowns, and follow-ups separate.
7. Write only issue-local planning artifacts in `.omx/artifacts/{{ issue.identifier }}/`.

Expected local artifact bundle:

```text
.omx/artifacts/{{ issue.identifier }}/
  raw-linear.md
  00-intake.md
  bug-report.md
  graph-context.md
  evidence.md
  human-notes.md
  result.md
  insight-summary.md
```

Step 1. Create or update the artifact folder for this issue.

Step 2. Write `raw-linear.md` with the issue title, URL, status, labels, and original description.

Step 3. Write `00-intake.md` with:

- issue type: feature, bug, task, or research
- problem statement
- affected domain
- severity or urgency if present
- owner or requester if present
- acceptance criteria if present
- missing intake fields

Step 4. If the issue is a bug or contains failure language, write `bug-report.md` with:

- expected behavior
- actual behavior
- reproduction steps
- environment
- evidence links
- workaround
- missing bug-report fields

Step 5. Write `graph-context.md`.

Use the local understand-anything URL from the `UNDERSTAND_ANYTHING_URL` environment variable when available.
If graph context is not available inside the agent session, record what graph information is needed from the human:

- related files
- related symbols
- affected domain boundary
- upstream/downstream dependencies
- graph screenshot or URL

Step 6. Write `evidence.md` with three sections:

- Evidence: direct facts from Linear, files, graph, logs, screenshots, or other artifacts
- Inference: reasoned interpretation, with confidence
- Unknowns: questions the current evidence does not settle

Step 7. Write `result.md` with:

- disposition: triaged, needs-info, ready-for-analysis, or blocked
- reason
- recommended next human action

Step 8. Write `insight-summary.md` with:

- candidate insight tags
- likely hotspot dimensions: domain, file, symbol, missing evidence, missing test, repeated manual step
- whether this issue contributes to an automation candidate

Final response should summarize the artifacts created and the missing human inputs. Keep it short.
