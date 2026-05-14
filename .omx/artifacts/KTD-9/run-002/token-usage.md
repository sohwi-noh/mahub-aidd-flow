# KTD-9 run-002 토큰 사용량

## 전제

현재 Codex App native subagent API와 OMX `metrics.json`은 per-subagent 정확 토큰 사용량을 제공하지 않는다. 따라서 정확값은 `null`로 두고, 산출물 크기 기준 추정값을 함께 기록한다.

## 표

| 담당 | 표시 이름 | 모델 | Reasoning | 정확 입력 | 정확 출력 | 정확 합계 | 산출물 bytes | 추정 visible tokens | 출처 |
|---|---|---|---|---:|---:|---:|---:|---:|---|
| `test-engineer` | 테스트 명세 작성 | `gpt-5.5` | medium | null | null | null | 9503 | 2376 | estimated |
| leader | Red 실패 증거 수집 | `gpt-5.5` | high | null | null | null | 2153 | 538 | estimated |

## 합계

- 정확 합계: unavailable
- 추정 visible tokens 합계: 2914
- 추정 방식: 산출물 byte 수 / 4
- 한계: 실제 사용량은 subagent가 받은 prompt, 시스템 지침, repo context, tool output, 최종 응답을 모두 포함하므로 이 값보다 클 수 있다.

