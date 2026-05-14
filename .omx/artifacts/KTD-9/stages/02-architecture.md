# 02 아키텍처 정리

## Canonical stage

- Stage: 2
- Lifecycle 단계: 아키텍처 정리
- Canonical 산출물: `.omx/artifacts/KTD-9/stages/02-architecture.md`

## 기존 artifact

- 구현 계획: [../implementation-plan.md](../implementation-plan.md)
- Graph 맥락: [../graph-context.md](../graph-context.md)
- 실제 산출물: [../run-001/subagents/02-architect.md](../run-001/subagents/02-architect.md)
- run 요약: [../run-001/run-summary.md](../run-001/run-summary.md)

## 담당 subagent

| 항목 | 값 |
| --- | --- |
| 담당 | `architect` -> `executor` 대리 기록 |
| 모델 | `gpt-5.5` |
| reasoning | `architect`: `high`, 대리 기록 `executor`: `medium` |
| 기록 방식 | `architect` read-only 실패 후 `executor`가 대리 기록 |

## 목적

MA Hub 기준선의 기술 선택과 repo layout, Understand-Anything graph baseline 실행 시점을 정리한다. 기존 산출물은 Java 21 LTS, Spring Boot 계열, React 19.2/Vite 계열, `backend/`, `frontend/`, `docs/` 분리 구조를 보수적 기준선으로 제시했다.

## 상태

완료. scaffold 이전 graph 실행은 실제 제품 구조를 왜곡할 수 있으므로, backend/frontend scaffold와 검증 명령이 생긴 뒤 첫 graph baseline을 실행한다는 판단을 남겼다.

## PR 추적 메모

backend PR은 Java 21/Spring Boot 기준을, frontend PR은 React/Vite 기준을 이 문서와 `02-architect.md`에 연결한다. graph는 run-004에서 대상 저장소별로 실행한다는 보류 사유를 함께 추적한다.
