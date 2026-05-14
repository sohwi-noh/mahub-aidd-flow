<!-- AUTONOMY DIRECTIVE — DO NOT REMOVE -->
YOU ARE AN AUTONOMOUS CODING AGENT. EXECUTE TASKS TO COMPLETION WITHOUT ASKING FOR PERMISSION.
DO NOT STOP TO ASK "SHOULD I PROCEED?" — PROCEED. DO NOT WAIT FOR CONFIRMATION ON OBVIOUS NEXT STEPS.
IF BLOCKED, TRY AN ALTERNATIVE APPROACH. ONLY ASK WHEN TRULY AMBIGUOUS OR DESTRUCTIVE.
USE CODEX NATIVE SUBAGENTS FOR INDEPENDENT PARALLEL SUBTASKS WHEN THAT IMPROVES THROUGHPUT. THIS IS COMPLEMENTARY TO OMX TEAM MODE.
<!-- END AUTONOMY DIRECTIVE -->

## 프로젝트 언어 정책

- 이 저장소에서 새로 작성하거나 갱신하는 Markdown 문서는 기본적으로 한국어로 작성한다.
- 코드 식별자, 명령어, 파일 경로, 설정 키, API 명칭, 외부 제품명은 원문/영문을 유지할 수 있다.
- 사용자가 명시적으로 영문 문서를 요청하거나 외부 제출 양식이 영문을 요구하는 경우에만 예외로 한다.
- Linear 이슈, MR 본문, Wiki/운영 기록, `.omx/artifacts/**/*.md`, `docs/**/*.md` 산출물에도 이 정책을 적용한다.

## Codex 이슈 접수 정책

- 모든 작업은 Linear issue로 기록한다.
- Linear 라벨로 `harness` 작업과 `aidd`/`mahub` 코드 영역 작업을 구분한다.
- Linear 라벨은 처리 전에 반드시 하나의 작업 주관으로 고정한다.
- 라벨 없음/혼합 이슈는 접수하지 않고, 먼저 작업 라벨을 하나로 고정하도록 요청한다.
- `harness` 라벨 이슈만 Codex가 직접 branch, commit, PR, 완료 처리를 할 수 있다.
- `aidd`/`mahub` 라벨 이슈는 Codex가 직접 코드 수정, branch 생성, commit, PR 생성을 수행하지 않는다.
- `aidd`/`mahub` 라벨 이슈는 `Symphony Ready`로 넘기기 전에 문제, 범위, 인수 조건, 검증 기준, 산출물이 이슈 발행 템플릿 기준을 어느 정도 충족하는지 1회 점검한다.
- intake 검사에서 필수 정보가 부족하면 이슈를 `Symphony Ready`로 전환하지 않고 사용자에게 보완 질문을 한다.
- intake 검사를 통과한 `aidd`/`mahub` 이슈만 `Symphony Ready`로 전환한다.
- `harness` 라벨이 아닌 이슈는 연결된 PR이 생성되기 전에는 Linear 완료 상태로 전환하지 않는다.
- `harness` 라벨 이슈라도 AIDD control-plane 제품 코드나 MA Hub 제품 산출물 변경이 포함되면 직접 처리 예외를 적용하지 않고 별도 구현 이슈로 분리한다.
- `harness` 라벨 직접 PR의 commit/PR 본문에는 이 작업이 제품 개발이 아니라 하네스/운영 계약 변경이라 Codex가 직접 처리했다는 사유를 남긴다.

Linear 라벨 라우팅 기준:

| 기준 | Codex 처리 |
|---|---|
| Linear 라벨 없음/혼합 | 접수하지 않는다. 먼저 작업 라벨을 하나로 고정한다. |
| `harness` 라벨 | Codex가 직접 PR 및 완료 처리를 할 수 있다. |
| `aidd`/`mahub` 라벨 | Codex가 직접 처리하지 않는다. `Symphony Ready`로 넘기기 전에 문제, 범위, 인수 조건, 검증 기준, 산출물이 이슈 발행 템플릿 기준을 어느 정도 충족하는지 한 번 점검한다. |

## Subagent 관측 정책

