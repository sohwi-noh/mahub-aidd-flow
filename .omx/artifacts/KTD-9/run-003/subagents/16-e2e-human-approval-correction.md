# E2E 사용자 승인 주체 정정

## Subagent

| 항목 | 값 |
| --- | --- |
| 담당 | `test-engineer` |
| 모델 | `gpt-5.5` |
| reasoning | `medium` |
| 실행 | KTD-9 run-003 E2E 보호 정책 승인 주체 정정 |

## 사용자 정정

- 목표는 E2E 테스트를 고치는 것이 아니다.
- 핵심은 사용자의 명시적 개입 없이 agent가 단독으로 E2E 테스트 코드를 수정하지 못하게 하는 것이다.
- Subagent 검토 artifact만으로는 E2E 테스트 코드 수정 권한이 생기지 않는다.

## 변경 파일

- `AGENTS.md`
- `docs/tdd-subagent-workflow.md`
- `.omx/artifacts/KTD-9/stage-index.md`
- `.omx/artifacts/KTD-9/stages/04-test-spec.md`
- `.omx/artifacts/KTD-9/stages/07-verification.md`
- `.omx/artifacts/KTD-9/run-003/subagents/15-e2e-test-guard.md`
- `.omx/artifacts/KTD-9/run-003/subagents/16-e2e-human-approval-correction.md`

## 핵심 정책

- E2E 보호 정책은 autonomy directive의 예외이며 일반 자동 실행 원칙보다 우선한다.
- Agent는 사용자의 명시적 개입/승인 없이는 E2E 테스트 코드, E2E 시나리오 정의, E2E 전용 fixture/mock/helper를 단독으로 수정하지 않는다.
- Subagent artifact는 승인 근거가 아니다. 역할은 수정 필요성 검토, 권고, 대상 범위와 제외 범위 정의로 제한한다.
- 사용자 명시 승인 전 agent는 E2E 테스트 변경 patch를 적용하지 않고, 실패 증거와 제안만 artifact에 남긴다.
- 사용자가 명시 승인한 경우에도 수정 범위는 사용자가 승인한 E2E 테스트 파일/시나리오와 그 테스트 실행에 직접 필요한 E2E 전용 fixture/mock/helper로 제한한다.
- 승인 범위 밖의 E2E 테스트 코드, E2E 시나리오 정의, E2E 전용 fixture/mock/helper를 바꾸려면 별도 사용자 승인이 필요하다.
- Product code 변경은 E2E 테스트 변경이 아니지만, E2E 실패를 고치기 위한 product code 변경도 stage 6 gate와 일반 TDD artifact를 따른다.
- 테스트 실행 중 오류, 실패, 환경성 실패, 재실행 통과 기록은 모두 evidence에 남긴다.

## 변경 성격

이번 정정은 E2E 테스트 코드 수정 권한을 넓히지 않는다. 기존 표현이 subagent artifact를 승인처럼 오해하게 만들 수 있어, 사용자 명시 승인이 유일한 승인 주체임을 명확히 했다.
