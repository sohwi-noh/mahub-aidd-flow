# KTD-9 run-003 토큰 사용량

## 전제

현재 Codex App native subagent API와 OMX `metrics.json`은 per-subagent 정확 토큰 사용량을 제공하지 않는다. 따라서 정확값은 `null`로 두고, 산출물 크기 기준 추정값을 함께 기록한다.

추정 방식은 산출물 byte 수 / 4다. 실제 사용량은 subagent가 받은 시스템 지침, 사용자 지시, repo context, tool output, 내부 reasoning, 최종 응답을 모두 포함하므로 이 값보다 클 수 있다.

## 표

| 담당 | 표시 이름 | 모델 | Reasoning | 정확 입력 | 정확 출력 | 정확 합계 | 산출물 bytes | 추정 visible tokens | 출처 |
|---|---|---|---|---:|---:|---:|---:|---:|---|
| `test-engineer` | 테스트 기준 재확정 | `gpt-5.5` | medium | null | null | null | 3070 | 768 | estimated |
| `analyst` | 사람 승인 게이트 | `gpt-5.5` | medium | null | null | null | 937 | 234 | estimated |
| `executor` | 최소 구현 | `gpt-5.5` | medium | null | null | null | 3091 | 773 | estimated |
| `verifier` | Green 1차 검증 | `gpt-5.5` | high | null | null | null | 2651 | 663 | estimated |
| `build-fixer` | Green 실패 복구 | `gpt-5.5` | high | null | null | null | 1814 | 454 | estimated |
| `verifier` | Green 재검증 | `gpt-5.5` | high | null | null | null | 2077 | 519 | estimated |
| `code-simplifier` -> `writer` | 리팩터링 및 artifact 복구 | `gpt-5.5` | high | null | null | null | 2982 | 746 | estimated |
| `verifier` | 최종 검증 | `gpt-5.5` | high | null | null | null | 2232 | 558 | estimated |
| `code-reviewer` | 최종 코드 리뷰 | `gpt-5.5` | high | null | null | null | 906 | 227 | estimated |
| `writer` | MR/Wiki/Graph 환류 | `gpt-5.5` | high | null | null | null | 10015 | 2504 | estimated |
| `git-master` | PR 대상 저장소 보정 | `gpt-5.5` | high | null | null | null | 2460 | 615 | estimated |

## 합계

- 정확 합계: unavailable
- 추정 visible tokens 합계: 8061
- 추정 방식: 산출물 byte 수 / 4
- 한계: 실제 사용량은 subagent별 전체 입력과 도구 출력까지 포함하므로 산출물 기반 추정값과 다르다.
