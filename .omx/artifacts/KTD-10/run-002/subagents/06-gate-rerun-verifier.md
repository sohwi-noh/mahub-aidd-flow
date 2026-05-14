# KTD-10 Stage 6 구현 착수 재검증

## 검증 목적

- Issue: `KTD-10`
- 대상 판단: stage 7 최소 구현 착수 가능 여부
- 이전 artifact: `.omx/artifacts/KTD-10/run-002/subagents/06-critic-gate.md`
- 재검증 사유: 이전 critic 검토 이후 architecture/TDD/test spec/Red evidence 산출물이 추가됨
- 쓰기 범위: 이 파일만 작성

## 재검증 입력

| 항목 | 상태 | 근거 |
|---|---|---|
| 이전 critic gate | 확인 | `06-critic-gate.md`는 당시 run-002 architecture/TDD/test spec/Red evidence 부재와 target worktree 접근 실패를 근거로 `FAIL`을 기록했다. |
| stage 2 architecture | present | `02-architect.md`가 repo boundary, fixture-first data model, API 분리, token unavailable, E2E 보호 정책을 정리했다. |
| stage 3 TDD plan | present | `03-tdd-plan.md`가 Red/Green/Refactor 순서, component test 대상, 실행 명령, E2E 금지 조건을 명시했다. |
| stage 4/5 test spec | present | `04-test-spec-red.md`가 component/unit test only 범위와 `npm test`, `npm run test:run`, `npm run typecheck` RED 기준을 명시했다. |
| Red evidence | present | `evidence/red.md`가 `npm test`와 `npm run build`의 exit code `254`, `package.json` 부재 실패를 기록했다. |
| target repo path | fail | `ls /Users/so2/workspace-so2/foundary/.worktrees/mahub-aidd-flow`와 `git -C ... status --short`가 `No such file or directory`로 실패했다. |

## 이전 critic FAIL의 타당성

이전 `06-critic-gate.md`의 `FAIL`은 그 시점 기준으로 타당했다.

- stage 2 architecture artifact가 확인되지 않아 repo 경계, data ownership, fixture 위치, API 범위가 implementation input으로 고정되지 않았다.
- stage 3 TDD plan이 없어 Red/Green/Refactor 순서와 rollback 기준이 implementation 전에 확정되지 않았다.
- stage 4 test spec이 없어 실패해야 할 component/unit test와 pass 조건이 구체화되지 않았다.
- stage 5 Red evidence가 없어 구현 전 실패 명령, exit code, 실패 요약, 원인 분류가 기록되지 않았다.
- target worktree 접근성도 당시 확인되지 않았으므로 executor가 어디에 구현해야 하는지 검증되지 않았다.

따라서 이전 critic의 결론은 "정보가 아직 생성되기 전의 gate 실패"였고, 보수적인 stage 6 판단으로 적절했다.

## 현재 보완된 선행 조건

이전 critic이 missing으로 지적한 핵심 문서 조건 중 다음 항목은 현재 충족됐다.

- architecture: `02-architect.md`가 `mahub-aidd-flow`를 AIDD workflow 관제 frontend로 한정하고, `mahub-api`/`mahub-web` 제품 구현과 분리했다.
- TDD plan: `03-tdd-plan.md`가 pre-baseline RED, test-first component spec, 최소 구현, Green 검증 명령을 순서화했다.
- test spec: `04-test-spec-red.md`가 component/unit tests only 정책과 예상 실패 command를 명시했다.
- Red evidence: `evidence/red.md`가 실제 `npm test`, `npm run build` 실패와 exit code `254`를 기록했다.

문서 기준으로는 stage 7 executor가 읽어야 할 architecture/TDD/test spec/Red evidence가 준비됐다.

## E2E no-edit 정책 점검

PASS.

- `03-tdd-plan.md`는 E2E 테스트 코드, E2E 시나리오, E2E 전용 fixture/mock/helper 변경을 금지 조건으로 둔다.
- `04-test-spec-red.md`는 본 이슈 검증 범위를 component/unit tests only로 제한한다.
- stage 7에서 허용되는 fixture는 dashboard 표시 상태 검증용 정적 product fixture이며, E2E 전용 fixture가 아니다.

