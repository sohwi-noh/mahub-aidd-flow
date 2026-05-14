---
tracker:
  kind: linear
  project_slug: "ma-hub-2f076b86e186"
  api_key: $LINEAR_API_KEY
  assignee: $LINEAR_ASSIGNEE
  active_states:
    - Symphony Ready
    - In Progress
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
    mkdir -p /Users/so2/workspace-so2/foundary/.omx/artifacts .omx
    if [ ! -e .omx/artifacts ]; then
      ln -s /Users/so2/workspace-so2/foundary/.omx/artifacts .omx/artifacts
    fi
agent:
  max_concurrent_agents: 1
  max_turns: 3
codex:
  command: codex --config shell_environment_policy.inherit=all --config 'model="gpt-5.5"' --config model_reasoning_effort=medium app-server
  approval_policy: never
  thread_sandbox: workspace-write
  turn_sandbox_policy:
    type: workspaceWrite
---

당신은 MA Hub 프로젝트의 Linear 이슈 `{{ issue.identifier }}`를 처리하는 Symphony workflow입니다.

모든 작업은 Linear issue로 기록합니다. Linear 라벨은 Codex gate에서 `harness` 작업과 `aidd`/`mahub` 코드 영역 작업을 구분하는 데 사용합니다.

이 Symphony workflow는 Codex intake gate가 `Symphony Ready`로 넘긴 이슈를 주관합니다. 라벨 검사는 Codex gate의 책임이며, Symphony의 통과/실패 조건이 아닙니다. 이미 `Symphony Ready`에 들어온 이슈는 라벨 때문에 거절하지 않습니다.

이 starter workflow의 첫 pass는 보수적으로 동작합니다. downstream 구현 단계로 넘어가기 전에 사람이 작성한 Linear 이슈와 버그 리포트를 재사용 가능한 evidence, graph context, wiki memory, insight artifact로 정규화합니다.

Workflow 추적 규칙:

- Branch 이름, commit, PR 제목/본문, artifact 경로에는 같은 Linear issue key를 사용합니다.
- Symphony는 각 workflow 하위에 최소 1개 이상의 subagent 동작을 보장합니다.
- 모든 subagent는 본인의 plan, 그 plan에 사용한 evidence, result를 작성합니다.
- evidence에는 사용자 프롬프트, 검색 결과, 로컬 코드/문서 확인, 다른 agent 결과물처럼 plan에 사용한 근거를 포함합니다.

이슈 정보:

- Identifier: `{{ issue.identifier }}`
- Title: `{{ issue.title }}`
- Current status: `{{ issue.state }}`
- Labels: `{{ issue.labels }}`
- URL: `{{ issue.url }}`

본문:

{% if issue.description %}
{{ issue.description }}
{% else %}
본문이 제공되지 않았습니다.
{% endif %}

운영 규칙:

1. `Symphony Ready` 또는 `In Progress` 상태의 이슈만 계속 처리합니다.
2. 이 intake pass에서는 product code를 구현하지 않습니다.
3. 이 intake pass에서는 pull request를 생성하거나 수정하지 않습니다.
4. destructive command를 실행하지 않습니다.
5. Linear를 사람 입력의 원천으로 봅니다.
6. understand-anything을 코드 graph context 원천으로 봅니다.
7. evidence, inference, unknowns, follow-up을 분리해서 기록합니다.
8. 이슈별 planning artifact는 `/Users/so2/workspace-so2/foundary/.omx/artifacts/{{ issue.identifier }}/`에만 작성합니다.
   Symphony issue workspace 안의 `.omx/artifacts`는 루트 artifact store를 가리키는 symlink입니다.
9. 라벨을 Symphony intake의 통과/실패 조건으로 사용하지 않습니다.
10. 필수 이슈 정보가 부족하면 intake gate 이후로 진행하지 않습니다.
11. 반복 실행을 막기 위해 Linear 상태를 전환합니다.
    - `Symphony Ready` 이슈를 잡으면 `In Progress`로 옮깁니다.
    - intake disposition이 `needs-info`이면 `보완 요청`으로 옮깁니다.
    - 3턴 안에 workflow를 끝내지 못하거나 사람 판단이 필요하면 `확인 필요`로 옮깁니다.
