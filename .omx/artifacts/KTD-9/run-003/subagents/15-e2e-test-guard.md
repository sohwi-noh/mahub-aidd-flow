# E2E 테스트 보호 정책 보정

## Subagent

| 항목 | 값 |
| --- | --- |
| 담당 | `test-engineer` |
| 모델 | `gpt-5.5` |
| reasoning | `medium` |
| 실행 | KTD-9 run-003 정책 보정 |

## 변경 파일

- `AGENTS.md`
- `docs/tdd-subagent-workflow.md`
- `.omx/artifacts/KTD-9/stage-index.md`
- `.omx/artifacts/KTD-9/stages/04-test-spec.md`
- `.omx/artifacts/KTD-9/stages/07-verification.md`
- `.omx/artifacts/KTD-9/run-003/subagents/15-e2e-test-guard.md`
- `.omx/artifacts/KTD-9/run-003/subagents/16-e2e-human-approval-correction.md`

## 정책 요약

- E2E 보호 정책은 autonomy directive의 예외이며 일반 자동 실행 원칙보다 우선한다.
- E2E 테스트 코드, E2E 시나리오 정의, E2E 전용 fixture/mock/helper는 사용자의 명시적 개입/승인 없이는 agent가 단독으로 수정하지 않는다.
- Subagent 검토 artifact는 승인 근거가 아니라 수정 필요성 검토, 권고, 대상 범위와 제외 범위 정의다.
- 사용자 명시 승인 전 agent는 E2E 테스트 변경 patch를 적용하지 않고 실패 증거와 제안만 남긴다.
- 사용자 명시 승인 후에도 수정 범위는 승인된 E2E 테스트 파일/시나리오와 직접 필요한 E2E 전용 fixture/mock/helper로 제한한다.
- product code 변경은 E2E 테스트 변경이 아니지만, E2E 실패를 고치기 위한 product code 변경도 stage 6 gate와 일반 TDD artifact를 따른다.
- 테스트 실행 중 오류, 실패, 환경성 실패는 `.omx/artifacts/<ISSUE-ID>/run-<NNN>/evidence/` 아래에 명령, exit code, 요약, 원인 분류, 다음 조치 형식으로 기록한다.
- 재실행으로 통과한 경우에도 최초 실패 evidence, 재실행 명령, 재검증 통과 evidence를 함께 남긴다.

## 향후 PR 적용 규칙

- PR/MR에서 E2E 테스트 코드, E2E 시나리오 정의, E2E 전용 fixture/mock/helper가 변경되면 사용자 명시 승인 근거와 대응 subagent 검토/권고 artifact를 함께 링크한다.
- PR/MR 설명에는 E2E 변경 범위가 사용자 승인 범위 밖으로 나가지 않았음을 파일 목록 또는 diff 요약으로 남긴다.
- E2E 보정과 product code/config/unrelated test 변경을 한 PR에 섞으려면 별도 stage 6 gate와 별도 artifact를 먼저 준비하고, E2E 보호 범위 변경은 별도 사용자 승인을 받는다.
- 테스트 실행 실패가 있었던 PR/MR은 실패 evidence와 재검증 evidence를 모두 링크한다.
