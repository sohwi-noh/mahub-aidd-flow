# KTD-10 stage 2 아키텍처 정리

## Summary

KTD-10은 `mahub-aidd-flow`에 AIDD workflow 관제용 frontend baseline을 구축하는 이슈다. 이 저장소는 `mahub-api`나 `mahub-web` 제품 기능을 구현하는 곳이 아니라, Linear issue stage, subagent 실행, evidence, token 기록을 읽어 운영자가 추적할 수 있게 하는 control-plane frontend로 경계를 둔다.

Stage 3 TDD 계획으로 이동하는 것을 **PASS**로 권고한다. 단, 첫 구현은 sample fixture 기반 dashboard와 component/unit test로 제한하고, 실제 Linear/GitHub/OMX API 연동 및 E2E 테스트 수정은 후속 stage/승인 범위로 분리해야 한다.

## Evidence

| 근거 | 해석 |
|---|---|
| `.worktrees/mahub-aidd-flow/README.md:3` | 저장소 목적이 MAHUB AIDD workflow 관제 화면용 frontend로 정의되어 있다. |
| `.worktrees/mahub-aidd-flow/README.md:5` | 제품 기능이 아니라 stage/subagent/model/artifact/token 기록을 보여주는 control-plane UI가 책임이다. |
| `.worktrees/mahub-aidd-flow/README.md:17-20` | React/Vite/TypeScript, run artifact 기반 입력, 이후 adapter/API 분리, `stage-index.md` schema-only 정책이 명시되어 있다. |
| `.worktrees/mahub-aidd-flow/AGENTS.md:5` | `mahub-aidd-flow`는 제품 backend/web 기능을 구현하지 않는 관제 frontend다. |
| `.worktrees/mahub-aidd-flow/AGENTS.md:11` | `stage-index.md`를 PR/evidence DB처럼 쓰지 않고, 실제 데이터는 `run-*` artifact에서 읽어야 한다. |
| `.worktrees/mahub-aidd-flow/AGENTS.md:16-18` | React/Vite/TypeScript, Vitest/Testing Library 기준과 E2E 변경 보호 정책이 명시되어 있다. |
| `.worktrees/mahub-aidd-flow/AGENTS.md:23-25` | 초기 입력은 exported JSON/Markdown metadata이고, API 연동은 adapter/API 계층으로 나중에 추가한다. token 미노출은 `unavailable` 또는 `null`로 표시한다. |
| `.omx/artifacts/KTD-10/00-intake.md:17-21` | frontend baseline, local sample artifact 우선, API 후속 분리, `stage-index.md` schema-only 및 `run-*` aggregate 정책이 intake에 기록되어 있다. |
| `.omx/artifacts/KTD-10/stage-index.md:7` | `stage-index.md`는 stage 번호/이름/담당/기록 규칙만 가진 schema 문서다. |
| `.omx/artifacts/KTD-10/stage-index.md:13-18` | stage schema, run ledger, run summary, run jsonl, subagent 기록, evidence의 데이터 소유권이 분리되어 있다. |
| `.omx/artifacts/KTD-10/stage-index.md:26-27` | stage 2는 아키텍처 정리, stage 3은 TDD 계획이다. |

참고 stack은 사용자 제공 기준을 따른다: React 19.2.1, Vite 8.0.0, TypeScript 5.9.3, Vitest 4.0.15, Testing Library.

## Repo Boundary

`mahub-aidd-flow`는 control-plane frontend다.

- 포함 범위: issue별 stage 진행률, run별 subagent 실행 이력, evidence/result 링크, token 사용량 또는 미노출 상태, PR/MR/Wiki/Graph 환류 상태 표시.
- 제외 범위: `mahub-api` 제품 backend 기능, `mahub-web` 제품 frontend 기능, 제품 사용자 화면, 업무 도메인 CRUD.
- 데이터 출처: canonical stage schema는 `stage-index.md`, 실행 회차 데이터는 `.omx/artifacts/<ISSUE-ID>/run-*` 하위 파일이다.
- API 경계: Linear/GitHub/OMX/understand-anything 연동은 초기 baseline에 직접 결합하지 않고 후속 adapter/API 계층으로 둔다.

## Proposed App Structure

초기 baseline은 feature가 적어도 경계가 보이도록 `src/` 아래를 다음처럼 둔다.

```text
src/
  app/
    App.tsx
    App.test.tsx
    main.tsx
    styles.css
  domain/
    dashboard.ts
    stages.ts
    runs.ts
    tokens.ts
  data/
    fixtures/
      sampleDashboard.ts
    adapters/
      dashboardRepository.ts
      fixtureDashboardRepository.ts
  features/
    issues/
      IssueList.tsx
      IssueList.test.tsx
    stages/
      StageProgress.tsx
      StageProgress.test.tsx
    runs/
      SubagentRunTable.tsx
      SubagentRunTable.test.tsx
    evidence/
      EvidenceTokenPanel.tsx
      EvidenceTokenPanel.test.tsx
  test/
    setup.ts
```

구조 의도:

- `domain/`: 화면과 데이터 입력 방식에서 독립적인 타입을 둔다.
- `data/fixtures/`: stage 3-5 TDD에서 기대 실패/통과를 만들 sample artifact data를 둔다.
- `data/adapters/`: fixture repository를 먼저 구현하고, 이후 file export/API adapter를 같은 port 뒤에 추가한다.
- `features/`: 화면 정보 구조 단위로 component와 test를 묶는다.
- `app/`: layout, composition, global style, repository wiring만 담당한다.