- Linear 이슈 단위로 subagent workflow를 실행할 때는 `.omx/artifacts/<ISSUE-ID>/run-<NNN>/` 아래에 실행 기록을 남긴다.
- Symphony는 각 workflow 하위에 최소 1개 이상의 subagent 동작을 보장한다.
- 모든 subagent는 본인의 plan, plan의 근거(evidence), result를 작성한다.
- evidence에는 사용자 프롬프트, 검색 결과, 로컬 코드/문서 확인, 다른 agent 결과물처럼 plan에 사용한 근거를 포함한다.
- 각 subagent의 시작/종료 관측 시각, 상태, 담당 모델, reasoning effort, 계획/결과/증거 파일 경로를 `run.jsonl`과 `run-summary.md`에 기록한다.
- per-subagent 정확 토큰 사용량이 도구에서 노출되지 않으면 `reported*Tokens`는 `null`로 두고, 산출물 기준 `estimatedVisibleTokens`와 한계를 명시한다.
- read-only agent가 파일을 직접 쓰지 못하면 실패 이벤트를 남기고, 필요한 경우 `executor`가 대리 기록하되 대리 기록 사실을 산출물 상단에 명시한다.

## TDD 개발 정책

- 구현 이슈는 기본적으로 TDD 순서를 따른다: 요구사항 정규화 → 테스트 기준 작성 → 실패 확인 → 최소 구현 → 통과 확인 → 리팩터링 → 재검증.
- `executor`는 `test-engineer` 또는 동등한 산출물이 테스트 기준을 먼저 남기기 전에는 제품 코드 구현을 시작하지 않는다.
- scaffold/환경 구성 이슈도 TDD 예외가 아니다. 이 경우 테스트는 business logic test가 아니라 build, smoke, health check, lint/typecheck 같은 실행 가능한 품질 기준으로 정의한다.
- 각 TDD 단계의 실패/통과 증거는 `.omx/artifacts/<ISSUE-ID>/run-<NNN>/evidence/` 아래에 남긴다.
- 테스트를 먼저 만들 수 없는 경우에는 그 이유와 대체 검증 기준을 `run-summary.md`에 명시한다.

## Linear 마일스톤별 테스트 정책

- Linear의 `환경구성` 마일스톤까지는 build, smoke, health check, context load, lint/typecheck 같은 기준선 검증을 허용한다.
- `환경구성` 마일스톤 이후의 backend 구현 이슈에서는 mock 객체 기반 테스트를 완료 증거로 인정하지 않는다.
- `환경구성` 이후 backend 테스트는 실제 DB 연결을 포함한 DB-backed 통합 테스트를 기본 gate로 둔다.
- 외부 시스템 전체를 항상 붙일 수 없는 경우에도 DB schema, transaction, repository/service 경계를 실제 DB 또는 합의된 test container DB로 검증해야 한다.
- mock 객체가 필요하다고 판단되면 적용 전에 별도 evidence에 사유, 대체 불가성, 사용자 승인 필요 여부를 남긴다.

## E2E 시나리오 테스트 보호 정책

- 이 정책은 autonomy directive의 예외다. 일반 자동 실행 원칙보다 E2E 테스트 보호 정책이 우선한다.
- Agent는 사용자의 명시적 개입/승인 없이는 E2E 테스트 코드, E2E 시나리오 정의, E2E 전용 fixture/mock/helper를 단독으로 수정하지 않는다.
- Subagent 검토 artifact는 승인 주체가 아니다. 그 역할은 수정 필요성 검토, 권고, 대상 범위와 제외 범위 정의로 제한한다.
- 사용자 명시 승인 전 agent는 E2E 테스트 변경 patch를 적용하지 않고, 실패 증거와 제안만 `.omx/artifacts/<ISSUE-ID>/run-<NNN>/evidence/` 또는 subagent artifact에 남긴다.
- 사용자가 명시 승인한 경우에도 수정 범위는 사용자가 승인한 E2E 테스트 파일/시나리오와 그 테스트 실행에 직접 필요한 E2E 전용 fixture/mock/helper로 제한한다.
- 승인 범위 밖의 E2E 테스트 코드, E2E 시나리오 정의, E2E 전용 fixture/mock/helper를 바꾸려면 별도 사용자 승인이 필요하다.
- Product code 변경은 E2E 테스트 변경이 아니지만, E2E 실패를 고치기 위한 product code 변경도 stage 6 gate와 일반 TDD artifact를 따라야 한다.
- E2E 테스트 변경 subagent는 수정 대상 후보, 수정 사유, 권고 범위, 제외 범위, 사용자 승인 필요 여부를 남겨야 한다.

## 테스트 실행 오류 기록 정책

- 테스트 실행 중 오류, 실패, 환경성 실패가 발생하면 반드시 `.omx/artifacts/<ISSUE-ID>/run-<NNN>/evidence/` 아래에 기록한다.
- 오류 기록에는 실행 명령, exit code, 실패 요약, 원인 분류, 다음 조치를 포함한다.
- 원인 분류는 최소한 제품 결함, 테스트 결함, 환경 제약, 의존성/도구 문제, 미분류 중 하나로 명시한다.
- 환경성 실패도 생략하지 않는다. 재실행으로 통과했더라도 최초 실패 기록, 재실행 명령, 재검증 통과 기록을 함께 남긴다.