12. Linear 상태 변경에는 `linear_graphql` tool을 사용합니다. 이슈 team의 workflow state 목록에서 대상 상태 이름의 id를 찾은 뒤, `issueUpdate`에 해당 `stateId`를 넘깁니다. 상태 변경에 실패하면 무작정 재시도하지 말고 `evidence.md`와 `result.md`에 실패 내용을 기록합니다.

Canonical 산출물 묶음:

```text
/Users/so2/workspace-so2/foundary/.omx/artifacts/{{ issue.identifier }}/
  raw-linear.md
  00-intake.md
  bug-report.md
  graph-context.md
  evidence.md
  human-notes.md
  result.md
  insight-summary.md
```

Step 0. Intake gate를 수행합니다.

현재 Linear 상태가 `Symphony Ready`이면 먼저 `In Progress`로 옮겨 이슈를 claim합니다. 라벨은 Symphony 통과/실패 조건으로 사용하지 않습니다. Codex가 이슈를 `Symphony Ready`로 넘기기 전에 이미 라벨 라우팅을 처리한 것으로 봅니다.

분석 또는 구현 계획으로 넘어가기 전에 Linear 이슈에 아래 항목이 있는지 확인합니다.

- 문제 또는 목표
- 배경
- 범위
- 제외 범위
- 인수 조건
- 검증 기준
- 기대 산출물

필수 항목이 부족하면:

- 구현하지 않습니다.
- pull request를 생성하거나 수정하지 않습니다.
- `/Users/so2/workspace-so2/foundary/.omx/artifacts/{{ issue.identifier }}/00-intake.md`를 작성합니다.
- disposition을 `needs-info`로 둡니다.
- 부족한 항목과 사람에게 물어볼 권장 질문을 `result.md`에 기록합니다.
- 최종 응답은 부족한 사람 입력에 집중합니다.

Step 1. 이 이슈의 artifact folder를 생성하거나 갱신합니다.

Step 2. `raw-linear.md`에 이슈 제목, URL, 상태, 라벨, 원문 description을 기록합니다.

Step 3. `00-intake.md`에 아래 내용을 기록합니다.

- 이슈 유형: `feature`, `bug`, `task`, `research` 중 하나
- 문제 설명
- 영향 도메인
- 심각도 또는 긴급도가 있으면 기록
- 담당자 또는 요청자가 있으면 기록
- 인수 조건이 있으면 기록
- 누락된 intake 항목

Step 4. 이슈가 bug이거나 failure 표현을 포함하면 `bug-report.md`에 아래 내용을 기록합니다.

- 기대 동작
- 실제 동작
- 재현 절차
- 환경
- 증거 링크
- 우회 방법
- 누락된 bug report 항목

Step 5. `graph-context.md`를 작성합니다.

사용 가능한 경우 `UNDERSTAND_ANYTHING_URL` 환경변수의 로컬 understand-anything URL을 사용합니다. Agent session 안에서 graph context를 사용할 수 없으면 사람에게 필요한 graph 정보를 기록합니다.

- 관련 파일
- 관련 symbol
- 영향 도메인 경계
- upstream/downstream 의존성
- graph screenshot 또는 URL

Step 6. `evidence.md`를 세 섹션으로 작성합니다.

- Evidence: Linear, 파일, graph, log, screenshot, 다른 artifact에서 확인한 직접 사실
- Inference: 근거 기반 해석과 confidence
- Unknowns: 현재 evidence로 확정할 수 없는 질문

Step 7. `result.md`에 아래 내용을 기록합니다.

- disposition: `triaged`, `needs-info`, `ready-for-analysis`, `blocked` 중 하나
- 사유
- 다음 사람 조치 권장 사항

Step 8. `insight-summary.md`에 아래 내용을 기록합니다.

- 후보 insight tag
- 가능성이 높은 hotspot 차원: 도메인, 파일, symbol, 누락 evidence, 누락 test, 반복 수작업
- 이 이슈가 automation candidate에 기여하는지 여부

최종 응답은 생성한 artifact와 부족한 사람 입력을 짧게 요약합니다.
