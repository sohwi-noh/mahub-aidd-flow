# KTD-10 Stage 6 구현 착수 검토

## 검토 범위

- Issue: `KTD-10` AIDD workflow 관제 프론트 baseline 구축
- 대상 repo: `/Users/so2/workspace-so2/foundary/.worktrees/mahub-aidd-flow`
- 검토 목적: stage 7 최소 구현 착수 전, architecture/TDD/test spec/Red evidence가 executor에게 충분한지 확인한다.
- 쓰기 범위: 이 critic artifact만 해당한다.

## 확인한 입력

- `.omx/artifacts/KTD-10/raw-linear.md`
- `.omx/artifacts/KTD-10/00-intake.md`
- `.omx/artifacts/KTD-10/stage-index.md`
- `.omx/artifacts/KTD-10/run-001/stage-ledger.md`
- `.omx/artifacts/KTD-10/run-001/run-summary.md`
- `.omx/artifacts/KTD-10/run-001/subagents/01-analyst-intake.md`
- `.omx/artifacts/KTD-10/run-001/token-usage.md`
- `.omx/artifacts/KTD-10/run-001/run.jsonl`

## Gate checklist

| 항목 | 상태 | 판단 |
|---|---|---|
| stage 0 이슈 발행 증거 | PASS | `run-001/evidence/linear-issue-created.md`와 Linear 원문 기록이 있다. |
| stage 1 요구사항 정리 | PASS | `01-analyst-intake.md`가 요구사항, AC, 비범위, 리스크를 정리했다. |
| stage-index schema-only 원칙 | PASS | `stage-index.md`가 canonical stage schema와 run-local 책임 경계를 명시한다. |
| run-local aggregate 원칙 | PASS | run/evidence/token/subagent 기록은 `run-*` 아래에 둔다는 경계가 확인된다. |
| no E2E edits without approval | PASS | raw-linear와 analyst intake 모두 E2E 테스트 변경을 비범위로 둔다. |
| no product `mahub-api`/`mahub-web` edits | PASS | 저장소 경계가 명확하며, 대상은 별도 `mahub-aidd-flow`다. |
| architecture artifact 존재 | FAIL | run-002의 stage 2 architecture 산출물이 아직 확인되지 않는다. |
| TDD plan 존재 | FAIL | run-002의 stage 3 Red/Green/Refactor 계획이 아직 확인되지 않는다. |
| test spec 존재 | FAIL | run-002의 stage 4 실패해야 할 테스트 명세가 아직 확인되지 않는다. |
| Red 실패 증거 존재 | FAIL | run-002의 stage 5 실패 명령, exit code, 실패 요약, 원인 분류가 아직 확인되지 않는다. |
| 대상 worktree 접근성 | FAIL | 지정 경로 `/Users/so2/workspace-so2/foundary/.worktrees/mahub-aidd-flow`가 현재 파일시스템에서 확인되지 않는다. |

## 숨은 리스크

1. Dashboard data shape coupling
   - `stage-index.md`는 schema-only이고, subagent/model/reasoning/evidence/token은 run-local aggregate 책임이다.
   - executor가 UI fixture를 `stage-index.md` 구조에 직접 결합하면 이후 run artifact 추가 시 화면 모델이 깨질 수 있다.
   - 필요 조치: stage 2 architecture에서 `StageIndex`, `RunAggregate`, `DashboardViewModel`의 책임과 변환 경계를 문서화한다.

2. Local path links
   - Linear 원문은 local path를 `.worktrees/mahub-aidd-flow`로 기록하지만, 현재 절대 경로는 확인되지 않았다.
   - 브라우저 UI에서 local filesystem open을 구현하면 환경 의존성이 커진다.
   - 필요 조치: baseline은 path 표시와 접근 가능한 텍스트/label만 구현하고, file open 동작은 비범위로 둔다.

3. Token unavailable
   - run-001 `reportedTotalTokens`는 `null`이고, 실제 토큰 사용량은 도구에서 미노출될 수 있다.
   - executor가 추정값을 계산하거나 0으로 치환하면 관제 화면의 의미가 왜곡된다.
   - 필요 조치: `null`/`unavailable`을 값 없음으로 보존하고 UI에는 `도구 미노출` 또는 동등한 명시 문구로 표시한다.

4. Overbuilding API integration too early
   - 실제 Linear/GitHub API 실시간 연동은 비범위다.
   - 초기 baseline에서 adapter, auth, polling, server proxy를 과도하게 만들면 TDD baseline 검증보다 통합 복잡도가 먼저 생긴다.
   - 필요 조치: stage 7은 local sample artifact 기반 화면과 테스트 통과에 필요한 최소 구현으로 제한한다.

5. Repo existence and package baseline
   - 대상 worktree가 현재 확인되지 않아 `npm install`, `npm test`, `npm run build` 검증 가능성이 불명확하다.
   - 필요 조치: stage 2 또는 stage 5 evidence에 repo 경로 확인, package manager/lockfile 상태, 실행 불가 시 원인 분류를 남긴다.

## Stage 7 이동 전 필수 증거

- stage 2 architecture artifact: repo 경계, data ownership, fixture 위치, view model 합성 규칙, local path 처리 범위가 포함되어야 한다.
- stage 3 TDD plan artifact: Red/Green/Refactor 순서, 변경 허용 파일, rollback 기준, 검증 명령이 포함되어야 한다.
- stage 4 test spec artifact: 실패해야 할 component/unit 테스트 목록과 pass 조건이 구체적이어야 한다.
- stage 5 Red evidence: 실제 실행 명령, exit code, 실패 요약, 원인 분류, 다음 조치가 `run-002/evidence/` 아래에 있어야 한다.
- test spec과 Red evidence는 stage 7 executor가 제품 코드 구현 전 반드시 읽을 수 있어야 한다.
- 대상 worktree 경로가 존재하거나, 경로가 다르면 run-local artifact에 정정 경로와 근거가 기록되어야 한다.
- E2E 테스트 파일/시나리오/fixture/mock/helper 변경은 사용자 명시 승인 없이는 금지 상태가 유지되어야 한다.
- `mahub-api`와 `mahub-web` 변경이 없다는 `git status` 또는 동등한 evidence가 남아야 한다.
- token 미노출 상태를 실제 숫자처럼 추정하지 않는 테스트 또는 명세가 있어야 한다.
- stage-index를 PR/evidence DB처럼 확장하지 않는다는 검증 기준이 있어야 한다.

## 권고

**FAIL**

현시점 구현 착수는 허용하지 않는다. stage 7 executor implementation은 최소한 stage 4 테스트 명세와 stage 5 Red 실패 증거가 존재하고, 대상 repo 경로가 확인된 뒤에만 허용해야 한다. 특히 Red evidence와 test spec이 없으면 executor가 테스트 우선 기준 없이 product code를 작성하게 되므로 이 저장소의 TDD 정책을 만족하지 못한다.

되돌아갈 stage:

- architecture/data ownership 미정: stage 2
- TDD 순서/rollback 미정: stage 3
- 실패해야 할 테스트 불명확: stage 4
- Red 실패 증거 부재 또는 실행 불가 사유 미기록: stage 5