<!-- omx:generated:agents-md -->

# oh-my-codex - Intelligent Multi-Agent Orchestration

You are running with oh-my-codex (OMX), a coordination layer for Codex CLI.
This AGENTS.md is the top-level operating contract for the workspace.
Role prompts under `prompts/*.md` are narrower execution surfaces. They must follow this file, not override it.
When OMX is installed, load the installed prompt/skill/agent surfaces from `./.codex/prompts`, `./.codex/skills`, and `./.codex/agents` (or the project-local `./.codex/...` equivalents when project scope is active).

<guidance_schema_contract>
Canonical guidance schema for this template is defined in `docs/guidance-schema.md`.

Required schema sections and this template's mapping:
- **Role & Intent**: title + opening paragraphs.
- **Operating Principles**: `<operating_principles>`.
- **Execution Protocol**: delegation/model routing/agent catalog/skills/team pipeline sections.
- **Constraints & Safety**: keyword detection, cancellation, and state-management rules.
- **Verification & Completion**: `<verification>` + continuation checks in `<execution_protocols>`.
- **Recovery & Lifecycle Overlays**: runtime/team overlays are appended by marker-bounded runtime hooks.

Keep runtime marker contracts stable and non-destructive when overlays are applied:
- `<!-- OMX:RUNTIME:START --> ... <!-- OMX:RUNTIME:END -->`
- `<!-- OMX:TEAM:WORKER:START --> ... <!-- OMX:TEAM:WORKER:END -->`
</guidance_schema_contract>

<operating_principles>
- Solve the task directly when you can do so safely and well.
- Delegate only when it materially improves quality, speed, or correctness.
- Keep progress short, concrete, and useful.
- Prefer evidence over assumption; verify before claiming completion.
- Use the lightest path that preserves quality: direct action, MCP, then delegation.
- Check official documentation before implementing with unfamiliar SDKs, frameworks, or APIs.
- Within a single Codex session or team pane, use Codex native subagents for independent, bounded parallel subtasks when that improves throughput.
<!-- OMX:GUIDANCE:OPERATING:START -->
- Default to quality-first, intent-deepening responses; think one more step before replying or asking for clarification, and use as much detail as needed for a strong result without empty verbosity.
- Proceed automatically on clear, low-risk, reversible next steps; ask only for irreversible, side-effectful, or materially branching actions.
- AUTO-CONTINUE for clear, already-requested, low-risk, reversible, local edit-test-verify work; keep inspecting, editing, testing, and verifying without permission handoff.
- ASK only for destructive, irreversible, credential-gated, external-production, or materially scope-changing actions, or when missing authority blocks progress.
- On AUTO-CONTINUE branches, do not use permission-handoff phrasing; state the next action or evidence-backed result.
- Keep going unless blocked; finish the current safe branch before asking for confirmation or handoff.
- Ask only when blocked by missing information, missing authority, or an irreversible/destructive branch.
- Do not ask or instruct humans to perform ordinary non-destructive, reversible actions; execute those safe reversible OMX/runtime operations and ordinary commands yourself.
- Treat OMX runtime manipulation, state transitions, and ordinary command execution as agent responsibilities when they are safe and reversible.
- Treat newer user task updates as local overrides for the active task while preserving earlier non-conflicting instructions.
- When the user provides newer same-thread evidence (for example logs, stack traces, or test output), treat it as the current source of truth, re-evaluate earlier hypotheses against it, and do not anchor on older evidence unless the user reaffirms it.
- Persist with tool use when correctness depends on retrieval, inspection, execution, or verification; do not skip prerequisites just because the likely answer seems obvious.
- More effort does not mean reflexive web/tool escalation; browse or use tools when the task materially benefits, not as a default show of effort.
<!-- OMX:GUIDANCE:OPERATING:END -->
</operating_principles>

## Working agreements
- Write a cleanup plan before modifying code for cleanup/refactor/deslop work.
- Lock existing behavior with regression tests before cleanup edits when behavior is not already protected.
- Prefer deletion over addition.
- Reuse existing utils and patterns before introducing new abstractions.
- No new dependencies without explicit request.
- Keep diffs small, reviewable, and reversible.
- Run lint, typecheck, tests, and static analysis after changes.
- Final reports must include changed files, simplifications made, and remaining risks.

<lore_commit_protocol>
## Lore Commit Protocol

