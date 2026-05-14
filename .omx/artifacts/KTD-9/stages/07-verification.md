# 07 검증

## Canonical stage

- Stage: 10
- Lifecycle 단계: 검증/리뷰 중 검증
- Canonical 산출물: `.omx/artifacts/KTD-9/stages/07-verification.md`

## 기존 artifact

- 최종 검증 기록: [../run-003/subagents/10-verification.md](../run-003/subagents/10-verification.md)
- 최종 검증 증거: [../run-003/evidence/verify.md](../run-003/evidence/verify.md)
- Green 1차 증거: [../run-003/evidence/green.md](../run-003/evidence/green.md)
- Green 재검증 증거: [../run-003/evidence/green-rerun.md](../run-003/evidence/green-rerun.md)

## 담당 subagent

| 항목 | 값 |
| --- | --- |
| 담당 | `verifier` |
| 모델 | `gpt-5.5` |
| reasoning | `high` |
| 범위 | 제공된 raw 최종 검증 결과의 감사 정리 |

## 목적

KTD-9 run-003의 최종 검증 결과를 감사 가능하게 정리한다. 기존 기록은 Java 21 확인, backend Maven test의 sandbox 실패와 권한 상승 로컬 PASS, frontend test PASS, frontend build PASS, `.gitignore` 확인 결과를 종합했다.

## 상태

완료. 최종 verifier 판정은 PASS이며, MR/Wiki/Graph 환류로 넘어갈 수 있다고 기록했다.

## 테스트 실행 오류 evidence 조건

검증 단계에서 테스트 실행 중 오류, 실패, 환경성 실패가 발생하면 반드시 `.omx/artifacts/<ISSUE-ID>/run-<NNN>/evidence/` 아래에 기록한다. 기록이 없으면 검증 완료로 보지 않는다.

각 오류 기록에는 다음 항목을 포함한다.

- 실행 명령
- exit code
- 실패 또는 오류 요약
- 원인 분류: 제품 결함, 테스트 결함, 환경 제약, 의존성/도구 문제, 미분류
- 다음 조치

재실행으로 통과한 경우에도 최초 실패 evidence, 재실행 명령, 재검증 통과 evidence를 함께 남긴다.

E2E 테스트 실행 실패가 확인되더라도 사용자의 명시적 승인 전에는 E2E 테스트 코드, E2E 시나리오 정의, E2E 전용 fixture/mock/helper 변경 patch를 적용하지 않는다. Verifier는 실패 증거, 원인 분류, 권고 범위, 사용자 승인 필요 여부만 기록한다.

## PR 추적 메모

PR/MR에는 verifier PASS와 함께 sandbox backend Maven test 실패가 제품 코드 결함이 아니라 Mockito/ByteBuddy self-attach 실행 환경 제약이라는 리스크를 명시한다.
