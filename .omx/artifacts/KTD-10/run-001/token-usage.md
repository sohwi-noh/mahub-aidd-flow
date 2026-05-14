# KTD-10 run-001 토큰 사용 기록

## 도구 노출 한계

Codex native subagent별 실제 토큰 사용량은 현재 도구 응답에 노출되지 않을 수 있다.

## Subagent별 기록

| 산출물 | 역할 | 모델/추론 노력 | reportedTotalTokens |
|---|---|---|---:|
| `01-analyst-intake.md` | analyst | gpt-5.5/medium | null |

## 해석

정확 토큰 값이 노출되지 않으면 dashboard에는 `null` 또는 `unavailable`로 표시한다.

run-001에서는 subagent 역할, 모델, reasoning, artifact 경로는 기록됐지만 정확 token 사용량은 노출되지 않았다.