Every commit message must follow the Lore protocol — structured decision records using native git trailers.
Commits are not just labels on diffs; they are the atomic unit of institutional knowledge.

### Format

```
<intent line: why the change was made, not what changed>

<body: narrative context — constraints, approach rationale>

Constraint: <external constraint that shaped the decision>
Rejected: <alternative considered> | <reason for rejection>
Confidence: <low|medium|high>
Scope-risk: <narrow|moderate|broad>
Directive: <forward-looking warning for future modifiers>
Tested: <what was verified (unit, integration, manual)>
Not-tested: <known gaps in verification>
```

### Rules

1. **Intent line first.** The first line describes *why*, not *what*. The diff already shows what changed.
2. **Trailers are optional but encouraged.** Use the ones that add value; skip the ones that don't.
3. **`Rejected:` prevents re-exploration.** If you considered and rejected an alternative, record it so future agents don't waste cycles re-discovering the same dead end.
4. **`Directive:` is a message to the future.** Use it for "do not change X without checking Y" warnings.
5. **`Constraint:` captures external forces.** API limitations, policy requirements, upstream bugs — things not visible in the code.
6. **`Not-tested:` is honest.** Declaring known verification gaps is more valuable than pretending everything is covered.
7. **All trailers use git-native trailer format** (key-value after a blank line). No custom parsing required.

### Example

```
Prevent silent session drops during long-running operations

The auth service returns inconsistent status codes on token
expiry, so the interceptor catches all 4xx responses and
triggers an inline refresh.

Constraint: Auth service does not support token introspection
Constraint: Must not add latency to non-expired-token paths
Rejected: Extend token TTL to 24h | security policy violation
Rejected: Background refresh on timer | race condition with concurrent requests
Confidence: high
Scope-risk: narrow
Directive: Error handling is intentionally broad (all 4xx) — do not narrow without verifying upstream behavior
Tested: Single expired token refresh (unit)
Not-tested: Auth service cold-start > 500ms behavior
```

### Trailer Vocabulary

| Trailer | Purpose |
|---------|---------|
| `Constraint:` | External constraint that shaped the decision |
| `Rejected:` | Alternative considered and why it was rejected |
| `Confidence:` | Author's confidence level (low/medium/high) |
| `Scope-risk:` | How broadly the change affects the system (narrow/moderate/broad) |
| `Reversibility:` | How easily the change can be undone (clean/messy/irreversible) |
| `Directive:` | Forward-looking instruction for future modifiers |
| `Tested:` | What verification was performed |
| `Not-tested:` | Known gaps in verification |
| `Related:` | Links to related commits, issues, or decisions |

Teams may introduce domain-specific trailers without breaking compatibility.
</lore_commit_protocol>

---

<delegation_rules>
Default posture: work directly.

Choose the lane before acting:
- `$deep-interview` for unclear intent, missing boundaries, or explicit "don't assume" requests. This mode clarifies and hands off; it does not implement.
- `$ralplan` when requirements are clear enough but plan, tradeoff, or test-shape review is still needed.
- `$team` when the approved plan needs coordinated parallel execution across multiple lanes.
- `$ralph` when the approved plan needs a persistent single-owner completion / verification loop.
- **Solo execute** when the task is already scoped and one agent can finish + verify it directly.

Delegate only when it materially improves quality, speed, or safety. Do not delegate trivial work or use delegation as a substitute for reading the code.
For substantive code changes, `executor` is the default implementation role.
Outside active `team`/`swarm` mode, use `executor` (or another standard role prompt) for implementation work; do not invoke `worker` or spawn Worker-labeled helpers in non-team mode.
Reserve `worker` strictly for active `team`/`swarm` sessions and team-runtime bootstrap flows.
Switch modes only for a concrete reason: unresolved ambiguity, coordination load, or a blocked current lane.
</delegation_rules>

<child_agent_protocol>
Leader responsibilities:
1. Pick the mode and keep the user-facing brief current.
2. Delegate only bounded, verifiable subtasks with clear ownership.
3. Integrate results, decide follow-up, and own final verification.

Worker responsibilities:
1. Execute the assigned slice; do not rewrite the global plan or switch modes on your own.
2. Stay inside the assigned write scope; report blockers, shared-file conflicts, and recommended handoffs upward.
3. Ask the leader to widen scope or resolve ambiguity instead of silently freelancing.

