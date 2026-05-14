# KTD-10 Stage 6 경로 보정 재검증

## 검증 목적

- Issue: `KTD-10`
- 검증 대상: stage 7 최소 구현을 `/Users/so2/workspace-so2/foundary/workflow/mahub-aidd-flow`에서 착수할 수 있는지 확인
- 최신 경로 보정 증거: `.omx/artifacts/KTD-10/run-002/evidence/path-correction.md`
- 이전 verifier artifact: `.omx/artifacts/KTD-10/run-002/subagents/06-gate-rerun-verifier.md`
- 쓰기 범위: 이 파일만 작성

## Verdict

**PASS: stage 7 구현은 canonical target path인 `/Users/so2/workspace-so2/foundary/workflow/mahub-aidd-flow`에서 착수 가능하다.**

이전 `06-gate-rerun-verifier.md`의 FAIL은 잘못된 old path인 `.worktrees/mahub-aidd-flow`를 검증 대상으로 삼은 결과였고, 그 시점의 입력 경로 기준으로는 유효한 실패였다. 다만 최신 사용자 보정과 `path-correction.md`에 따라 stage 7의 구현 target은 `.worktrees/mahub-aidd-flow`가 아니라 `workflow/mahub-aidd-flow`다.

## Evidence

| 검증 항목 | 결과 | 근거 |
|---|---:|---|
| 현재 작업 루트 | PASS | `pwd` -> `/Users/so2/workspace-so2/foundary` |
| old path 부재 | PASS | `test -d .worktrees/mahub-aidd-flow` -> exit code `1` |
| old path FAIL 타당성 | PASS | `06-gate-rerun-verifier.md`는 `.worktrees/mahub-aidd-flow` 접근 실패를 근거로 FAIL을 기록했다. 해당 경로가 canonical이 아니었으므로, 실패 자체는 당시 경로 입력에 대한 올바른 판단이었다. |
| canonical path 존재 | PASS | `ls -la workflow/mahub-aidd-flow` -> `.git`, `AGENTS.md`, `README.md`, `index.html`, `package.json`, `src/`, `vite.config.ts`, `tsconfig*.json` 확인 |
| git 접근성 | PASS | `git -C workflow/mahub-aidd-flow status --short` -> repo 접근 성공, baseline 파일들이 untracked 상태로 표시됨 |
| test-first 상태 | PASS | `test -f workflow/mahub-aidd-flow/src/App.test.tsx` -> exit code `0` |
| product implementation 미작성 | PASS | `test -f workflow/mahub-aidd-flow/src/App.tsx` -> exit code `1` |
| 보정 evidence | PASS | `path-correction.md`가 기존 잘못된 경로를 `.worktrees/mahub-aidd-flow`, canonical 경로를 `workflow/mahub-aidd-flow`로 명시한다. |

## Guardrails

stage 7 executor는 아래 제한을 유지해야 한다.

- **fixture-first**: 실제 `.omx/artifacts` parser, Linear/GitHub/OMX runtime reader, 외부 API client보다 정적 fixture와 component/unit test를 먼저 둔다.
- **no real API**: Linear, GitHub, OMX, understand-anything, backend service, polling, auth, server proxy를 baseline 구현에 추가하지 않는다.
- **token unavailable explicit**: 정확 token 값이 도구에서 노출되지 않는 경우 `null`, `unavailable`, 또는 동등한 명시 상태로 표시한다. 임의 추정치를 실제 reported token처럼 렌더링하지 않는다.
- **stage-index schema-only**: `stage-index`는 canonical stage 번호/이름/정책 schema로만 취급한다. runtime aggregate, PR/evidence DB, subagent 실행 로그 저장소처럼 확장하지 않는다.
- **no E2E edits**: 사용자 명시 승인 없이 E2E 테스트 코드, E2E 시나리오, E2E 전용 fixture/mock/helper를 생성하거나 수정하지 않는다.
- **target path only**: stage 7 product 변경은 `/Users/so2/workspace-so2/foundary/workflow/mahub-aidd-flow` 아래에 한정한다.

## Gaps

- `03-tdd-plan.md`와 `04-test-spec-red.md`에는 이전 old path가 남아 있다. 최신 `path-correction.md`가 이 경로를 대체하는 source of truth다.
- 이 검증은 stage 7 착수 가능 여부만 확인했다. `npm install`, `npm test`, `npm run build` Green 증거는 stage 7 구현 후 별도 evidence로 남겨야 한다.

## 최종 권고

**PASS: stage 7 구현 착수 가능.**

조건은 명확하다. 구현자는 stale `.worktrees/mahub-aidd-flow` 경로를 사용하지 말고, `/Users/so2/workspace-so2/foundary/workflow/mahub-aidd-flow`에서 test-first Red/Green 순서를 이어가야 한다. 현재 `src/App.test.tsx`는 존재하고 `src/App.tsx`는 없으므로, 제품 구현이 아직 시작되지 않았다는 전제가 검증된다.