구현자는 사용자 명시 승인 없이 E2E test, scenario, fixture, mock, helper를 생성하거나 수정하면 안 된다.

## Product repo boundary 점검

PASS.

- `00-intake.md`와 `stage-index.md`는 저장소 역할을 `mahub-api` = 제품 backend, `mahub-web` = 제품 frontend, `mahub-aidd-flow` = AIDD workflow 관제 frontend로 분리한다.
- KTD-10 stage 7 최소 구현은 `mahub-aidd-flow`의 React/Vite/TypeScript frontend baseline에 한정된다.
- `mahub-api` 또는 `mahub-web` 제품 파일 변경은 이 gate의 구현 범위에 필요하지 않다.
- 현재 `find /Users/so2/workspace-so2/foundary -maxdepth 3 -type d -name 'mahub-api' -o -name 'mahub-web' -o -name 'mahub-aidd-flow'` 결과에는 해당 product repo 디렉터리가 잡히지 않았다. 따라서 이 workspace 상태에서는 product repo 변경 필요성이나 변경 흔적이 확인되지 않는다.

## 필수 구현 guardrails

stage 7 executor는 아래 조건을 구현 범위 제한으로 유지해야 한다.

- fixture-first: 실제 `.omx/artifacts` 파일 파서나 외부 API보다 정적 sample dashboard data와 component/unit test를 먼저 둔다.
- no real API: Linear/GitHub/OMX/understand-anything 실시간 API, auth, polling, server proxy를 baseline에 넣지 않는다.
- token unavailable explicit: 도구가 정확 token을 노출하지 않는 경우 `null`/`unavailable`을 보존하고, 임의 숫자나 추정값을 실제 reported token처럼 렌더링하지 않는다.
- stage-index schema-only: `stage-index.md`는 canonical stage 번호/이름/정책 schema이고, PR/evidence/token/subagent 실행 로그 DB처럼 확장하거나 화면 runtime aggregate로 사용하지 않는다.
- component/unit tests first: dashboard title, stage/current status, subagent/model/reasoning, artifact/evidence path, token unavailable 상태를 제품 구현 전에 테스트로 고정한다.
- E2E no-edit: E2E 관련 파일은 제안만 가능하며 승인 없이 patch를 적용하지 않는다.

## 남은 차단 조건

FAIL.

대상 worktree가 현재 파일시스템에서 확인되지 않는다.

확인 명령과 결과:

- `ls -la /Users/so2/workspace-so2/foundary/.worktrees` -> 디렉터리는 존재하지만 비어 있음
- `ls -la /Users/so2/workspace-so2/foundary/.worktrees/mahub-aidd-flow` -> `No such file or directory`
- `git -C /Users/so2/workspace-so2/foundary/.worktrees/mahub-aidd-flow status --short` -> `fatal: cannot change to ... No such file or directory`

Context에는 target repo가 존재한다고 되어 있으나, 이번 재검증에서 직접 확인한 현재 workspace 상태와 일치하지 않는다. stage 7은 제품 파일을 작성해야 하는 단계이므로 target repo 접근성은 구현 착수 전 필수 조건이다.

## 최종 권고

**FAIL: stage 7 구현 착수 보류.**

문서형 prerequisite는 현재 충족됐다. 이전 critic이 실패로 본 architecture/TDD/test spec/Red evidence 부재는 해소됐다. 그러나 target repo `/Users/so2/workspace-so2/foundary/.worktrees/mahub-aidd-flow`가 현재 검증 시점에 존재하지 않아 구현 착수 위치를 확인할 수 없다.

stage 7 시작 조건:

- target worktree 경로가 실제로 존재해야 한다.
- `git -C /Users/so2/workspace-so2/foundary/.worktrees/mahub-aidd-flow status --short` 또는 동등한 evidence로 작업 tree 접근성이 확인되어야 한다.
- 구현은 위 guardrails 안에서 `mahub-aidd-flow`에만 한정해야 한다.

target repo 접근성이 복구되면, 추가 문서 조건 때문에 stage 2-5로 되돌아갈 필요는 없다. 그 경우 stage 7 최소 구현 착수는 PASS로 전환 가능하다.