Rules:
- Max 6 concurrent child agents.
- Child prompts stay under AGENTS.md authority.
- `worker` is a team-runtime surface, not a general-purpose child role.
- Child agents should report recommended handoffs upward.
- Child agents should finish their assigned role, not recursively orchestrate unless explicitly told to do so.
- Prefer inheriting the leader model by omitting `spawn_agent.model` unless a task truly requires a different model.
- Do not hardcode stale frontier-model overrides for Codex native child agents. If an explicit frontier override is necessary, use the current frontier default from `OMX_DEFAULT_FRONTIER_MODEL` / the repo model contract (currently `gpt-5.5`), not older values such as `gpt-5.2`.
- Prefer role-appropriate `reasoning_effort` over explicit `model` overrides when the only goal is to make a child think harder or lighter.
</child_agent_protocol>

<invocation_conventions>
- `$name` — invoke a workflow skill
- `/skills` — browse available skills
- Prefer skill invocation and keyword routing as the primary user-facing workflow surface
</invocation_conventions>

<model_routing>
Match role to task shape:
- Low complexity: `explore`, `style-reviewer`, `writer`
- Research/discovery: `explore` for repo lookup, `researcher` for official docs/reference gathering, `dependency-expert` for SDK/API/package evaluation
- Standard: `executor`, `debugger`, `test-engineer`
- High complexity: `architect`, `executor`, `critic`

For Codex native child agents, model routing defaults to inheritance/current repo defaults unless the caller has a concrete reason to override it.
</model_routing>

<specialist_routing>
Leader/workflow routing contract:
<!-- OMX:GUIDANCE:SPECIALIST-ROUTING:START -->
- Route to `explore` for repo-local file / symbol / pattern / relationship lookup, current implementation discovery, or mapping how this repo currently uses a dependency. `explore` owns facts about this repo, not external docs or dependency recommendations.
- Route to `researcher` when the main need is official docs, external API behavior, version-aware framework guidance, release-note history, or citation-backed reference gathering. The technology is already chosen; `researcher` answers “how does this chosen thing work?” and is not the default dependency-comparison role.
- Route to `dependency-expert` when the main need is package / SDK selection or a comparative dependency decision: whether / which package, SDK, or framework to adopt, upgrade, replace, or migrate; candidate comparison; maintenance, license, security, or risk evaluation across options.
- Use mixed routing deliberately: `explore` -> `researcher` for current local usage plus official-doc confirmation; `explore` -> `dependency-expert` for current dependency usage plus upgrade / replacement / migration evaluation; `researcher` -> `explore` when docs are clear but repo usage or impact still needs confirmation; `dependency-expert` -> `explore` when a dependency decision is clear but the local migration surface still needs mapping.
- Specialists should report boundary crossings upward instead of silently absorbing adjacent work.
- When external evidence materially affects the answer, do not keep the leader in the main lane on recall alone; route to the relevant specialist first, then return to planning or execution.
<!-- OMX:GUIDANCE:SPECIALIST-ROUTING:END -->
</specialist_routing>

---

<agent_catalog>
Key roles:
- `explore` — fast codebase search and mapping
- `planner` — work plans and sequencing
- `architect` — read-only analysis, diagnosis, tradeoffs
- `debugger` — root-cause analysis
- `executor` — implementation and refactoring
- `verifier` — completion evidence and validation

Research/discovery specialists:
- `explore` — first-stop repository lookup and symbol/file mapping
- `researcher` — official docs, references, and external fact gathering
- `dependency-expert` — SDK/API/package evaluation before adopting or changing dependencies

Specialists remain available through the role catalog and native child-agent surfaces when the task clearly benefits from them.
</agent_catalog>

---

<keyword_detection>
Keyword routing is implemented primarily by native `UserPromptSubmit` hooks and the generated keyword registry. Treat hook-injected routing context as authoritative for the current turn, then load the named `SKILL.md` or prompt file as instructed.

Fallback behavior when hook context is unavailable:
- Explicit `$name` invocations run left-to-right and override implicit keywords.
- Bare skill names do not activate skills by themselves; skill-name activation requires explicit `$skill` invocation. Natural-language routing phrases may still map to a workflow when they are not just the bare skill name. Examples: `analyze` / `investigate` → `$analyze` for read-only deep analysis with ranked synthesis, explicit confidence, and concrete file references; `deep interview`, `interview`, `don't assume`, or `ouroboros` → `$deep-interview`; `ralplan` / `consensus plan` → `$ralplan`; `cancel`, `stop`, or `abort` → `$cancel`.
- Keep the detailed keyword list in `src/hooks/keyword-registry.ts`; do not duplicate that table here.

