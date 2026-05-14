# KTD-9 run-001 토큰 사용량

## 전제

현재 Codex App native subagent API와 OMX `metrics.json`은 per-subagent 정확 토큰 사용량을 제공하지 않는다. 따라서 이 run에서는 정확값을 `null`로 두고, 사람이 볼 수 있는 산출물 크기 기준의 대략 추정값만 기록한다.

## 표

| Agent | 표시 이름 | 모델 | Reasoning | 정확 입력 | 정확 출력 | 정확 합계 | 산출물 bytes | 추정 visible tokens | 출처 |
|---|---|---|---|---:|---:|---:|---:|---:|---|
| `analyst` | Intake Analyst | `gpt-5.5` | medium | null | null | null | 0 | 0 | unavailable |
| `architect` | Architecture Mapper | `gpt-5.5` | high | null | null | null | 0 | 0 | unavailable |
| `planner` | Implementation Planner | `gpt-5.5` | medium | null | null | null | 7365 | 1842 | estimated |
| `executor` | Analyst Artifact Recorder | `gpt-5.5` | medium | null | null | null | 3992 | 998 | estimated |
| `executor` | Architect Artifact Recorder | `gpt-5.5` | medium | null | null | null | 4467 | 1117 | estimated |

## 합계

- 정확 합계: unavailable
- 추정 visible tokens 합계: 3957
- 추정 방식: 산출물 byte 수 / 4
- 한계: 실제 사용량은 subagent가 받은 prompt, 시스템 지침, repo context, tool output, 최종 응답을 모두 포함하므로 이 값보다 클 수 있다.