## Data Model Approach

초기 데이터는 sample fixture first로 간다. 실제 `.omx/artifacts`를 직접 읽거나 API를 호출하는 구현은 baseline 이후 adapter/API stage로 분리한다.

핵심 타입 초안:

```ts
type StageDefinition = {
  stage: number;
  nameKo: string;
  ownerRole: string;
  requiredRunLocalRecord: string;
  completionCriteria: string;
};

type IssueDashboard = {
  issueId: string;
  title: string;
  repo: string;
  currentStage: number;
  runs: RunRecord[];
};

type RunRecord = {
  runId: string;
  status: "pass" | "fail" | "running" | "blocked" | "unknown";
  startedAt?: string;
  endedAt?: string;
  stageLedger: StageLedgerEntry[];
  subagents: SubagentRun[];
  evidence: EvidenceLink[];
  tokenUsage: TokenUsage;
};

type TokenUsage = {
  reportedInputTokens: number | null;
  reportedOutputTokens: number | null;
  estimatedVisibleTokens?: number;
  availability: "reported" | "estimated" | "unavailable";
};
```

정책:

- `StageDefinition`은 `stage-index.md` schema에서만 유래한다.
- `IssueDashboard.runs`는 `run-*` artifact를 aggregate한 결과다.
- token 값이 노출되지 않으면 `null`/`unavailable`로 표시하고 추정값을 실제값처럼 렌더링하지 않는다.
- fixture는 실제 API 계약이 아니라 UI/TDD용 sample data다. 이후 `DashboardRepository` port를 유지한 채 adapter를 교체한다.

## UI Information Architecture

첫 dashboard는 운영자가 한 화면에서 "어느 이슈가 어디까지 왔고, 어떤 근거가 남았는지"를 확인하는 업무형 화면으로 둔다.

1. Issue list
   - 이슈 ID, 제목, repo, 현재 stage, 최신 run 상태를 표시한다.
   - 선택된 issue가 나머지 panel의 context가 된다.

2. Stage progress
   - 0-11 canonical stage를 순서대로 표시한다.
   - 완료/진행/차단/미시작 상태를 stage ledger 기반으로 표시한다.
   - `stage-index.md`의 schema 설명과 run-local 완료 증거를 분리해서 보여준다.

3. Subagent run table
   - run id, stage, agent role, model, reasoning effort, status, artifact path, started/ended time을 표시한다.
   - token 사용량은 table에 요약하고 상세는 evidence/token panel에서 본다.

4. Evidence/token panel
   - 선택된 run 또는 subagent의 evidence link, command result, failure classification, next action을 표시한다.
   - reported token이 없으면 `unavailable`, estimate가 있으면 `estimated` badge로 구분한다.

Responsive 기본:

- desktop: 좌측 issue list, 중앙 stage/run, 우측 evidence/token panel.
- narrow viewport: issue list 상단, stage progress, run table, evidence/token panel 순서로 쌓는다.

## Risks and Constraints

| Risk/Constraint | 영향 | 대응 |
|---|---|---|
| `stage-index.md`를 데이터베이스처럼 사용하는 설계 | stage schema와 실행 evidence가 섞여 dashboard 신뢰도가 낮아진다. | stage schema와 run-local aggregate model을 타입/adapter 레벨에서 분리한다. |
| 실제 API를 baseline에 직접 결합 | TDD baseline 범위가 커지고 외부 credential/network에 묶인다. | sample fixture first, repository port, 후속 adapter/API 구현으로 분리한다. |
| `mahub-web` 제품 frontend와 책임 혼동 | 제품 화면/업무 기능이 관제 repo로 유입될 수 있다. | repo boundary를 README/AGENTS 기준으로 고정하고 dashboard 전용 IA만 구현한다. |
| token usage 미노출 | 실제 사용량처럼 잘못 표시할 위험이 있다. | `null`/`unavailable`/`estimated`를 명시적으로 모델링한다. |
| E2E 테스트 보호 정책 | agent가 임의로 E2E 시나리오/fixture를 수정할 수 없다. | stage 3-5는 Vitest/Testing Library unit/component test 중심으로 설계하고, E2E 변경은 사용자 승인 전 제안만 남긴다. |
| reference stack 버전 drift | mahub-web 기준과 신규 repo scaffold 버전이 달라질 수 있다. | stage 3에서 package 기준을 고정하고 lockfile 생성 후 build/test로 확인한다. |

## Recommendation

**PASS: stage 3 TDD 계획으로 이동.**

이유:

- repo boundary가 명확하다: control-plane frontend이며 product web/backend가 아니다.
- 데이터 소유권이 명확하다: `stage-index.md`는 schema-only, 실제 dashboard 데이터는 `run-*` artifact aggregate다.
- baseline 구현 범위를 fixture-based UI와 component/unit test로 제한할 수 있다.
- E2E 보호 정책은 baseline TDD 계획에서 제외/보류 조건으로 관리 가능하다.

Stage 3에서 반드시 확정할 항목:

- Red test 대상 component: `IssueList`, `StageProgress`, `SubagentRunTable`, `EvidenceTokenPanel`, `App` composition.
- sample fixture shape와 최소 acceptance criteria.
- 실행 명령: install/scaffold 후 `npm test`, `npm run build`, 필요 시 `npm run lint`.
- rollback 기준: scaffold/package 변경이 실패하면 product repo 파일이 아니라 `mahub-aidd-flow` baseline 변경만 되돌린다.