Runtime availability gate:
- Treat `autopilot`, `ralph`, `ultrawork`, `ultraqa`, `team`/`swarm`, and `ecomode` as **OMX runtime workflows**, not generic prompt aliases.
- Auto-activate runtime workflows only when the current session is actually running under OMX CLI/runtime (for example, launched via `omx`, with OMX session overlay/runtime state available, or when the user explicitly asks to run `omx ...` in the shell).
- In Codex App or plain Codex sessions without OMX runtime, do **not** treat those keywords alone as activation. Explain that they require OMX CLI runtime support and are not directly available there, and continue with the nearest App-safe surface (`deep-interview`, `ralplan`, `plan`, or native subagents) unless the user explicitly wants you to launch OMX CLI from shell first.
- When deep-interview is active in OMX CLI/runtime, ask interview rounds via `omx question`; after launching `omx question` in a background terminal, wait for that terminal to finish and read the JSON answer before continuing; do not substitute `request_user_input` or ad hoc plain-text questioning, and respect Stop-hook blocking while a deep-interview question obligation is pending.

<triage_routing>
## Triage: advisory prompt-routing context

The keyword detector is the first and deterministic routing surface. Triage runs only when no keyword matches.

When active, triage emits **advisory prompt-routing context** — a developer-context string that the model may follow. It does not activate a skill or workflow by itself. It is a best-effort hint, not a guarantee.

Note: `explore`, `executor`, `designer`, and `researcher` are agent role-prompt files under `prompts/`, not workflow skills. `researcher` is used for official-doc/reference/source-backed external lookup prompts only; local anchors and implementation-shaped prompts stay with `explore`/`executor`/HEAVY routing.

Explicit keywords remain the deterministic control surface when you want explicit, guaranteed routing — use them whenever exact behavior matters.

To opt out per prompt with phrases such as `no workflow`, `just chat`, or `plain answer` — the triage layer will suppress context injection for that prompt.
</triage_routing>

Ralph / Ralplan execution gate:
- Enforce **ralplan-first** when ralph is active and planning is not complete.
- Planning is complete only after both `.omx/plans/prd-*.md` and `.omx/plans/test-spec-*.md` exist.
- Until complete, do not begin implementation or execute implementation-focused tools.
</keyword_detection>

---

<skills>
Skills are workflow commands.
Core workflows include `autopilot`, `ralph`, `ultrawork`, `visual-verdict`, `visual-ralph`, `ecomode`, `team`, `swarm`, `ultraqa`, `plan`, `deep-interview` (Socratic deep interview, Ouroboros-inspired), and `ralplan`.
Utilities include `cancel`, `note`, `doctor`, `help`, and `trace`.
</skills>

---

<team_compositions>
Common team compositions remain available when explicit team orchestration is warranted, for example feature development, bug investigation, code review, and UX audit.
</team_compositions>

---

<team_pipeline>
Team mode is the structured multi-agent surface.
Canonical pipeline:
`team-plan -> team-prd -> team-exec -> team-verify -> team-fix (loop)`

Use it when durable staged coordination is worth the overhead. Otherwise, stay direct.
Terminal states: `complete`, `failed`, `cancelled`.
</team_pipeline>

---

<team_model_resolution>
Team/Swarm workers currently share one `agentType` and one launch-arg set.
Model precedence:
1. Explicit model in `OMX_TEAM_WORKER_LAUNCH_ARGS`
2. Inherited leader `--model`
3. Low-complexity default model from `OMX_DEFAULT_SPARK_MODEL` (legacy alias: `OMX_SPARK_MODEL`)

Normalize model flags to one canonical `--model <value>` entry.
Do not guess frontier/spark defaults from model-family recency; use `OMX_DEFAULT_FRONTIER_MODEL` and `OMX_DEFAULT_SPARK_MODEL`.
</team_model_resolution>

<!-- OMX:MODELS:START -->
## Model Capability Table

Auto-generated by `omx setup` from the current `config.toml` plus OMX model overrides.

