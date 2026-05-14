# 06 리팩터링

## Canonical stage

- Stage: 9
- Lifecycle 단계: 리팩터링
- Canonical 산출물: `.omx/artifacts/KTD-9/stages/06-refactor.md`

## 기존 artifact

- 리팩터링 기록: [../run-003/subagents/09-refactor.md](../run-003/subagents/09-refactor.md)
- 리팩터링 증거: [../run-003/evidence/refactor.md](../run-003/evidence/refactor.md)
- Green 재검증 증거: [../run-003/evidence/green-rerun.md](../run-003/evidence/green-rerun.md)
- Green 재검증 subagent: [../run-003/subagents/08-green-rerun-verifier.md](../run-003/subagents/08-green-rerun-verifier.md)

## 담당 subagent

| 항목 | 값 |
| --- | --- |
| 담당 | `code-simplifier` -> `writer` artifact recovery |
| 모델 | `gpt-5.5` |
| reasoning | `high` |
| 기록 방식 | code-simplifier 실행 후 writer가 artifact 복구 기록 |

## 목적

Green 통과 후 동작을 바꾸지 않고 scaffold와 문서의 환경 제약 설명을 정리한다. 기존 기록은 `backend/pom.xml`의 Surefire JVM argLine 보강과 README의 sandbox Mockito/ByteBuddy self-attach 제약 주석 보강을 남겼다.

## 상태

완료. 최종 검증/리뷰 단계로 넘어갈 수 있다고 판정했고, verifier 단계에서 리팩터링 이후 재검증이 필요하다고 명시했다.

## PR 추적 메모

PR/MR에는 리팩터링이 기능 추가가 아니라 테스트 실행 환경 warning 완화와 문서 보강임을 명시한다. artifact recovery가 writer 대리 기록으로 수행된 사실도 필요하면 감사 메모로 남긴다.