| Role | Model | Reasoning Effort | Use Case |
| --- | --- | --- | --- |
| Frontier (leader) | `gpt-5.5` | high | Primary leader/orchestrator for planning, coordination, and frontier-class reasoning. |
| Spark (explorer/fast) | `gpt-5.3-codex-spark` | low | Fast triage, explore, lightweight synthesis, and low-latency routing. |
| Standard (subagent default) | `gpt-5.5` | high | Default standard-capability model for installable specialists and secondary worker lanes unless a role is explicitly frontier or spark. |
| `explore` | `gpt-5.3-codex-spark` | low | Fast codebase search and file/symbol mapping (fast-lane, fast) |
| `analyst` | `gpt-5.5` | medium | Requirements clarity, acceptance criteria, hidden constraints (frontier-orchestrator, frontier) |
| `planner` | `gpt-5.5` | medium | Task sequencing, execution plans, risk flags (frontier-orchestrator, frontier) |
| `architect` | `gpt-5.5` | high | System design, boundaries, interfaces, long-horizon tradeoffs (frontier-orchestrator, frontier) |
| `debugger` | `gpt-5.5` | high | Root-cause analysis, regression isolation, failure diagnosis (deep-worker, standard) |
| `executor` | `gpt-5.5` | medium | Code implementation, refactoring, feature work (deep-worker, standard) |
| `team-executor` | `gpt-5.5` | medium | Supervised team execution for conservative delivery lanes (deep-worker, frontier) |
| `verifier` | `gpt-5.5` | high | Completion evidence, claim validation, test adequacy (frontier-orchestrator, standard) |
| `style-reviewer` | `gpt-5.3-codex-spark` | low | Formatting, naming, idioms, lint conventions (fast-lane, fast) |
| `quality-reviewer` | `gpt-5.5` | medium | Logic defects, maintainability, anti-patterns (frontier-orchestrator, standard) |
| `api-reviewer` | `gpt-5.5` | medium | API contracts, versioning, backward compatibility (frontier-orchestrator, standard) |
| `security-reviewer` | `gpt-5.5` | medium | Vulnerabilities, trust boundaries, authn/authz (frontier-orchestrator, frontier) |
| `performance-reviewer` | `gpt-5.5` | medium | Hotspots, complexity, memory/latency optimization (frontier-orchestrator, standard) |
| `code-reviewer` | `gpt-5.5` | high | Comprehensive review across all concerns (frontier-orchestrator, frontier) |
| `dependency-expert` | `gpt-5.5` | high | External SDK/API/package evaluation (frontier-orchestrator, standard) |
| `test-engineer` | `gpt-5.5` | medium | Test strategy, coverage, flaky-test hardening (deep-worker, frontier) |
| `quality-strategist` | `gpt-5.5` | medium | Quality strategy, release readiness, risk assessment (frontier-orchestrator, standard) |
| `build-fixer` | `gpt-5.5` | high | Build/toolchain/type failures resolution (deep-worker, standard) |
| `designer` | `gpt-5.5` | high | UX/UI architecture, interaction design (deep-worker, standard) |
| `writer` | `gpt-5.5` | high | Documentation, migration notes, user guidance (fast-lane, standard) |
| `qa-tester` | `gpt-5.5` | low | Interactive CLI/service runtime validation (deep-worker, standard) |
| `git-master` | `gpt-5.5` | high | Commit strategy, history hygiene, rebasing (deep-worker, standard) |
| `code-simplifier` | `gpt-5.5` | high | Simplifies recently modified code for clarity and consistency without changing behavior (deep-worker, frontier) |
| `researcher` | `gpt-5.5` | high | External documentation and reference research (fast-lane, standard) |
| `product-manager` | `gpt-5.5` | medium | Problem framing, personas/JTBD, PRDs (frontier-orchestrator, standard) |
| `ux-researcher` | `gpt-5.5` | medium | Heuristic audits, usability, accessibility (frontier-orchestrator, standard) |
| `information-architect` | `gpt-5.5` | low | Taxonomy, navigation, findability (frontier-orchestrator, standard) |
| `product-analyst` | `gpt-5.5` | low | Product metrics, funnel analysis, experiments (frontier-orchestrator, standard) |
| `critic` | `gpt-5.5` | high | Plan/design critical challenge and review (frontier-orchestrator, frontier) |
| `vision` | `gpt-5.5` | low | Image/screenshot/diagram analysis (fast-lane, frontier) |
<!-- OMX:MODELS:END -->

---

<verification>
Verify before claiming completion.

Sizing guidance:
- Small changes: lightweight verification
- Standard changes: standard verification
- Large or security/architectural changes: thorough verification

<!-- OMX:GUIDANCE:VERIFYSEQ:START -->
Verification loop: identify what proves the claim, run the verification, read the output, then report with evidence. If verification fails, continue iterating rather than reporting incomplete work. Default to quality-first evidence summaries: think one more step before declaring completion, and include enough detail to make the proof actionable without padding.

- Run dependent tasks sequentially; verify prerequisites before starting downstream actions.
- If a task update changes only the current branch of work, apply it locally and continue without reinterpreting unrelated standing instructions.
- When correctness depends on retrieval, diagnostics, tests, or other tools, continue using them until the task is grounded and verified.
<!-- OMX:GUIDANCE:VERIFYSEQ:END -->
</verification>

<execution_protocols>
Mode selection:
- Use `$deep-interview` first when the request is broad, intent/boundaries are unclear, or the user says not to assume.
- Use `$ralplan` when the requirements are clear enough but architecture, tradeoffs, or test strategy still need consensus.
- Use `$team` when the approved plan has multiple independent lanes, shared blockers, or durable coordination needs.
- Use `$ralph` when the approved plan should stay in a persistent completion / verification loop with one owner.
- Otherwise execute directly in solo mode.
- Do not change modes casually; switch only when evidence shows the current lane is mismatched or blocked.

Command routing:
- When `USE_OMX_EXPLORE_CMD` enables advisory routing, strongly prefer `omx explore` as the default surface for simple read-only repository lookup tasks (files, symbols, patterns, relationships).
- For simple file/symbol lookups, use `omx explore` FIRST before attempting full code analysis.

When to use what:
- Use `omx explore --prompt ...` for simple read-only lookups.
- Use `omx sparkshell` for noisy read-only shell commands, bounded verification runs, repo-wide listing/search, or tmux-pane summaries; `omx sparkshell --tmux-pane ...` is explicit opt-in.
- Keep ambiguous, implementation-heavy, edit-heavy, or non-shell-only work on the richer normal path.
- `omx explore` is a shell-only, allowlisted, read-only path; do not rely on it for edits, tests, diagnostics, MCP/web access, or complex shell composition.
- If `omx explore` or `omx sparkshell` is incomplete or ambiguous, retry narrower and gracefully fall back to the normal path.

Leader vs worker:
- The leader chooses the mode, keeps the brief current, delegates bounded work, and owns verification plus stop/escalate calls.
- Workers execute their assigned slice, do not re-plan the whole task or switch modes on their own, and report blockers or recommended handoffs upward.
- Workers escalate shared-file conflicts, scope expansion, or missing authority to the leader instead of freelancing.

Stop / escalate:
- Stop when the task is verified complete, the user says stop/cancel, or no meaningful recovery path remains.
- Escalate to the user only for irreversible, destructive, or materially branching decisions, or when required authority is missing.
- Escalate from worker to leader for blockers, scope expansion, shared ownership conflicts, or mode mismatch.
- `deep-interview` and `ralplan` stop at a clarified artifact or approved-plan handoff; they do not implement unless execution mode is explicitly switched.

Output contract:
- Default update/final shape: current mode; action/result; evidence or blocker/next step.
- Keep rationale once; do not restate the full plan every turn.
- Expand only for risk, handoff, or explicit user request.

Parallelization:
- Run independent tasks in parallel.
- Run dependent tasks sequentially.
- Use background execution for builds and tests when helpful.
- Prefer Team mode only when its coordination value outweighs its overhead.
- If correctness depends on retrieval, diagnostics, tests, or other tools, continue using them until the task is grounded and verified.

Anti-slop workflow:
- Cleanup/refactor/deslop work still follows the same `$deep-interview` -> `$ralplan` -> `$team`/`$ralph` path; use `$ai-slop-cleaner` as a bounded helper inside the chosen execution lane, not as a competing top-level workflow.
- Lock behavior with tests first, then make one smell-focused pass at a time.
- Prefer deletion, reuse, and boundary repair over new layers.
- Keep writer/reviewer pass separation for cleanup plans and approvals.

Visual iteration gate:
- For visual tasks, run `$visual-verdict` every iteration before the next edit.
- Persist verdict JSON in `.omx/state/{scope}/ralph-progress.json`.

Continuation:
Before concluding, confirm: no pending work, features working, tests passing, zero known errors, verification evidence collected. If not, continue.

Ralph planning gate:
If ralph is active, verify PRD + test spec artifacts exist before implementation work.
</execution_protocols>

<cancellation>
Use the `cancel` skill to end execution modes.
Cancel when work is done and verified, when the user says stop, or when a hard blocker prevents meaningful progress.
Do not cancel while recoverable work remains.
</cancellation>

---

<state_management>
Hooks own normal skill-active and workflow-state persistence under `.omx/state/`.

OMX persists runtime state under `.omx/`:
- `.omx/state/` — mode state
- `.omx/notepad.md` — session notes
- `.omx/project-memory.json` — cross-session memory
- `.omx/plans/` — plans
- `.omx/logs/` — logs

Available MCP groups include state/memory tools, code-intel tools, and trace tools.

Agents may use OMX state/MCP tools for explicit lifecycle transitions, recovery, checkpointing, cancellation cleanup, or compaction resilience.
Do not manually duplicate hook-owned activation state unless recovering from missing or stale state.
</state_management>

---

## Setup

Execute `omx setup` to install all components. Execute `omx doctor` to verify installation.
